const cds = require('@sap/cds')

/** Service implementation for CatalogService */
module.exports = cds.service.impl(async function () {
  const { Books, Addresses, Orders } = this.entities
  const bupaSrv = await cds.connect.to('API_BUSINESS_PARTNER')
  this.after('READ', Books, each => each.stock > 111 && _addDiscount2(each, 11))
  this.before('CREATE', Orders, _reduceStock)
  this.on('READ', Addresses, req => bupaSrv.tx(req).run(req.query))
  this.on('BusinessPartner/Changed', async msg => {
    console.log('>> Received message', msg.data)
    const BUSINESSPARTNER = msg.data.KEY[0].BUSINESSPARTNER
    const orders = await cds.tx(msg).run(SELECT.from(Orders).where({ createdBy: BUSINESSPARTNER }))
    console.log(orders)
  })
})

/** Add some discount for overstocked books */
function _addDiscount2(each, discount) {
  each.title += ` -- ${discount}% discount!`
}

/** Reduce stock of ordered books if available stock suffices */
async function _reduceStock(req) {
  const { Items: OrderItems } = req.data
  return cds.transaction(req).run(() => OrderItems.map(order =>
    UPDATE(Books).set('stock -=', order.amount)
      .where('ID =', order.book_ID).and('stock >=', order.amount)
  )).then(all => all.forEach((affectedRows, i) => {
    if (affectedRows === 0) req.error(409,
      `${OrderItems[i].amount} exceeds stock for book #${OrderItems[i].book_ID}`
    )
  }))
}
