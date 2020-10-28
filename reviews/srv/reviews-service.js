const cds = require ('@sap/cds')
module.exports = cds.service.impl (async function(){

  // Get the CSN definition for Reviews from the db schema for sub-sequent queries
  // ( Note: we explicitly specify the namespace to support embedded reuse )
  const { Reviews, Likes } = this.entities ('sap.capire.reviews')

  this.before (['CREATE','UPDATE'], 'Reviews', req => {
    if (!req.data.rating) req.data.rating = Math.round(Math.random()*4)+1
  })

  // Emit an event to inform subscribers about new avg ratings for reviewed subjects
  this.after (['CREATE','UPDATE','DELETE'], 'Reviews', async function(_,req) {
    const {subject} = req.data
    const {rating} = await cds.tx(req) .run (
      SELECT.one (['round(avg(rating),2) as rating']) .from (Reviews) .where ({subject})
    )
    global.it || console.log ('< emitting:', 'reviewed', { subject, rating })
    this.emit ('reviewed', { subject, rating })
  })

  // Increment counter for reviews considered helpful
  this.on ('like', (req) => {
    if (!req.user)  return req.reject(400, 'You must be identified to like a review')
    const {review} = req.data, {user} = req
    const tx = cds.tx(req)
    return tx.run ([
      INSERT.into (Likes) .entries ({review_ID: review, user: user.id}),
      UPDATE (Reviews) .set({liked: {'+=': 1}}) .where({ID:review})
    ]).catch(() => req.reject(400, 'You already liked that review'))
  })

  // Delete a former like by the same user
  this.on ('unlike', async (req) => {
    if (!req.user)  return req.reject(400, 'You must be identified to remove a former like of yours')
    const {review} = req.data, {user} = req
    const tx = cds.tx(req)
    const affectedRows = await tx.run (DELETE.from (Likes) .where ({review_ID: review,user: user.id}))
    if (affectedRows === 1)  return tx.run (UPDATE (Reviews) .set ({liked: {'-=': 1}}) .where ({ID:review}))
  })

})
