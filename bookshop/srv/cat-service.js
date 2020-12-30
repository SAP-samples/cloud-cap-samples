const cds = require('@sap/cds')

class CatalogService extends cds.ApplicationService { init(){

  // Reflect entities from model
  const { Books } = cds.entities ('sap.capire.bookshop')

  // Reduce stock of ordered books if available stock suffices
  this.on ('submitOrder', async req => {
    const {book,amount} = req.data
    // Read stock from database
    let {stock} = await SELECT.from (Books, book, b => b.stock)
    if (stock >= amount) {
      // Reduce stock by ordered amount
      await UPDATE (Books,book) .with ({ stock: stock -= amount })
      // Emit event to inform others
      await this.emit ('OrderedBook', { book, amount, buyer:req.user.id })
      // Return reduced stock to caller
      return req.reply ({ stock })
    }
    // Return error about insufficient stock
    else return req.error (409,`${amount} exceeds stock for book #${book}`)
  })

  // Add some discount for overstocked books
  this.after ('READ','Books', each => {
    if (each.stock > 111) each.title += ` -- 11% discount!`
  })

  return super.init()
}}

module.exports = { CatalogService }
