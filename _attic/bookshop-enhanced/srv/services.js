const cds = require ('@sap/cds')

module.exports = cds.service.impl (async()=>{

    const ReviewsService = await cds.connect.to ('sap.capire.reviews.ReviewsService')
    const CatalogService = await cds.connect.to ('CatalogService')
    const db = await cds.connect.to ('db')
    // import model definitions from connected services to work with subsequently
    const { Books } = db.entities
    const { Reviews } = ReviewsService.entities

    CatalogService.impl (srv => {
        // delegate requests to read reviews to ReviewsService
        srv.on ('READ', 'Books/reviews', (req) => {
            const [ subject ] = req.params
            const tx = ReviewsService.transaction (req)
            return tx.run (SELECT.from (Reviews) .where ({subject}))
        })
    })

    // react on event messages from reviews service
    ReviewsService.on ('reviewed', (msg) => {
        console.debug ('> received:', msg.event, msg.data)
        const { subject, rating } = msg.data
        const tx = db // TODO: db.transaction (msg)
        return tx.run (UPDATE (Books, subject) .with ({rating}))
        // return tx.update (Books, subject) .with ({rating})
    })

})
