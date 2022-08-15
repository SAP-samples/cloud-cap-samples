const cds = require('@sap/cds/lib')
const {resolve} = require('path')
const { expect } = cds.test
const _model = '@capire/reviews'
if (cds.User.default) cds.User.default = cds.User.Privileged // hard core monkey patch
else cds.User = cds.User.Privileged // hard core monkey patch for older cds releases

const Reviews = 'sap.capire.reviews.Reviews'

describe('cap/samples - Messaging', ()=>{

    beforeAll(() => { cds.root = resolve(__dirname, '..') })
    afterAll(() => { cds.root = process.cwd() })

    it ('should bootstrap sqlite in-memory db', async()=>{
        const db = await cds.deploy (_model) .to ('sqlite::memory:')
        await db.delete(Reviews)
        expect (db.model) .not.undefined
    })

    let srv
    it ('should serve ReviewsService', async()=>{
        srv = await cds.serve('ReviewsService') .from (_model)
        expect (srv.name) .to.match (/ReviewsService/)
    })

    let N=0, received=[], M=0
    it ('should add messaging event handlers', ()=>{
        srv.on('reviewed', (msg)=> received.push(msg))
    })

    it ('should add more messaging event handlers', ()=>{
        srv.on('reviewed', ()=> ++M)
    })

    it ('should add review', async ()=>{
        const review = { subject: "201", title: "Captivating", rating: ++N }
        const response = await srv.create ('Reviews') .entries (review)
        expect (response) .to.containSubset (review)
    })

    it ('should add more reviews', ()=> Promise.all ([
        // REVISIT: mass operation should trigger one message per entry
        // srv.create('Reviews').entries(
        //     { ID: 111 + (++N),  subject: "201", title: "Captivating", rating: N },
        //     { ID: 111 + (++N),  subject: "201", title: "Captivating", rating: N },
        //     { ID: 111 + (++N),  subject: "201", title: "Captivating", rating: N },
        //     { ID: 111 + (++N),  subject: "201", title: "Captivating", rating: N },
        // ),
        srv.create ('Reviews') .entries (
            { ID: String(111 + (++N)),  subject: "201", title: "Captivating", rating: N }
        ),
        srv.create ('Reviews') .entries (
            { ID: String(111 + (++N)),  subject: "201", title: "Captivating", rating: N }
        ),
        srv.create ('Reviews') .entries (
            { ID: String(111 + (++N)),  subject: "201", title: "Captivating", rating: N }
        ),
        srv.create ('Reviews') .entries (
            { ID: String(111 + (++N)),  subject: "201", title: "Captivating", rating: N }
        ),
    ]))

    it ('should have received all messages', async()=> {
        await new Promise((done)=>setImmediate(done))
        expect(M).equals(N)
        expect(received.length).equals(N)
        expect(received.map(m=>m.data)).to.deep.equal([
            { count: 1, subject: '201', rating: 1 },
            { count: 2, subject: '201', rating: 1.5 },
            { count: 3, subject: '201', rating: 2 },
            { count: 4, subject: '201', rating: 2.5 },
            { count: 5, subject: '201', rating: 3 },
        ])
    })
})
