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

  admin.prepend (()=>{ //> to ensure our .on handlers below go before the default ones

    // Delegate Value Help reads for Suppliers to S4 backend
    admin.on ('READ', 'Suppliers', req => {
      console.log ('>> delegating to S4 service...')
      return S4bupa.run(req.query)
    })

    // Replicate Supplier data when edited Books have suppliers
    admin.on (['CREATE','UPDATE'], 'Books', ({data:{supplier}}, next) => {
      // Using Promise.all(...) to parallelize local write, i.e. next(), and replication
      if (supplier) return Promise.all ([ next(), async()=>{
        let replicated = await db.exists (Suppliers, supplier)
        if (!replicated) await replicate (supplier, 'initial')
      }])
      else return next() //> don't forget to pass down the interceptor stack
    })

  })

  // Subscribe to changes in the S4 origin of Suppliers data
  S4bupa.on ('BusinessPartner.Changed', async msg => { //> would be great if we had batch events from S/4
    let replica = await SELECT.one('ID').from (Suppliers) .where ({ID: msg.data.BusinessPartner})
    return replicate (replica.ID)
  })

  /**
   * Helper function to replicate Suppliers data.
   * @param {string|string[]} IDs a single ID or an array of IDs
   * @param {truthy|falsy} _initial indicates whether an insert or an update is required
   */
  async function replicate (IDs,_initial) {
    if (!Array.isArray(IDs)) IDs = [ IDs ]
    let suppliers = await S4bupa.read (Suppliers).where('ID in',IDs)
    if (_initial) return db.insert (suppliers) .into (Suppliers) //> using bulk insert
    else return Promise.all(suppliers.map ( //> parallelizing updates
      each => db.update (Suppliers,each.ID) .with (each)
    ))
  }

}
