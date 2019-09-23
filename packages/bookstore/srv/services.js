const cds = require('@sap/cds')
module.exports = async (srv) => {

  const { Books } = srv.entities
  // Check all amounts against stock before activating
  srv.before(['CREATE', 'UPDATE'], 'Orders', (req) => {
    const tx = cds.transaction(req), order = req.data
    return Promise.all(order.Items.map(each => tx.run(
      UPDATE(Books).where({ ID: each.book_ID })
        .and(`stock >=`, each.amount)
        .set(`stock -=`, each.amount)
    ).then(affectedRows => {
      if (!affectedRows) {
        req.error(409, `${each.amount} exceeds stock for book #${each.book_ID}`)
      }
    })))
  })

  const reviews_srv = await cds.connect.to('sap.capire.reviews.ReviewsService')

  // react on event messages from reviews service
  reviews_srv.on('reviewed', (msg) => {
      console.debug('> received', msg)
  })

  // delegate requests to reviews service
  srv.on('READ', 'Reviews', async (req) => {
    const { Reviews } = reviews_srv.entities

    const tx = reviews_srv.transaction(req)
    const results = await tx.read(Reviews)

    return results
  })
}