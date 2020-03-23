/* global Vue axios */ //> from vue.html
const GET = (url) => axios.get('/browse'+url)

const books = new Vue ({

    el:'#app',

    data: {
        list: [],
        info: '( click on a row to see details... )',
    },

    methods: {

        search: ({target:{value:v}}) => books.fetch (v && '$search='+v),

        async fetch (_filter='') {
            const columns = 'ID,title,author,price', details = 'genre,currency'
            const {data} = await GET(`/Books?$select=${columns}&$expand=${details}&${_filter}`)
            books.list = data.value
        },

        async inspect ({currentTarget:{id}}) {
            const {data} = await GET(`/Books/${id}/descr/$value`)
            books.info = data
        },

    }
})

// initially fill list of books
books.fetch()
