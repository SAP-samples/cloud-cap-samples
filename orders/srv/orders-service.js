const cds = require ('@sap/cds')
class OrdersService extends cds.ApplicationService {

  /** register custom handlers */
  init(){
    const { Orders_Items:OrderItems } = this.entities

    this.before ('UPDATE', 'Orders', async function(req) {
      const { ID, Items } = req.data
      if (Items) for (let { product_ID, amount } of Items) {
        const { amount:before } = await SELECT.one.from (OrderItems, oi => oi.amount) .where ({up__ID:ID, product_ID})
        if (amount != before) await this.orderChanged (product_ID, amount-before)
      }
    })

    this.before ('DELETE', 'Orders', async function(req) {
      const { ID } = req.data
      const Items = await SELECT.from (OrderItems, oi => { oi.product_ID, oi.amount }) .where ({up__ID:ID})
      if (Items) await Promise.all (Items.map(it => this.orderChanged (it.product_ID, -it.amount)))
    })

    return super.init()
  }

  /** order changed -> broadcast event */
  orderChanged (product, deltaAmount) {
    // Emit events to inform subscribers about changes in orders
    console.log ('> emitting:', 'OrderChanged', { product, deltaAmount })
    return this.emit ('OrderChanged', { product, deltaAmount })
  }

}
module.exports = OrdersService
