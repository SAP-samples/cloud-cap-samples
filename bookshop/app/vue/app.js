/* global Vue axios */ //> from vue.html
const $ = sel => document.querySelector(sel)
const GET = (url) => axios.get('/browse'+url)
const POST = (cmd,data) => axios.post('/browse'+cmd,data)

const books = Vue.createApp ({

    data() {
      return {
        list: [],
        book: undefined,
        order: { quantity:1, succeeded:'', failed:'' },
        user: {}
      }
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
            books.order = { quantity:1 }
            setTimeout (()=> $('form > input').focus(), 111)
        },

        async submitOrder () {
            const {book,order} = books, quantity = parseInt (order.quantity) || 1 // REVISIT: Okra should be less strict
            try {
                const res = await POST(`/submitOrder`, { quantity, book: book.ID })
                book.stock = res.data.stock
                books.order = { quantity, succeeded: `Successfully ordered ${quantity} item(s).` }
            } catch (e) {
                books.order = { quantity, failed: e.response.data.error ? e.response.data.error.message : e.response.data }
            }
        },

        async fetchUserInfo() {
            try {
                const { data } = await axios.get('/user/me')
                books.user = data
            } catch (err) { books.user = { id: err.message } }
        }
    }
}).mount("#app")

// initially fill list of books
books.fetch()

books.fetchUserInfo()
document.addEventListener('keydown', (event) => {
    // hide user info on request
    if (event.key === 'u')  books.user = undefined
})
