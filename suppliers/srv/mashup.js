////////////////////////////////////////////////////////////////////////////
//
//    Mashing up provided and required services...
//
module.exports = async()=>{ // called by server.js

  if (!cds.services.AdminService) return //> mocking S4 service only

  // Connect to services we want to mashup below...
  const S4bupa = await cds.connect.to('API_BUSINESS_PARTNER')   //> external S4 service
  const admin = await cds.connect.to('AdminService')            //> local domain service
  const db = await cds.connect.to('db')                         //> our primary database

  // Reflect CDS definition of the Suppliers entity
  const { Suppliers } = S4bupa.entities

  admin.prepend (()=>{

    // Delegate Value Help reads for Suppliers to S4 backend
    admin.on ('READ', 'Suppliers', async req => {
      console.log ('>> delegating to S4 service...')
      return await S4bupa.run(req.query)
    })


    // Replicate Supplier data when Books are edited
    admin.on (['CREATE','UPDATE'], 'Books', async (req,next) => {
      let { supplier } = req.data
      if (supplier) {
        let cached = await db.exists (Suppliers, supplier)
        if (!cached) await replicate (supplier,'initial')
      }
      return next()
    })

  })

  // Subscribe to changes in the S4 origin of Suppliers data
  S4bupa.on ('BusinessPartner/Changed', async msg => {
    let cached = await SELECT('ID').from (Suppliers)
      .where ('ID in', msg.businessPartner.KEYS)
    for (let each of cached) replicate (each)
  })

  // Helper function to replicate Suppliers data
  async function replicate (ID,_initial) {
    let data = await S4bupa.read (Suppliers, ID)
    if (_initial) return db.insert (data) .into (Suppliers)
    else return db.update (Suppliers,ID) .with (data)
  }

}
