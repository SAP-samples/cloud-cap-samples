////////////////////////////////////////////////////////////////////////////
//
//   This is an example of using a project-local server.js to intercept
//   the default bootstrapping process.
//
const cds = require ('@sap/cds')

// Connect CatalogService and ReviewsService when all are served...
cds.once('served', async ({CatalogService}) => {

    // reflect entity definitions used below...
    const { Books } = cds.entities('sap.capire.bookshop')
    const { Reviews } = cds.entities('ReviewsService')

    // prepend the following handler so it overrides the default handler
    CatalogService.prepend (srv => srv.on ('READ', 'Books/reviews', (req) => {
        console.debug ('> delegating request to ReviewsService')
        const [id] = req.params, { columns, limit } = req.query.SELECT
        return SELECT(columns).from(Reviews).limit(limit).where({subject:String(id)})
    }))

    // subscribe to events emitted by ReviewsService
    const ReviewsService = await cds.connect.to ('ReviewsService')
    ReviewsService.on ('reviewed', (msg) => {
        console.debug ('> received:', msg.event, msg.data)
        const { subject, rating } = msg.data
        return UPDATE(Books,subject).with({rating})
    })

})

// Other bootstrapping events you could hook in to...
/* eslint-disable no-unused-vars */
cds.on('bootstrap',(app) => {/* ... */})
cds.on('loaded', (model) => {/* ... */})
cds.on('connect', (srv) => {/* ... */})
cds.on('serving', (srv) => {/* ... */})
cds.once('served', (all) => {/* ... */})
cds.once('listening', ({server,url}) => {/* ... */})


// Delegate bootstrapping to built-in server.js
module.exports = cds.server
