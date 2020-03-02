const cds = require('@sap/cds')

/** Service implementation for CatalogService */
module.exports = cds.service.impl (function() {

  // Get entity definitions from reflected model
  const { Books } = cds.entities

  // Add some discount for overstocked books
  this.after ('READ', 'Books', each => {
    if (each.stock > 111)  each.title += ` -- 11% discount!`
  })

  // Reduce stock of ordered books if available stock suffices
  this.on ('order', async (req) => {
    const {UPDATE} = cds.ql(req), {book,amount} = req.data
    const n = await UPDATE (Books, book)
      .where ('stock >=', amount)
      .set ('stock -=', amount)
    n > 0 || req.error (409,`${amount} exceeds stock for book #${book}`)
  })

})
