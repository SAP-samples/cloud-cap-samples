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
  const { Suppliers }  = db.entities

  admin.prepend (()=>{ //> to ensure our .on handlers below go before the default ones

    // Delegate Value Help reads for Suppliers to S4 backend
    admin.on ('READ', 'Suppliers', req => {
      console.log ('>> delegating to S4 service...')
      return S4bupa.run(req.query)
    })

    // Replicate Supplier data when edited Books have suppliers
    admin.after (['CREATE','UPDATE'], 'Books', async ({supplier_ID:ID}) => {
      if (ID) {
        let replicated = await db.exists (Suppliers,ID)
        if (!replicated) { // initially replicate Supplier info
            let supplier = await S4bupa.read (Suppliers,ID)
            await INSERT(supplier) .into (Suppliers)
        }
      }
    })

  })

  // Subscribe to changes in the S4 origin of Suppliers data
  S4bupa.on ('BusinessPartner.Changed', async msg => { //> would be great if we had batch events from S/4
    console.log(">>", msg.event, msg.data)
    const ID = msg.data.BusinessPartner;
    let replicated = await db.exists (Suppliers,ID)
    if (replicated) { // update replicated Supplier info
      let supplier = await S4bupa.read (Suppliers,ID)
      await UPDATE(Suppliers,ID) .with (supplier)
    }
  })

}
