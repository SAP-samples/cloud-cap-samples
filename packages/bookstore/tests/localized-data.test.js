const cds = require ('@sap/cds')

describe('Localized data on db level', ()=>{

    let db, Books

    it ('should deploy the db schema to sqlite in-memory', async()=>{
        db = await cds.deploy (__dirname+'/books') .to ('sqlite::memory:')
        expect (db.model) .toBeDefined()
        Books = db.entities('sap.capire.products').Products
        expect (Books) .toBeDefined()
    })

    it ('should list all books with default language', async ()=>{
        const books = await SELECT.from (Books, b=>b.title)
        expect (books) .toMatchObject([
            { title: 'Wuthering Heights' },
            { title: 'Jane Eyre' },
            { title: 'The Raven' },
            { title: 'Eleonora' },
            { title: 'Catweazle' }
        ])
    })


    it ('should read translated texts from Books_texts', async ()=>{
        const texts = await SELECT ('locale','title').from (Books+'.texts')
        expect (texts) .toMatchObject ([
            { locale: 'de', title: 'Sturmhöhe' },
            { locale: 'de', title: 'Jane Eyre' },
            { locale: 'de', title: 'Eleonora' }
        ])
    })

    it ('should read translated texts from Books.texts', async ()=>{
        const book = await SELECT.one.from (Books, b=>{
            b.ID, b.title, b.texts(t=> {
                t.locale, t.title
            })
        }) .where ({title:'Wuthering Heights'})
        expect (book) .toMatchObject ({
            title: 'Wuthering Heights', texts:[
                {locale:'de',title:'Sturmhöhe'}
            ]
        })
    })

    it ('should insert books with translated texts', async ()=>{
        const n = await INSERT.into (Books) .entries ({ ID:444, title:'A New Book', texts:[
            {locale:'de', title:'Ein Neues Buch'},
            {locale:'fr', title:'Un Nouveau Livre'},
        ]})
        expect(n).toBe(3)
    })

    it ('should delete books w/ cascaded delete to texts', async()=>{
        const n = await DELETE.from(Books) .where ({ID:444})
        expect(n).toBe(3)
    })

})


describe('Localized data on service level', ()=>{

    let srv, Books

    it ('should serve BooksService', async()=>{
        srv = await cds.serve('BooksService').from(__dirname+'/books')
        expect (srv.model) .toBeDefined()
        Books = srv.entities.Books
        expect (Books) .toBeDefined()
    })

    it ('should list all books with default language', async ()=>{
        const books = await srv.read (Books, b=>b.title)
        expect (books) .toMatchObject([
            { title: 'Wuthering Heights' },
            { title: 'Jane Eyre' },
            { title: 'The Raven' },
            { title: 'Eleonora' },
            { title: 'Catweazle' }
        ])
    })

    it ('should read Books with translated texts', async ()=>{
        const book = await srv.run (
            SELECT.from (Books, b=>{ b.ID, b.title, b.texts(t=> {
                t.locale, t.title
            })}) .where ({title:'Wuthering Heights'})
        )
        expect (book) .toMatchObject ([{
            title: 'Wuthering Heights', texts:[
                {locale:'de',title:'Sturmhöhe'}
            ]
        }])
    })

    // FIXME: Requires https://github.wdf.sap.corp/cdx/cds-services/pull/782
    it.skip ('should do the same with convenient method', async ()=>{
        const book = await srv.read (Books, b=>{ b.ID, b.title, b.texts(t=> {
            t.locale, t.title
        })}) .where ({title:'Wuthering Heights'})
        expect (book) .toMatchObject ([{
            title: 'Wuthering Heights', texts:[
                {locale:'de',title:'Sturmhöhe'}
            ]
        }])
    })

    // FIXME: have to skip as srv.run seems to ignore {SELECT:{one}}
    it.skip ('should read single Book with translated texts', async ()=>{
        const book = await srv.run (
            SELECT.one.from (Books, b=>{ b.ID, b.title, b.texts(t=> {
                t.locale, t.title
            })}) .where ({title:'Wuthering Heights'})
        )
        expect (book) .toMatchObject ({
            title: 'Wuthering Heights', texts:[
                {locale:'de',title:'Sturmhöhe'}
            ]
        })
    })

    it ('should insert books with translated texts', async ()=>{
        const book = { ID:444, title:'A New Book', texts:[
            {locale:'de', title:'Ein Neues Buch'},
            {locale:'fr', title:'Un Nouveau Livre'},
        ]}
        const response = await srv.create (Books) .entries (book)
        expect(response).toMatchObject(book)
    })

    it ('should delete books w/ cascaded delete to texts', async()=>{
        await srv.delete('Books') .where ({ID:444})
    })
})


describe('Localized data on OData level', () => {

    const app = require('express')()
    const srv = require('supertest')(app)

    it ('should serve BooksService', async ()=>{
        await cds.serve('BooksService').from(__dirname+'/books') .in (app)
    })

    it('should list all books with default language', async () => {
      const books = await srv.get('/books/Books/201/title')
      expect(books.body).toMatchObject({'value': 'Wuthering Heights'})
    })

    it('should read books with translated texts', async () => {
      const books = await srv.get('/books/Books/201/title'). set('Accept-Language', 'de')
      expect(books.body).toMatchObject({value: 'Sturmhöhe'})
    })

    it('should expand translated texts in Book', async () => {
      const books = await srv. get('/books/Books/201?$select=title&$expand=texts($select=locale,title)')
      expect(books.body).toMatchObject({
        title: 'Wuthering Heights',
        texts: [
            { locale: 'de', title: 'Sturmhöhe', },
        ],
      })
    })

    const book = {
        title: 'New Book', descr: 'Lorem Ipsum',
        texts: [
            { locale: 'de', title: 'Neues Buch', descr: 'Dolor sit amet' },
            { locale: 'fr', title: 'Nouveau Livre', descr: 'consetetur sadipscing elitr' }
        ],
    }

    it('should insert books with translated texts', async () => {
        const {body} = await srv.post('/books/Books').send(book)
        expect(body).toMatchObject(book)
        book.ID = body.ID
    })

    it ('should read the newly created book', async()=>{
        const {body} = await srv.get('/books/Books/'+book.ID+'?$expand=texts').send(book)
        expect(body).toMatchObject(book)
    })

    it ('should delete books w/ cascaded delete to texts', async()=>{
        await srv.delete('/books/Books/'+book.ID)
        .expect(204)
    })
})
