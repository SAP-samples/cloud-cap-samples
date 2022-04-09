const cds = require('@sap/cds')
class CatalogService extends cds.ApplicationService { async init(){

  const { Books } = cds.entities ('sap.capire.bookshop')
  const { ListOfBooks } = this.entities

  this.on('READ','ListOfBooks', ()=>{
    Error.stackTraceLimit = 22
    cds._debug = true
    return SELECT.from (ListOfBooks)
  })

  // Reduce stock of ordered books if available stock suffices
  this.on ('submitOrder', async req => {
    const {book,quantity} = req.data
    if (quantity < 1) return req.reject (400,`quantity has to be 1 or more`)
    cds._debug = true
    let b = await SELECT `stock` .from (Books,book)
    if (!b) return req.error (404,`Book #${book} doesn't exist`)
    let {stock} = b
    if (quantity > stock) return req.reject (409,`${quantity} exceeds stock for book #${book}`)
    await UPDATE (Books,book) .with ({ stock: stock -= quantity })
    await this.emit ('OrderedBook', { book, quantity, buyer:req.user.id })
    return { stock }
  })

  // Add some discount for overstocked books
  this.after ('READ','ListOfBooks', each => {
    if (each.stock > 111) each.title += ` -- 11% discount!`
  })

  await super.init()
  return
}}

module.exports = { CatalogService }
