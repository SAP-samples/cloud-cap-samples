const cds = require('@sap/cds')

module.exports = cds.service.impl(function() {

  const { Books } = cds.entities

  // Reduce stock of ordered books if available stock suffices
  this.before ('CREATE', 'Orders', (req) => {
    const { Items: OrderItems } = req.data
    return cds.transaction(req) .run (()=> OrderItems.map (order =>
      UPDATE (Books) .where ('ID =', order.book_ID)
      .and ('stock >=', order.amount)
      .set ('stock -=', order.amount)
    )) .then (all => all.forEach ((affectedRows,i) => {
      if (affectedRows === 0)  req.error (409,
        `${OrderItems[i].amount} exceeds stock for book #${OrderItems[i].book_ID}`
      )
    }))
  })

})
