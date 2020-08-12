const cds = require('@sap/cds')

module.exports = cds.service.impl(function() {

  const { Books } = cds.entities

  // Reduce stock of ordered books if available stock suffices
  this.before ('CREATE', 'Orders', (req) => {
    const { Items: items } = req.data
    return cds.transaction(req) .run (items.map (item =>
      UPDATE (Books) .where ('ID =', item.book_ID)
      .and ('stock >=', item.amount)
      .set ('stock -=', item.amount)
    )) .then (all => all.forEach ((affectedRows,i) => {
      if (affectedRows === 0)  req.error (409,
        `${items[i].amount} exceeds stock for book #${items[i].book_ID}`
      )
    }))
  })

})
