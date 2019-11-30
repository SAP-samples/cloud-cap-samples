const cds = require('@sap/cds')
const { Books, ShippingAddresses } = cds.entities

const bupaSrv = cds.connect.to('API_BUSINESS_PARTNER')

/** Service implementation for CatalogService */
module.exports = cds.service.impl(function () {
  this.before('CREATE', 'Orders', _reduceStock)
  // this.before('CREATE', 'Orders', _fillAddress)
  this.before('PATCH', 'Orders', _fillAddress)

  this.on('READ', 'Addresses', _readAddresses)
})

function _readAddresses (req) {
  // TODO: Delegate to external service
}

/** Fill Address data from external service */
async function _fillAddress (req) {
  console.log('retrieving addresses')
  if (req.data.shippingAddress_AddressID) {
    const tx = bupaSrv.transaction(req)
    const response = await tx.run(
      SELECT.from('API_BUSINESS_PARTNER.A_BusinessPartnerAddress')
        .columns('AddressID', 'CityName', 'StreetName', 'HouseNumber')
        .where({ AddressID: req.data.shippingAddress_AddressID })
    )
    if (response && response.length > 0) {
      console.log('filling addresses')
      const tx2 = cds.transaction(req)
      try {
        await tx2.run(
          INSERT.into('sap.capire.bookshop.ShippingAddresses').entries(response)
        )
      } catch (e) {
        // already in there
      }
    } else {
      req.error('Shipping address not found.')
    }
  }
}

/** Reduce stock of ordered books if available stock suffices */
async function _reduceStock (req) {
  const { Items: OrderItems } = req.data
  if (OrderItems && OrderItems.length > 0) {
    const all = await cds.transaction(req).run(() =>
      OrderItems.map(order =>
        UPDATE(Books)
          .set('stock -=', order.amount)
          .where('ID =', order.book_ID)
          .and('stock >=', order.amount)
      )
    )
    all.forEach((affectedRows, i) => {
      if (affectedRows === 0)
        req.error(
          409,
          `${OrderItems[i].amount} exceeds stock for book #${
            OrderItems[i].book_ID
          }`
        )
    })
  }
}
