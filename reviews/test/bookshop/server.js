const cds = require ('@sap/cds')

cds.on('listening', async()=>{

        // connect to requires services
    const ReviewsService = await cds.connect.to ('ReviewsService')
    const CatalogService = await cds.connect.to ('CatalogService')
    const db = await cds.connect.to ('db')

    // import model definitions from connected services to work with subsequently
    const { Reviews } = ReviewsService.entities
    const { Books } = db.entities

    // react on event messages from reviews service
    ReviewsService.on ('reviewed', (msg) => {
        console.debug ('> received:', msg.event, msg.data)
        const { subject, rating } = msg.data
        const tx = db // TODO: db.transaction (msg)
        return tx.run (UPDATE (Books, subject) .with ({rating}))
        // return tx.update (Books, subject) .with ({rating})
    })

    // delegate requests to read reviews to ReviewsService
    CatalogService.impl (srv => {
        srv.on ('READ', 'Books/reviews', (req) => {
            const [ subject ] = req.params
            const tx = ReviewsService.transaction (req)
            return tx.run (SELECT.from (Reviews) .where ({subject}))
        })
    })

})

module.exports = cds.server
