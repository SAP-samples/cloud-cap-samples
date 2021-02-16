const cds = require('@sap/cds')
module.exports = cds.server


cds.once('bootstrap',(app)=>{
  app.use('/vue',_from('@capire/bookshop/app/vue'))
})



cds.once('served', async ()=>{

  // Connect to services we want to mashup below...
  const S4bupa = await cds.connect.to('API_BUSINESS_PARTNER')   //> external S4 service
  const admin = await cds.connect.to('AdminService')            //> local domain service
  const db = await cds.connect.to('db')                         //> our primary database

  // Reflect CDS definition of the Suppliers entity
  const Suppliers = S4bupa.entities

  // admin.prepend (()=>{

    // Delegate Value Help reads for Suppliers to S4 backend
    admin.on ('READ', 'Suppliers', req => {
      console.log ('>> delegating to S4 service...')
      return S4bupa.read(Suppliers) .where (req.query.where)
    })


    // Replicate Supplier data when Books are edited
    admin.on (['CREATE','UPDATE'], 'Books', async req => {
      const { supplier } = req.data
      if (supplier) {
        let cached = await db.read (Suppliers, supplier)
        if (!cached) await replicate (supplier,'initial')
      }
    })

  // })

  // Subscribe to changes in the S4 origin of Suppliers data
  S4bupa.on ('BusinessPartner/Changed', async msg => {
    const ID = msg.businessPartner.KEYS
    const cached = await db.read (Suppliers, sup => sup.ID) .where ({ ID })
    for (let each of cached) replicate (each, 'update')
  })

  // Helper function to replicate Suppliers data
  async function replicate (ID,_initial) {
    let data = await S4bupa.read (Suppliers, ID)
    if (_initial) return db.insert (data) .into (Suppliers)
    else return db.update (Suppliers,ID) .with (data)
  }

})







// -----------------------------------------------------------------------
// Helper for serving static content from npm-installed packages
const {static} = require('express')
const {dirname} = require('path')
const _from = target => static (dirname (require.resolve(`${target}/index.html`)))
