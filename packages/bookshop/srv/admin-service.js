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
          address.businessPartner === ownAddress.businessPartner &&
          address.addressID === ownAddress.addressID
      )
      if (remoteAddress) {
        const diff = _diff(ownAddress, remoteAddress)
        console.log('changing', diff)
        return (
          Object.keys(diff).length &&
          UPDATE(ShippingAddresses)
            .set(diff)
            .where({
              businessPartner: ownAddress.businessPartner,
              addressID: ownAddress.addressID
            })
        )
      }
      return DELETE(ShippingAddresses).where({
        businessPartner: ownAddress.businessPartner,
        addressID: ownAddress.addressID
      })
    })
    .filter(el => el)

bupaSrv.on('sap/messaging/ccf/BO/BusinessPartner/Changed', async msg => {
  console.log('>> Message:', msg.data)
  const businessPartner = msg.data.KEY[0].BUSINESSPARTNER
  const tx = cds.transaction()
  const selectQl = SELECT.from(ShippingAddresses).where({ businessPartner })
  const selectQlToBeDeleted = SELECT.from(ShippingAddresses).where({
    businessPartner
  })

  const ownAddresses = await tx.run(selectQl)
  await tx.commit()
  console.log('own:', ownAddresses)
  if (ownAddresses && ownAddresses.length > 0) {
    console.log('found')
    const txExt = bupaSrv.transaction()
    const remoteAddresses = await txExt.run(selectQlToBeDeleted)
    await txExt.commit()

    await _qlsToUpdateDifferences(ownAddresses, remoteAddresses).map(ql =>
      tx.run(ql)
    )
    await tx.commit()
  }
})

module.exports = cds.service.impl(function () {
  async function _readAddresses (req) {
    console.log('Addresses', ShippingAddresses)
    const businessPartner = req.user.id
    const tx = bupaSrv.transaction(req)
    const ql = SELECT.from(ShippingAddresses).where({
      businessPartner
    })
    if (req.query && req.query.SELECT && req.query.SELECT.columns) {
      ql.columns(req.query.SELECT.columns)
    }
    if (req.query && req.query.SELECT && req.query.SELECT.where) {
      ql.where(req.query.SELECT.where)
    }

    const result = await tx.run(ql)
    delete result.businessPartner
    return result
  }

  async function _fillAddress (req) {
    if (req.data.shippingAddress_addressID) {
      const businessPartner = req.user.id
      const tx = bupaSrv.transaction(req)
      const response = await tx.run(
        SELECT.from(ShippingAddresses).where({
          addressID: req.data.shippingAddress_addressID,
          businessPartner
        })
      )
      if (response && response.length > 0) {
        const tx2 = cds.transaction(req)
        try {
          const qlStatement = INSERT.into(ShippingAddresses).entries(response)
          await tx2.run(qlStatement)
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
