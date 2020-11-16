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

        search: ({target:{value:v}}) => books.fetch(v && '&$search='+v),

        async fetch (etc='') {
            const {data} = await GET(`/ListOfBooks?$expand=genre,currency${etc}`)
            books.list = data.value
        },

        async inspect (eve) {
            const book = books.book = books.list [eve.currentTarget.rowIndex-1]
            const res = await GET(`/Books/${book.ID}?$select=descr,stock,image`)
            Object.assign (book, res.data)
            books.order = { amount:1 }
            setTimeout (()=> $('form > input').focus(), 111)
        },

        async submitOrder () {
            const {book,order} = books, amount = parseInt (order.amount) || 1
            try {
                const res = await POST(`/submitOrder`, { amount, book: book.ID })
                book.stock = res.data.stock
                books.order = { amount, succeeded: `Successfully orderd ${amount} item(s).` }
            } catch (e) {
                books.order = { amount, failed: e.response.data.error.message }
            }
        }

    }
})

// initially fill list of books
books.fetch()
