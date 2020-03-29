/* global Vue axios */ //> from vue.html
const $ = sel => document.querySelector(sel)
const GET = (url) => axios.get('/browse'+url)
const POST = (cmd,data) => axios.post('/browse'+cmd,data)

const books = new Vue ({

    el:'#app',

    data: {
        list: [],
        book: { descr:'( click on a row to see details... )' },
        order: { amount:1, succeeded:'', failed:'' }
    },

    methods: {

        search: ({target:{value:v}}) => books.fetch (v && '$search='+v),

        async fetch (_filter='') {
            const columns = 'ID,title,author,price,stock', details = 'genre,currency'
            const {data} = await GET(`/Books?$select=${columns}&$expand=${details}&${_filter}`)
            books.list = data.value
        },

        async inspect () {
            const book = books.book = books.list [event.currentTarget.rowIndex-1]
            book.descr || await GET(`/Books/${book.ID}/descr/$value`) .then (({data}) => book.descr = data)
            books.order = { amount:1 }
            setTimeout (()=> $('form > input').focus(), 111)
        },

        submitOrder () { event.preventDefault()
            const {book,order} = books, amount = parseInt (order.amount) || 1
            POST(`/submitOrder`, { amount, book: book.ID })
            .then (()=> books.order = { amount, succeeded: `Successfully orderd ${amount} item(s).` })
            .catch (e=> books.order = { amount, failed: e.response.data.error.message })
            GET(`/Books/${book.ID}/stock/$value`).then (res => book.stock = res.data)
        }

    }
})

// initially fill list of books
books.fetch()
