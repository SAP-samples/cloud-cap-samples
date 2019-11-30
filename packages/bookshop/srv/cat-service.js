const cds = require('@sap/cds')
const { Books, ShippingAddresses } = cds.entities

const bupaSrv = cds.connect.to('API_BUSINESS_PARTNER')

/** Service implementation for CatalogService */
module.exports = cds.service.impl(function () {
  this.after(
    'READ',
    'Books',
    each => each.stock > 111 && _addDiscount2(each, 11)
  )
  this.before('CREATE', 'Orders', _reduceStock)
  this.before('CREATE', 'Orders', _fillAddress)

  this.on('READ', 'Addresses', _readAddresses)

  // this.after('READ', 'Orders', (data, req) => {
  //   if (req.query.SELECT.columns.includes('shippingAddress')) {
  //     data.shippingAddress = _readAddresses()
  //   }
  // })
})

function _readAddresses (req) {
  // TODO: Delegate to external service
  return [
    { AddressID: 'add1', CityName: 'Walldorf', StreetName: 'ExampleStreet' },
    { AddressID: 'add2', CityName: 'Schwetzingen', StreetName: 'BestStreet' }
  ]
}

/** Add some discount for overstocked books */
function _addDiscount2 (each, discount) {
  each.title += ` -- ${discount}% discount!`
}

async function _fillAddress (req) {
  console.log('filling addresses')
  if (req.data.shippingAdress_AddressID) {
    const tx = bupaSrv.transaction(req)
    const result = tx.run(
      SELECT.one(['AdressID, CityName, StreetName, HouseNumber'])
        .from('A_BusinessPartnerAddress')
        .where({ AddressID: req.data.shippingAdress_AddressID })
    )
    if (result) {
      const tx2 = cds.transaction(req)
      console.log('filling addresses for real')
      tx2.run(INSERT.into(ShippingAddresses).entries([result]))
    }
  }
}

/** Reduce stock of ordered books if available stock suffices */
async function _reduceStock (req) {
  const { Items: OrderItems } = req.data
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
