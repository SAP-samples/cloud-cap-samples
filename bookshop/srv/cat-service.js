const cds = require('@sap/cds')
const tenantId = 'Hard coded tenant for PoC' // TODO

module.exports = async function() {

    const db = await cds.connect.to('db') // connect to database service
    const { Books } = db.entities // get reflected definitions

    // Reduce stock of ordered books if available stock suffices
    this.on('submitOrder', async req => {
        const { book, amount } = req.data
        const n = await UPDATE(Books, book)
            .with({ stock: { '-=': amount } })
            .where({ stock: { '>=': amount } })
        n > 0 || req.error(409, `${amount} exceeds stock for book #${book}`)
    })

    this.on('getReferenceObject', async req => {
        const viewEntity = req.data.selectedAttribute
        const dataEntity = req._model.definitions[viewEntity].query.SELECT.from.ref[0]
        return [
            {
                ProjectionID: viewEntity,
                ProjectionDescription: '',
                BusinessContext: viewEntity,
                BusinessContextDescription: ''
            },
            {
                ProjectionID: dataEntity,
                ProjectionDescription: '',
                BusinessContext: dataEntity,
                BusinessContextDescription: ''
            }
        ]
    })
    this.on('activateExtension', async req => {
        const extensionContent = {
            extensions: [
                {
                    extend: req.data.extend,
                    elements: {}
                }
            ]
        }

        extensionContent.extensions[0].elements[req.data.name] = {
            type: req.data.type
        }

        await cds.mtx.activate(tenantId, extensionContent, {});
    })

    // Add some discount for overstocked books
    this.after('READ', 'Books', each => {
        if (each.stock > 111) each.title += ` -- 11% discount!`
    })
}