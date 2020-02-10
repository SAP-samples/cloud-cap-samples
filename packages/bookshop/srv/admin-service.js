const cds = require('@sap/cds')

/** Service implementation for AdminService */
module.exports = cds.service.impl(srv => {
  const { OrderItems } = srv.entities ('sap.capire.bookshop')

  // on-the-fly calculate the total Order price based on the OrderItems' netAmounts
  srv.after (['READ','EDIT'], 'Orders', async (orders, req) => {
    const ordersByID = Array.isArray(orders)
      ? orders.reduce ((all,o) => { (all[o.ID] = o).total=0; return all },{})
      : { [orders.ID]: orders }
    return cds.transaction(req) .run (
      SELECT.from(OrderItems) .columns ('parent_ID', 'netAmount')
       .where ({ parent_ID: {in: Object.keys(ordersByID)} })
    ) .then (items =>
      items.forEach (item => ordersByID [item.parent_ID] .total += item.netAmount)
    )
  })
})
