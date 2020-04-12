////////////////////////////////////////////////////////////////////////////
//
//   This is an example of using a project-local server.js to intercept
//   the default bootstrapping process.
//

const cds = require ('@sap/cds')

// Mashup services after all are served...
cds.once('served', async()=>{

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

// Other bootstrapping events you could hook in to...
/* eslint-disable no-unused-vars */
cds.on('loaded', (model) => {/* ... */})
cds.on('serving', (srv) => {/* ... */})
cds.on('connect', (srv) => {/* ... */})
cds.once('listening', ({server,url}) => {/* ... */})


// Delegate bootstrapping to built-in server.js
module.exports = cds.server

// Monkey patching older releases
if (cds.version < '3.33.4') cds.once('listening', ()=> cds.emit('served'))

// Launch server if started directly from command-line
if (!module.parent)  cds.server()
