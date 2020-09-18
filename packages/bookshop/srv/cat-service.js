const cds = require('@sap/cds')
const { Books } = cds.entities

/** Service implementation for CatalogService */
module.exports = cds.service.impl(function() {
  this.after ('READ', 'Books', each => each.stock > 111 && _addDiscount2(each,11))
  this.before ('CREATE', 'Orders', _reduceStock)
})

/** Add some discount for overstocked books */
function _addDiscount2 (each,discount) {
  each.title += ` -- ${discount}% discount!`
}

/** Reduce stock of ordered books if available stock suffices */
async function _reduceStock (req) {
  const { Items: orderItems } = req.data
  if (!Array.isArray(orderItems))  return

  const all = await cds.transaction(req).run(orderItems.map(item =>
    UPDATE(Books)
      .set('stock -=', item.amount)
      .where('ID =', item.book_ID).and('stock >=', item.amount)
  ))
  all.forEach((affectedRows, i) => {
    if (affectedRows === 0) {
      req.error(409, `${orderItems[i].amount} exceeds stock for book #${orderItems[i].book_ID}`)
    }
  })

 return all

}
