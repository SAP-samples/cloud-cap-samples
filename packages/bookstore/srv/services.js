const cds = require('@sap/cds')
module.exports['sap.capire.bookstore.CatalogService'] = cds.service.impl (async (srv) => {

    const ReviewsService = await cds.connect.to ('sap.capire.reviews.ReviewsService')
    const { Reviews } = ReviewsService.entities
    const { Books } = srv.entities

    // delegate requests to reviews service
    srv.on('READ', 'Reviews', async (req) => {
        const { SELECT } = cds.ql(req)
        const results = await SELECT.from (Reviews)

        // TODO: Should actually be using .where of fluent query API
        if (req.query.SELECT.where) {
            return results.filter (row => row.subject === req.query.SELECT.where[2].val)
        }

        return results
    })

    // react on event messages from reviews service
    ReviewsService.on ('reviewed', (msg) => {
        console.debug ('> received message:', msg.event, msg.data)
        const {subject,rating} = msg.data
        const tx = cds // cds.transaction(msg)  // TODO: how to add multi-tenancy?
        return tx.run (UPDATE(Books).set({rating}) .where ({ID:subject})) //.then (console.log)
    })

})


// FIXME: pls remove this...
process.env.destinations = JSON.stringify([{
    name: 'reviewsDest',
    url: 'http://localhost:4005/reviews',
    username: 'dummy',
    password: 'dummy'
}])
