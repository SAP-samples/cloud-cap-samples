const _model = __dirname+'/..'
const cds = require ('@sap/cds')

describe('messaging tests', ()=>{

    it ('should bootstrap sqlite in-memory db', async()=>{
        const db = await cds.deploy (_model) .to ('sqlite::memory:')
        expect (db.model) .toBeDefined()
    })

    let srv
    it ('should serve reviews services', async()=>{
        srv = await cds.serve('ReviewsService') .from (_model)
        expect (srv.name) .toMatch ('ReviewsService')
    })

    let N=0, received=[], M=0
    it ('should add messaging event handlers', ()=>{
        srv.on('reviewed', (msg)=> received.push(msg))
    })

    it ('should add more messaging event handlers', ()=>{
        srv.on('reviewed', ()=> ++M)
    })

    it ('should add review', async ()=>{
        const review = {
            ID: 111 + (++N), // FIXME: why does the generic handler not fill this in automatically ?!? --> it does so when the request comes in via Postman / OData
            subject: "201", title: "Captivating", rating: N
        }
        const response = await srv.create ('Reviews') .entries (review)
        expect (response) .toMatchObject (review)
    },100)

    it ('should add more reviews', ()=> Promise.all ([
        // REVISIT: mass operation should trigger one message per entry
        // srv.create('Reviews').entries(
        //     { ID: 111 + (++N),  subject: "201", title: "Captivating", rating: N },
        //     { ID: 111 + (++N),  subject: "201", title: "Captivating", rating: N },
        //     { ID: 111 + (++N),  subject: "201", title: "Captivating", rating: N },
        //     { ID: 111 + (++N),  subject: "201", title: "Captivating", rating: N },
        // ),
        srv.create ('Reviews') .entries (
            { ID: 111 + (++N),  subject: "201", title: "Captivating", rating: N }
        ),
        srv.create ('Reviews') .entries (
            { ID: 111 + (++N),  subject: "201", title: "Captivating", rating: N }
        ),
        srv.create ('Reviews') .entries (
            { ID: 111 + (++N),  subject: "201", title: "Captivating", rating: N }
        ),
        srv.create ('Reviews') .entries (
            { ID: 111 + (++N),  subject: "201", title: "Captivating", rating: N }
        ),
    ]) ,100)

    it ('should have received all messages', async()=> {
        await new Promise((done)=>setImmediate(done))
        expect(M).toBe(N)
        expect(received.length).toBe(N)
        expect(received.map(m=>m.data)).toEqual([
            { subject: '201', rating: 1 },
            { subject: '201', rating: 1.5 },
            { subject: '201', rating: 2 },
            { subject: '201', rating: 2.5 },
            { subject: '201', rating: 3 },
        ])
    })
})
