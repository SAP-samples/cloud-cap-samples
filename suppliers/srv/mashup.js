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
  const Suppliers  = db.entities["sap.capire.bookshop.Suppliers"];

  admin.prepend (()=>{ //> to ensure our .on handlers below go before the default ones

    // Delegate Value Help reads for Suppliers to S4 backend
    admin.on ('READ', 'Suppliers', req => {
      console.log ('>> delegating to S4 service...')
      return S4bupa.run(req.query)
    })

    // Replicate Supplier data when edited Books have suppliers
    admin.on (['CREATE','UPDATE'], 'Books', async ({data:{supplier_ID: supplierId}}, next) => {
      // Using Promise.all(...) to parallelize local write, i.e. next(), and replication

      const replicateIfNotExists = async()=>{
        let replicated = await db.exists (Suppliers, supplierId);
        if (!replicated) await replicate (supplierId, 'initial');
      };

      if (supplierId) {
        const [result, _] = await Promise.all([next(), replicateIfNotExists()]);
        return result;
      } else
        return next(); //> don't forget to pass down the interceptor stack
    })

  })

  // Subscribe to changes in the S4 origin of Suppliers data
  S4bupa.on ('BusinessPartner.Changed', async msg => { //> would be great if we had batch events from S/4
    console.log(">>", msg.event, msg.data)
    const ID = msg.data.BusinessPartner;
    let replica = await SELECT.one('ID').from(Suppliers).where({ID});
    if (replica) await replicate(ID);
  })

  /**
   * Helper function to replicate Suppliers data.
   * @param {string} ID a single ID
   * @param {truthy|falsy} _initial indicates whether an insert or an update is required
   */
  async function replicate (ID,_initial) {
    let supplier = await S4bupa.run(SELECT.one(Suppliers).where({ID}));
    if (_initial) return db.insert(supplier).into(Suppliers);
    else return db.update(Suppliers).with(supplier).where({ID});
  }
}
