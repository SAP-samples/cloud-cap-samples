const cds = require('@sap/cds')
module.exports = cds.service.impl (()=>{

  // We are mashing up three services...
  const admin = cds.connect.to ('AdminService')
  const bupa = cds.connect.to ('API_BUSINESS_PARTNER')
  const db = cds.connect.to ('db')

  // Using reflected definitions from connected services/database
  const { Addresses: externalAddresses } = bupa.entities // projection on external addresses
  const { Books, Addresses } = db.entities // entities in local database


  // Delegate ValueHelp requests to S/4 backend, fetching current user's addresses from there
  admin.on ('READ', 'Addresses', (req) => {
    const UsersAddresses = req.query.from (externalAddresses) .where ({ contact: req.user.id || 'anonymous' })
    //> redirecting the incoming query with req.query.from preserves all .columns and .where clauses
    return bupa.tx(req) .read (UsersAddresses)
  })


  // Replicate chosen addresses from S/4 when filing orders.
  admin.before ('PATCH', 'Orders', async (req) => {
    const assigned = { ID: req.data.shippingAddress_ID, contact: req.user.id }
    if (!assigned.ID) return //> something else
    const local = db.transaction (req)
    const [replica] = await local.read (Addresses) .where (assigned)
    if (replica) return //> already replicated
    const [address] = await bupa.tx(req) .run (SELECT.from (externalAddresses) .where (assigned))
    if (address) return local.create (Addresses) .entries (address)
  })


  // Subscribe to S/4 event to update local replicas when sources change in S/4.
  bupa.on ('BusinessPartner/Changed', async (msg) => {
    console.log('>> received:', msg.data)

    const BPID = msg.data.KEY[0].BUSINESSPARTNER  // TODO: .KEY[0] >> revisit w/ Oliver
    const { SELECT, UPDATE } = cds.ql(msg) //> convenient alternative to <srv>.transaction(req).run(SELECT...)

    // fetch affected entries from local replicas
    const replicas = await SELECT.from (Addresses) .where ({contact:BPID})
    if (replicas.length === 0) return //> not affected

    // fetch changed data from S/4 -> might be less than local due to deletes
    const changed = await SELECT.from (externalAddresses) .where ({
      contact:BPID, ID: replicas.map(a => a.ID) // where in
    })

    // update local replicas with changes from S/4
    const local = db.transaction (msg) //> using that variant to benefit from bulk runs
    return local.run (changed.map (a => UPDATE (Addresses,a.ID) .with (a) ))
  })


  // Validate incoming orders and reduce books' stocks.
  admin.before ('CREATE', 'Orders', async (req) => {

    const { Items } = req.data

    // validate input...
    if (!Items || Items.length === 0)
      return req.reject ('Please order at least one item.')
    if (!req.data.shippingAddress_ID) return req.reject (
      'Please enter a valid shipping address.',
      'shippingAddress_ID'
    )

    // reduce stock on ordered books...
    const all = await db.tx(req) .run (Items.map (each =>
      UPDATE (Books) .where ('ID =', each.book_ID)
      .and ('stock >=', each.amount)
      .set ('stock -=', each.amount)
    ))
    all.forEach ((affectedRows,i) => affectedRows > 0 || req.error (409,
      `${Items[i].amount} exceeds stock for book #${Items[i].book_ID}`
    ))

  })

})
