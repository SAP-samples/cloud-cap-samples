const cds = require ('@sap/cds')

// Mashup services after bootstrapping...
cds.on('listening', async()=>{

    // react on event messages from reviews service
    const ReviewsService = await cds.connect.to ('ReviewsService')
    const db = await cds.connect.to ('db')
    ReviewsService.on ('reviewed', (msg) => {
        console.debug ('> received:', msg.event, msg.data)
        const { Books } = db.entities('sap.capire.bookshop')
        const { subject, rating } = msg.data
        const tx = db.tx (msg) // TODO: db.tx(msg) fully implemented?
        return tx.update (Books,subject) .with ({rating})
    })

    // delegate requests to read reviews to ReviewsService
    const CatalogService = await cds.connect.to ('CatalogService')
    CatalogService.impl (srv => srv.on ('READ', 'Books/reviews', (req) => {
        console.debug ('> delegating to ReviewsService')
        const { Reviews } = ReviewsService.entities
        const [ subject ] = req.params
        const tx = ReviewsService.tx (req)
        return tx.read (Reviews) .where({subject}) .columns (req.query.SELECT.columns)
    }))

})

// Delegate bootstrapping to built-in server.js
module.exports = cds.server
