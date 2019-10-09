const cds = require('@sap/cds')
const { Books } = cds.entities

/** Service implementation for CatalogService */
module.exports = cds.service.impl(function() {
  this.after('READ', 'Books', each => each.stock > 111 && _addDiscount2(each))
  this.before('CREATE', 'Orders', _reduceStock)
})

/** Add some discount for overstocked books */
function _addDiscount2(each) {
  each.title += ' -- 11% discount!'
}

/** Reduce stock of ordered books */
async function _reduceStock(req) {
  const { Items } = req.data
  const { UPDATE } = cds.ql (req)
  const updates = Items.map (each =>
    UPDATE (Books, each.book_ID)
    .set (`stock -=`, each.amount)
    .where (`stock >=`, each.amount)
  )
  const affectedRows = await Promise.all (updates)
  affectedRows.forEach ((n,i) => {
    if (n === 0)  req.error (409,
      `${Items[i].amount} exceeds stock for book #${Items[i].book_ID}`
    )
  })
}
