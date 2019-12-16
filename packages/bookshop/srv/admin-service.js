const cds = require('@sap/cds')
const { queriesToUpdateDifferences } = require('./utils')
const { Books, ShippingAddresses } = cds.entities

const bupaSrv = cds.connect.to('API_BUSINESS_PARTNER')

bupaSrv.on('sap/S4HANAOD/c532/BO/BusinessPartner/Changed', async msg => {
  console.log('>> Message:', msg.data)

  const BusinessPartner = msg.data.KEY[0].BUSINESSPARTNER
  const tx = cds.transaction(msg)
  const selectQuery = SELECT.from(ShippingAddresses).where({ BusinessPartner })

  const ownAddresses = await tx.run(selectQuery)
  if (ownAddresses && ownAddresses.length > 0) {
    const txExt = bupaSrv.transaction(msg)
    try {
      const remoteAddresses = await txExt.run(selectQuery)
      const updateQueries = queriesToUpdateDifferences(
        ShippingAddresses,
        ownAddresses,
        remoteAddresses
      )
      await tx.run(updateQueries)
    } catch (e) {
      console.error(e)
    }
  }
})

async function _readAddresses (req) {
  console.log('Addresses', ShippingAddresses)
  const BusinessPartner = req.user.id
  const txExt = bupaSrv.transaction(req)
  const selectQuery = req.query
    .from(ShippingAddresses)
    .where({ BusinessPartner })

  try {
    return txExt.run(selectQuery)
  } catch (e) {
    console.log(e)
  }
}

async function _fillAddress (req) {
  if (req.data.shippingAddress_AddressID) {
    const BusinessPartner = req.user.id
    const txExt = bupaSrv.transaction(req)
    try {
      const response = await txExt.run(
        SELECT.from(ShippingAddresses).where({
          AddressID: req.data.shippingAddress_AddressID,
          BusinessPartner
        })
      )
      if (response && response.length === 1) {
        const tx = cds.transaction(req)
        const insertQuery = INSERT.into(ShippingAddresses).entries(response)
        await tx.run(insertQuery)
      }
    } catch (e) {}
  }
}

async function _reduceStock (req) {
  const { Items: OrderItems } = req.data
  if (OrderItems && OrderItems.length > 0) {
    const all = await cds.transaction(req).run(
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

function _checkMandatoryParams (req) {
  if (!req.data.Items || !req.data.Items.length) {
    return req.reject('Please order at least one item.')
  }
  if (!req.data.shippingAddress_AddressID) {
    return req.reject(
      'Please enter a valid shpping address.',
      'shippingAddress_AddressID'
    )
  }
}

module.exports = cds.service.impl(function () {
  this.before('CREATE', 'Orders', _reduceStock)
  this.before('CREATE', 'Orders', _checkMandatoryParams)
  this.before('PATCH', 'Orders', _fillAddress)
  this.on('READ', 'Addresses', _readAddresses)
})
