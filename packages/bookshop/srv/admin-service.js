const cds = require('@sap/cds')
const { Books, ShippingAddresses, UserMappings } = cds.entities

const bupaSrv = cds.connect.to('API_BUSINESS_PARTNER')

/** Service implementation for CatalogService */
module.exports = cds.service.impl(function () {
  this.before('CREATE', 'Orders', _reduceStock)
  this.before('PATCH', 'Orders', _fillAddress)

  this.on('READ', 'Addresses', _readAddresses)
})

async function _readAddresses (req) {
  const businessPartnerID = await _getBusinessPartnerID(req)
  const tx = bupaSrv.transaction(req)
  const ql = SELECT.from('API_BUSINESS_PARTNER.A_BusinessPartnerAddress').where(
    { BusinessPartner: businessPartnerID }
  )
  if (req.query && req.query.SELECT && req.query.SELECT.columns) {
    ql.columns(req.query.SELECT.columns)
  } else {
    ql.columns('AddressID', 'CityName', 'StreetName', 'HouseNumber')
  }
  if (req.query && req.query.SELECT && req.query.SELECT.where) {
    ql.where(req.query.SELECT.where)
  }
  const result = await tx.run(ql)
  delete result.BusinessPartner
  return result
}

async function _getBusinessPartnerID (req) {
  const ownTx = cds.transaction(req)
  const { businessPartnerID } = await ownTx.run(
    SELECT.one(['businessPartnerID'])
      .from(UserMappings)
      .where({ userID: req.user.id })
  )
  return businessPartnerID
}

/** Fill Address data from external service */
async function _fillAddress (req) {
  if (req.data.shippingAddress_AddressID) {
    const businessPartnerID = await _getBusinessPartnerID(req)
    const tx = bupaSrv.transaction(req)
    const response = await tx.run(
      SELECT.from('API_BUSINESS_PARTNER.A_BusinessPartnerAddress')
        .columns('AddressID', 'CityName', 'StreetName', 'HouseNumber')
        .where({
          AddressID: req.data.shippingAddress_AddressID,
          BusinessPartner: businessPartnerID
        })
    )
    if (response && response.length > 0) {
      const tx2 = cds.transaction(req)
      try {
        await tx2.run(INSERT.into(ShippingAddresses).entries(response))
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
