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
}