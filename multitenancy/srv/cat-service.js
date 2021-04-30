const cds = require('@sap/cds')
const { Books } = cds.entities ('sap.capire.bookshop')

class CatalogService extends cds.ApplicationService { init(){

  // Reduce stock of ordered books if available stock suffices
  this.on ('submitOrder', async req => {
    const {book,amount} = req.data
    let {stock} = await SELECT `stock` .from (Books,book)
    if (stock >= amount) {
      await UPDATE (Books,book) .with (`stock -=`, amount)
      await this.emit ('OrderedBook', { book, amount, buyer:req.user.id })
      return { stock }
    }
    else return req.error (409,`${amount} exceeds stock for book #${book}`)
  })

  // Add some discount for overstocked books
  this.after ('READ','ListOfBooks', each => {
    if (each.stock > 111) each.title += ` -- 11% discount!`
  })

  return super.init()
}}

module.exports = { CatalogService }
