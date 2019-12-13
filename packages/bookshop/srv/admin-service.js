const cds = require('@sap/cds')
const { Books, ShippingAddresses } = cds.entities

const bupaSrv = cds.connect.to('API_BUSINESS_PARTNER')

const _diff = (obj1, obj2) =>
  Object.keys(obj1).reduce(
    (res, curr) =>
      obj1[curr] === obj2[curr] ? res : (res[curr] = obj2[curr]) && res,
    {}
  )

const _qlsToUpdateDifferences = (ownAddresses, remoteAddresses) =>
  ownAddresses
    .map(ownAddress => {
      const remoteAddress = remoteAddresses.find(
        address =>
          address.BusinessPartner === ownAddress.BusinessPartner &&
          address.AddressID === ownAddress.AddressID
      )
      if (remoteAddress) {
        const diff = _diff(ownAddress, remoteAddress)
        if (Object.keys(diff).length) {
          return UPDATE(ShippingAddresses)
            .set(diff)
            .where({
              BusinessPartner: ownAddress.BusinessPartner,
              AddressID: ownAddress.AddressID
            })
        }
      }
    })
    .filter(el => el)

bupaSrv.on('sap/S4HANAOD/c532/BO/BusinessPartner/Changed', async msg => {
  console.log('>> Message:', msg.data)

  const BusinessPartner = msg.data.KEY[0].BUSINESSPARTNER
  const tx = cds.transaction(msg)
  const selectQl = SELECT.from(ShippingAddresses).where({ BusinessPartner })

  const ownAddresses = await tx.run(selectQl)
  if (ownAddresses && ownAddresses.length > 0) {
    const txExt = bupaSrv.transaction(msg)
    try {
      const remoteAddresses = await txExt.run(selectQl)
      const qlsToUpdateDifferences = _qlsToUpdateDifferences(
        ownAddresses,
        remoteAddresses
      )
      await tx.run(qlsToUpdateDifferences)
    } catch (e) {
      console.error(e)
    }
  }
})

async function _readAddresses (req) {
  console.log('Addresses', ShippingAddresses)
  const BusinessPartner = req.user.id
  const txExt = bupaSrv.transaction(req)
  const ql = req.query.from(ShippingAddresses).where({ BusinessPartner })

  try {
    const result = await txExt.run(ql)
    return result
  } catch (e) {
    console.error(e)
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
        const qlStatement = INSERT.into(ShippingAddresses).entries(response)
        await tx.run(qlStatement)
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

function _checkMandatoryParams(req) {
  if (!req.data.Items || !req.data.Items.length){
   return req.reject('Please order at least one item.')
  }
  if (!req.data.shippingAddress_AddressID) {
   return req.reject('Please enter a valid shpping address.', 'shippingAddess_AddressID')
  }
}

module.exports = cds.service.impl(function () {
  this.before('CREATE', 'Orders', _reduceStock)
  this.before('CREATE', 'Orders', _checkMandatoryParams)
  this.before('PATCH', 'Orders', _fillAddress)
  this.on('READ', 'Addresses', _readAddresses)
})
