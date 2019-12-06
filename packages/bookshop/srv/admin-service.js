const cds = require('@sap/cds')
const { Books, ShippingAddresses, Orders } = cds.entities
const RELEVANT_ADDRESS_COLUMNS = [
  'AddressID',
  'BusinessPartner',
  'CityName',
  'StreetName',
  'PostalCode',
  'Country',
  'HouseNumber'
]

const bupaSrv = cds.connect.to('API_BUSINESS_PARTNER')
const messagingSrv = cds.connect.to('messaging')

messagingSrv.on('sap/messaging/ccf/BO/BusinessPartner/Changed', async msg => {
  console.log('>> MSG', msg.data)
  const BusinessPartner = msg.data.KEY[0].BUSINESSPARTNER
  // TODO: Remove toLower hack.
  // Every BusinessPartner from S/4HANA is UPPERCASE.
  const ownOrders = await cds.run(SELECT.from(Orders).where('createdBy like', BusinessPartner))
  console.log(ownOrders)
  // const ownAddresses = await cds.run(
  //   SELECT(['AddressID'])
  //     .from(ShippingAddresses)
  //     .where({ BusinessPartner: businessPartner })
  // )
  // if (ownAddresses && ownAddresses.length > 0) {
  //   console.log('found business partner', businessPartner)
  // }
  // const tx = bupaSrv.transaction()
  // const remoteAddresses = await Promise.all(
  //   ownAddresses.map(addressResult => {
  //     return tx.run(
  //       SELECT.one.from('API_BUSINESS_PARTNER.A_BusinessPartnerAddress')
  //         .columns(RELEVANT_ADDRESS_COLUMNS)
  //         .where({
  //           AddressID: addressResult.AddressID,
  //           BusinessPartner: businessPartner
  //         })
  //     )
  //   })
  // )
  // console.log('addresses found:', remoteAddresses)
  // await Promise.all(remoteAddresses.map(address => {
  //   console.log('updating', address)
  //   if (address) {
  //     return cds.run(UPDATE(ShippingAddresses).set(address))
  //   }
  // }))
})

/** Service implementation for CatalogService */
module.exports = cds.service.impl(function () {
  this.before('CREATE', 'Orders', _reduceStock)
  this.before('PATCH', 'Orders', _fillAddress)
  this.on('READ', 'Addresses', _readAddresses)
})

async function _readAddresses (req) {
  const businessPartner = req.user.id
  const tx = bupaSrv.transaction(req)
  const ql = SELECT.from('API_BUSINESS_PARTNER.A_BusinessPartnerAddress').where(
    { BusinessPartner: businessPartner.toUpperCase() }
  )
  if (req.query && req.query.SELECT && req.query.SELECT.columns) {
    ql.columns(req.query.SELECT.columns)
  } else {
    ql.columns(RELEVANT_ADDRESS_COLUMNS)
  }
  if (req.query && req.query.SELECT && req.query.SELECT.where) {
    ql.where(req.query.SELECT.where)
  }
  const result = await tx.run(ql)
  delete result.BusinessPartner
  return result
}

/** Fill Address data from external service */
async function _fillAddress (req) {
  if (req.data.shippingAddress_AddressID) {
    const businessPartner = req.user.id
    const tx = bupaSrv.transaction(req)
    const response = await tx.run(
      SELECT.from('API_BUSINESS_PARTNER.A_BusinessPartnerAddress')
        .columns(RELEVANT_ADDRESS_COLUMNS)
        .where({
          AddressID: req.data.shippingAddress_AddressID,
          BusinessPartner: businessPartner.toUpperCase()
        })
    )
    if (response && response.length > 0) {
      console.log('to be inserted: ', response)
      const tx2 = cds.transaction(req)
      try {
        await tx2.run(INSERT.into(ShippingAddresses).entries(response))
      } catch (e) {
        // already in there
        console.log(e)
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
