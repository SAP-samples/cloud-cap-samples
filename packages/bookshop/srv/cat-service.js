const cds = require('@sap/cds')

/** Service implementation for CatalogService */
module.exports = cds.service.impl(async function () {
  const { Books, Orders, BusinessPartners } = this.entities
  const bupaSrv = await cds.connect.to('API_BUSINESS_PARTNER')
  this.after('READ', Books, each => each.stock > 111 && _addDiscount2(each, 11))
  this.before('CREATE', Orders, _reduceStock)
  this.on('READ', BusinessPartners, req => bupaSrv.tx(req).run(req.query))

  bupaSrv.on('BusinessPartner/Changed', async msg => {
    console.log('>> Received', msg.data)
    const BUSINESSPARTNER = msg.data.KEY[0].BUSINESSPARTNER
    const orders = await cds.tx(msg).run(SELECT('ID').from(Orders).where({ createdBy: BUSINESSPARTNER }))
    if (!orders.length) return
    const businessPartner = await bupaSrv.tx(msg).run(SELECT.one(BusinessPartners).where({ ID: BUSINESSPARTNER }))
    if (!businessPartner || !businessPartner.BusinessPartnerIsBlocked) return
    orders.forEach(order => this.emit('OrderBlocked', order) && console.log('>> Emitted', order))
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
})
