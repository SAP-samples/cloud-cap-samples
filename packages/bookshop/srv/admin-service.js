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
        console.log('changing', diff)
        return (
          Object.keys(diff).length &&
          UPDATE(ShippingAddresses)
            .set(diff)
            .where({
              BusinessPartner: ownAddress.BusinessPartner,
              AddressID: ownAddress.AddressID
            })
        )
      }
      return DELETE(ShippingAddresses).where({
        BusinessPartner: ownAddress.BusinessPartner,
        AddressID: ownAddress.AddressID
      })
    })
    .filter(el => el)

bupaSrv.on('sap/messaging/ccf/BO/BusinessPartner/Changed', async msg => {
  console.log('>> Message:', msg.data)
  const BusinessPartner = msg.data.KEY[0].BUSINESSPARTNER
  const tx = cds.transaction()
  const selectQl = SELECT.from(ShippingAddresses).where({ BusinessPartner })

  const ownAddresses = await tx.run(selectQl)
  console.log('own:', ownAddresses)
  if (ownAddresses && ownAddresses.length > 0) {
    console.log('found')
    const txExt = bupaSrv.transaction()
    const remoteAddresses = await txExt.run(selectQl)

    await _qlsToUpdateDifferences(ownAddresses, remoteAddresses).map(async ql =>
      await tx.run(ql)
    )
  }
  await tx.commit()
})

module.exports = cds.service.impl(function () {
  async function _readAddresses (req) {
    console.log('Addresses', ShippingAddresses)
    const BusinessPartner = req.user.id
    const txExt = bupaSrv.transaction(req)
    const ql = SELECT.from(ShippingAddresses).where({
      BusinessPartner
    })
    if (req.query && req.query.SELECT && req.query.SELECT.columns) {
      ql.columns(req.query.SELECT.columns)
    }
    if (req.query && req.query.SELECT && req.query.SELECT.where) {
      ql.where(req.query.SELECT.where)
    }

    const result = await txExt.run(ql)

    return result
  }

  async function _fillAddress (req) {
    if (req.data.shippingAddress_AddressID) {
      const BusinessPartner = req.user.id
      const txExt = bupaSrv.transaction(req)
      const response = await txExt.run(
        SELECT.from(ShippingAddresses).where({
          AddressID: req.data.shippingAddress_AddressID,
          BusinessPartner
        })
      )
      if (response && response.length > 0) {
        const tx = cds.transaction(req)
        try {
          const qlStatement = INSERT.into(ShippingAddresses).entries(response)
          await tx.run(qlStatement)
        } catch (e) {
          // already in there
        }
      } else {
        req.error('Shipping address not found.')
      }
    }
  }

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

  this.before('CREATE', 'Orders', _reduceStock)
  this.before('PATCH', 'Orders', _fillAddress)
  this.on('READ', 'Addresses', _readAddresses)
})
