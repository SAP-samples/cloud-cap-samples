const cds = require('@sap/cds')

// We are mashing up three services...
const admin = cds.connect.to ('AdminService')
const bupa = cds.connect.to ('API_BUSINESS_PARTNER')
const db = cds.connect.to ('db')

// Using reflected definitions from connected services/database
const { Addresses: externalAddresses } = bupa.entities // projection on external addresses
const { Books, Addresses } = db.entities // entities in local database


module.exports = (admin => {
  // Handler to delegate ValueHelp requests to S/4 backend, fetching current user's addresses from there
  admin.on ('READ', 'usersAddresses', (req) => {
    const { SELECT } = cds.ql(req) //> convenient alternative to bupa.transaction(req).run(SELECT...)
    return SELECT.from (externalAddresses) .where ({ contact: req.user.id || 'anonymous' })
    //> this is applying projection from CDS model generically, i.e. the equivalent of:
    // const { A_BusinessPartnerAddress } = bupa.entities
    // return SELECT.from (A_BusinessPartnerAddress, a => {
    //   a.AddressID.as('ID'),
    //   a.BusinessPartner,
    //   a.Country.as('country'),
    //   a.CityName.as('cityName'),
    //   a.PostalCode.as('postalCode'),
    //   a.StreetName.as('streetName'),
    //   a.HouseNumber.as('houseNumber')
    // }) .where ({ BusinessPartner: req.user.id })
  })
})



// Replicate chosen addresses from S/4 when filing orders.
admin.before ('PATCH', 'Orders', async (req) => {
  const ID = req.data.shippingAddress_ID; if (!ID) return //> something else
  const { SELECT, UPSERT } = cds.ql(req) //> convenient alternative to <srv>.transaction(req).run(SELECT...)
  const address = await SELECT.one.from (externalAddresses) .where ({
    ID, contact: req.user.id
  })
  if (address) return UPSERT (Addresses) .entries (address)
})


// Update local replicas when sources change in S/4.
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
    'Please enter a valid shpping address.',
    'shippingAddress_ID'
  )
  // TODO: future way of doing that:
  // const {assert} = req
  // assert ('Items') .check (items => items && items.length, 'Please enter at least one order item')
  // assert ('shippingAddress') .mandatory() .exists()
  // if (req.hasErrors)  return

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


// eslint-disable-next-line no-unused-vars
function _diff (a,b) {
  let any, diff={}
  for (let each in b) if (b[each] !== a[each])  diff[each] = b[any=each]
  return any && diff
}
