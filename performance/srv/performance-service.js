const cds = require ('@sap/cds')
class OrdersService extends cds.ApplicationService {

  /** register custom handlers */
  init(){
    const { 'Orders.Items':OrderItems } = this.entities

    // fill itemCategory at runtime
    this.before (['CREATE', 'UPDATE'], async req =>{
      if(req.data.quantity > 500) {req.data.itemCategory = 'Large'}
        else if (req.data.quantity > 100) {req.data.itemCategory = 'Medium'}
        else    {req.data.itemCategory = 'Small'}
    })   
    //

    this.before ('UPDATE', 'Orders', async function(req) {
      const { ID, Items } = req.data
      if (Items) for (let { product_ID, quantity } of Items) {
        const { quantity:before } = await cds.tx(req).run (
          SELECT.one.from (OrderItems, oi => oi.quantity) .where ({up__ID:ID, product_ID})
        )
        if (quantity != before) await this.orderChanged (product_ID, quantity-before)
      }
    })

    this.before ('DELETE', 'Orders', async function(req) {
      const { ID } = req.data
      const Items = await cds.tx(req).run (
        SELECT.from (OrderItems, oi => { oi.product_ID, oi.quantity }) .where ({up__ID:ID})
      )
      if (Items) await Promise.all (Items.map(it => this.orderChanged (it.product_ID, -it.quantity)))
    })

    return super.init()
  }

  /** order changed -> broadcast event */
  orderChanged (product, deltaQuantity) {
    // Emit events to inform subscribers about changes in orders
    console.log ('> emitting:', 'OrderChanged', { product, deltaQuantity })
    return this.emit ('OrderChanged', { product, deltaQuantity })
  }

}
module.exports = OrdersService
