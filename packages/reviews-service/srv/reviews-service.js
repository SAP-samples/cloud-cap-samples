const cds = require('@sap/cds')
module.exports = cds.service.impl((srv) => {

  // Get the CSN definition for Reviews from the db schema for sub-sequent queries
  // ( Note: we explicitly specify the namespace to support embedded reuse )
  const { Reviews, Likes } = cds.entities('sap.capire.reviews')

  // Increment counter for reviews considered helpful
  srv.on ('like', (req) => {
     if (!req.user)  return req.reject(400, 'You must be identified to like a review')
     const {review} = req.data, {user} = req
     const tx = cds.transaction(req)
     return tx.run ([
       INSERT.into (Likes) .entries ({review_ID: review, user: user.id}),
       UPDATE (Reviews) .set({liked: {'+=': 1}}) .where({ID:review})
     ]).catch(() => req.reject(400, 'You already liked that review'))
  })

  // Delete a former like by the same user
  srv.on('unlike', async (req) => {
      if (!req.user) return req.reject(400, 'You must be identified to remove a former like of yours')
      const { review } = req.data, { user } = req
      const tx = cds.transaction(req)
      const affectedRows = await tx.run(DELETE.from(Likes).where({ review_ID: review, user: user.id }))
      if (affectedRows === 1) return tx.run(UPDATE(Reviews).set({ liked: { '-=': 1 } }).where({ ID: review }))
   })

  // Emit an event to inform subscribers about new avg ratings for reviewed subjects
  // ( Note: req.on.succeeded ensures we only do that if there's no error )
  srv.after(['CREATE', 'UPDATE', 'DELETE'], 'Reviews', async (_, req) => {
    const { subject } = req.data
    const { rating } = await cds.transaction(req).run(
      SELECT.one(['avg(rating) as rating']).from(Reviews).where({ subject })
    )
    req.on('succeeded', () => {
      srv.emit('reviewed', { subject, rating })
      console.log(`Reviewed event was emitted for book "${subject}" with rating ${rating}.`)
    })
  })
})