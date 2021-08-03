const cds = require ('@sap/cds')

cds.once('bootstrap',(app)=>{
  // Delegate to imported apps (reviews only when mocked)
  app.serve ('/bookshop').from ('@capire/bookshop','app/vue')
  app.serve ('/reviews',).from ('@capire/reviews','app/vue')
})

cds.once('served', async ()=>{
  // Update Books' average ratings when ReviewsService signals updated reviews
  const ReviewsService = await cds.connect.to ('ReviewsService')
  ReviewsService.on ('reviewed', (msg) => {
    console.debug ('> received:', msg.event, msg.data)
    const { subject, rating } = msg.data
    return UPDATE('Books',subject).with({rating})
  })

})

module.exports = cds.server
