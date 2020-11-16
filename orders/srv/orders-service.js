const cds = require ('@sap/cds')
class OrdersService extends cds.ApplicationService {

  /** register custom handlers */
  init(){
    const { OrderItems } = this.entities

    this.before ('UPDATE', 'Orders', async function(req) {
      const { ID, Items } = req.data
      if (Items) for (let { article, amount } of Items) {
        const { amount:before } = await cds.tx(req).run (
          SELECT.one.from (OrderItems, oi => oi.amount) .where ({order_ID:ID, article})
        )
        if (amount != before) this.orderChanged (article, amount-before)
      }
    })

    this.before ('DELETE', 'Orders', async function(req) {
      const { ID } = req.data
      const Items = await cds.tx(req).run (
        SELECT.from (OrderItems, oi => { oi.article, oi.amount }) .where ({order_ID:ID})
      )
      if (Items) for (let it of Items) this.orderChanged (it.article, -it.amount)
    })

    return super.init()
  }

  /** order changed -> broadcast event */
  orderChanged (article, deltaAmount) {
    // Emit events to inform subscribers about changes in orders
    console.log ('> emitting:', 'OrderChanged', { article, deltaAmount })
    return this.emit ('OrderChanged', { article, deltaAmount })
  }

}
module.exports = OrdersService
