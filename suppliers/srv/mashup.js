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

      if (supplierId) return Promise.all ([ next(), replicateIfNotExists() ])
      else return next() //> don't forget to pass down the interceptor stack
    })

  })

  // Subscribe to changes in the S4 origin of Suppliers data
  // REVISIT: cds context is still from the UPDATE method when running in same programm, but should
  // be a separate
  // https://github.wdf.sap.corp/cap/matters/projects/44#card-196556
  S4bupa.on ('A_BusinessPartner.Changed', async msg => { //> would be great if we had batch events from S/4
    await new Promise( resolve => setTimeout( resolve, 1000 ));
    const tx = cds.db.tx(msg);
    let replicas = await tx.run(SELECT('ID').from (Suppliers) .where ('ID in', msg.data.businessPartners));
    await replicateTx(replicas.map(each => each.ID), undefined, tx, msg);
    await tx.commit();
  })

  /**
   * Helper function to replicate Suppliers data.
   * @param {string|string[]} IDs a single ID or an array of IDs
   * @param {truthy|falsy} _initial indicates whether an insert or an update is required
   */
  async function replicate (IDs,_initial) {
    if (!Array.isArray(IDs)) IDs = [ IDs ]
    // TODO: Doesn't work when running in same process with mocked API_BUSINESS_PARTNER

    // TODO: Issue
    let suppliers = await S4bupa.read (Suppliers).where(...([[]].concat(IDs).reduce( (where, id, index ) => { where.push(`${index>1 ? "OR ":""}ID = `, id); return where })));
    //let suppliers = await S4bupa.read (Suppliers).where('ID in',IDs)
    if (_initial) return db.insert (suppliers) .into (Suppliers) //> using bulk insert
    else return Promise.all(suppliers.map ( //> parallelizing updates
      each => db.update (Suppliers,each.ID) .with (each)
    ))
  }

  async function replicateTx (IDs,_initial, tx, msg) {
    if (!Array.isArray(IDs)) IDs = [ IDs ]
    // TODO: Doesn't work when running in same process with mocked API_BUSINESS_PARTNER

    // TODO: Issue
    let suppliers = await S4bupa.tx(msg).read (Suppliers).where(...([[]].concat(IDs).reduce( (where, id, index ) => { where.push(`${index>1 ? "OR ":""}ID = `, id); return where })));
    //let suppliers = await S4bupa.read (Suppliers).where('ID in',IDs)
    if (_initial) return tx.insert (suppliers) .into (Suppliers) //> using bulk insert
    else return Promise.all(suppliers.map ( //> parallelizing updates
      each => tx.update (Suppliers,each.ID) .with (each)
    ))
  }


  // TODO: remove test code
  {
    // one server: returns AdminService.Suppliers
    // two servers: returns API_BUSINESS_PARTNER.A_BusinessPartner
    const tx = S4bupa.tx({});
    let result = await tx.run(SELECT('*').from ('AdminService.Suppliers') .where ('ID =', 'ACME'));
    tx.commit();
    console.log(result);
  }

  // TODO: remove test code
  {
    // one server: returns AdminService.Suppliers
    // two servers: returns AdminService.Suppliers
    const tx = db.tx({});
    let result = await db.run(SELECT('*').from ('AdminService.Suppliers') .where ('ID =', 'ACME'));
    tx.commit();
    console.log(result);
  }

}
