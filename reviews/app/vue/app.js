/* global Vue axios */ //> from vue.html
const $ = sel => document.querySelector(sel)
const GET = (url) => axios.get('/reviews'+url)
const PUT = (cmd,data) => axios.patch('/reviews'+cmd,data)
const POST = (cmd,data) => axios.post('/reviews'+cmd,data)

const reviews = Vue.createApp ({

    data() {
        return {
          list: [],
          review: undefined,
          message: {},
          Ratings: Object.entries({
            5 : '★★★★★',
            4 : '★★★★',
            3 : '★★★',
            2 : '★★',
            1 : '★',
          }).reverse()
        }
    },

    methods: {

        search: ({target:{value:v}}) => reviews.fetch(v && '&$search='+v),

        async fetch (etc='') {
            const {data} = await GET(`/Reviews?${etc}`)
            reviews.list = data.value
        },

        async inspect (eve) {
            const review = reviews.review = reviews.list [eve.currentTarget.rowIndex-1]
            const res = await GET(`/Reviews/${review.ID}/text/$value`)
            review.text = res.data
            reviews.message = {}
        },

        newReview () {
            reviews.review = {}
            reviews.message = {}
            setTimeout (()=> $('form > input').focus(), 111)
        },

        async submitReview () {
            const review = reviews.review; review.rating = parseInt (review.rating) // REVISIT: Okra should be less strict
            try {
                if (!review.ID) {
                    const res = await POST(`/Reviews`,review)
                    reviews.ID = res.data.ID
                } else {
                    console.trace()
                    await PUT(`/Reviews/${review.ID}`,review)
                }
                reviews.message = { succeeded: 'Your review was submitted successfully. Thanks.' }
            } catch (e) {
                reviews.message = { failed: e.response.data.error.message }
            }
        }

    },

    filters: {
        stars: (r) => ('★'.repeat(Math.round(r))+'☆☆☆☆☆').slice(0,5),
        datetime: (d) => d && new Date(d).toLocaleString(),
    },

}).mount("#app")

// initially fill list of my reviews
reviews.fetch()
