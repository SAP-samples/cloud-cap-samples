const cds = require('@sap/cds')

// We are mashing up three services...
const admin = cds.connect.to ('AdminService')
const bupa = cds.connect.to('API_BUSINESS_PARTNER')
const db = cds.connect.to('db')

// Reflected entities for local database
const { Books, Addresses } = db.entities

// Fetch current user's addresses from S/4 for ValueHelp.
module.exports = (admin => {
  admin.on ('READ', 'usersAddresses', async (req) => {
    // const UsersAddresses = req.query.from (Addresses) .where ({ BusinessPartner: req.user.id })
    // FIXME: Again that absolutely useless error message:
    // [2019-12-16T20:30:14.106Z | ERROR | 1940862]: The server does not support the functionality required to fulfill the request
    // FIXME: Even worse: click Orders Edit ->
    // [2019-12-16T20:38:52.918Z | WARNING | 1575675]: Not Found
    const { A_BusinessPartnerAddress:Addresses } = bupa.entities
    const UsersAddresses = SELECT.from (Addresses, a => {
      a.AddressID.as('ID'),
      a.BusinessPartner,
      a.Country.as('country'),
      a.CityName.as('cityName'),
      a.PostalCode.as('postalCode'),
      a.StreetName.as('streetName'),
      a.HouseNumber.as('houseNumber')
    }) .where ({ BusinessPartner: req.user.id })
    return bupa.transaction(req) .run (UsersAddresses) // TODO: I'd like to write .read instead of .run
  })
})

// Replicate chosen addresses from S/4 when filing orders.
admin.before ('PATCH', 'Orders', async (req) => {
  const ID = req.data.shippingAddress_ID; if (!ID) return //> something else
  const address = await bupa.tx(req) .run (
    SELECT.one.from(Addresses).where({
      ID, BusinessPartner: req.user.id
    })
  )
  if (address) return db.tx(req) .upsert (Addresses) .entries (address)
})

// Update local replicas when sources change in S/4.
bupa.on ('BusinessPartner/Changed', async (msg) => {
  console.log('>> received:', msg.data)

  const BusinessPartner = msg.data.KEY[0].BUSINESSPARTNER //> .KEY[0] >> revisit w/ Oliver

  // fetch affected entries from local replicas
  const local = db.transaction (msg)
  const replicas = await local.read (Addresses) .where ({BusinessPartner})

  // skip if not affected
  if (replicas.length === 0) return

  // fetch changed data from S/4 -> might be less than local due to deletes
  const changed = await bupa.tx(msg).read (Addresses) .where ({
    BusinessPartner, ID: replicas.map(a => a.ID) // where in
  })

  // update local replicas with changes from remote
  return local.run (changed.map (a =>
    UPDATE (Addresses) .with(a) .where ({ ID: a.ID })
  ))

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
