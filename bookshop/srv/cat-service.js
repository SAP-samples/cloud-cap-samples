const cds = require('@sap/cds')

class CatalogService extends cds.ApplicationService { init(){

  const { Books } = cds.entities ('sap.capire.bookshop')

  // Reduce stock of ordered books if available stock suffices
  this.on ('submitOrder', async req => {
    const {book,quantity} = req.data
    if (quantity < 1) return req.reject (400,`quantity has to be 1 or more`)
    let {stock} = await SELECT `stock` .from (Books,book)
    if (quantity > stock) return req.reject (409, "ORDER_EXCEEDS_STOCK", [quantity, book])
    await UPDATE (Books,book) .with ({ stock: stock -= quantity })
    await this.emit ('OrderedBook', { book, quantity, buyer:req.user.id })
    return { stock }
  })

  // Add some discount for overstocked books
  this.after ('READ','ListOfBooks', each => {
    if (each.stock > 111) each.title += ` -- 11% discount!`
  })

  return super.init()
}}

module.exports = { CatalogService }
