const { CatalogService } = require('@capire/bookshop')
const cds = require ('@sap/cds')

module.exports = class extends CatalogService {async init(){

  const { Books } = cds.entities('sap.capire.bookshop')

  // Connect to ReviewsService to receive `reviewed` events from it
  const ReviewsService = await cds.connect.to ('ReviewsService')
  ReviewsService.on ('reviewed', (msg) => {
    console.debug ('> received:', msg.event, msg.data)
    const { subject, count, rating } = msg.data
    return UPDATE(Books,subject).with({ numberOfReviews:count, rating })
  })

  return super.init()
}}


// -----------------------------------------------------------------------
// Helper for serving static content from npm-installed packages
const {dirname,resolve} = require('path')
const {static} = require('express')
cds.once('listening',()=>{
  cds.app.use ('/app/bookshop', static (dirname (require.resolve('@capire/bookshop'))+'/app/vue'))
  cds.app.use ('/app/reviews', static (resolve (__dirname, '../../app/vue')))
})
