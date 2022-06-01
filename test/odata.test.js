const cds = require('@sap/cds/lib')
const { GET, POST, PATCH, axios, expect } = cds.test(__dirname + '/..')
const EDIT = (url) => POST(url + '/TravelService.draftEdit', {})
const SAVE = (url) => POST(url + '/TravelService.draftActivate')
axios.defaults.headers['content-type'] = 'application/json;IEEE754Compatible=true' // REVISIT: can be removed when @sap/cds 5.1.5 is released?

describe('Basic Querying', () => {
  it('should read from row references', async () => {
    const TravelRef = {
      ref: [{
        id: 'TravelService.Travel',
        cardinality: { max: 1 },
        where: [{ ref: ['TravelUUID'] }, '=', { val: '52657221A8E4645C17002DF03754AB66' }]
      }]
    }
    const travel = await SELECT.from(TravelRef)
    expect(travel).to.exist
    expect(travel.TravelID).to.eql(1)
  })

  // REVISIT: fails with:
  // TypeError: name.toUpperCase is not a function
  //   25 |   plain: name => {
  // > 26 |     const upper = name.toUpperCase()
  //      |                        ^
  it.skip('should read with row references in subselects', async () => {
    const BookingRef = {
      ref: [{
        id: 'TravelService.Booking',
        cardinality: { max: 1 },
        where: [{ ref: ['TravelUUID'] }, '=', { val: '7A757221A8E4645C17002DF03754AB66' }]
      }]
    }
    const travel = await SELECT.one.from('TravelService.Travel').where({
      TravelUUID: SELECT.one`to_Travel_TravelUUID`.from(BookingRef)
    })
    expect(travel).to.exist
    expect(travel.TravelID).to.eql(1)
  })
})

describe('Basic OData', () => {
  it('serves $metadata documents in v4', async () => {
    const { headers, status, data } = await GET`/processor/$metadata`
    expect(status).to.equal(200)
    expect(headers).to.contain({
      'content-type': 'application/xml',
      'odata-version': '4.0'
    })
    expect(data).to.contain('<EntitySet Name="Travel" EntityType="TravelService.Travel">')
    expect(data).to.contain('<Annotation Term="Common.Label" String="Travel"/>')
  })

  it('GET /processor/Travel', async () => {
    const { data } = await GET('/processor/Travel?$filter=TravelUUID eq \'00667221A8E4645C17002DF03754AB66\'')
    expect(data.value).to.containSubset([{
      BeginDate: '2021-11-04',
      BookingFee: 60,
      createdAt: '2021-10-17T18:42:07.000Z',
      createdBy: 'Hansmann',
      CurrencyCode_code: 'SGD',
      Description: 'Sightseeing in Singapore',
      EndDate: '2022-08-31',
      HasActiveEntity: false,
      HasDraftEntity: false,
      IsActiveEntity: true,
      LastChangedAt: '2021-10-28T03:18:18.000Z',
      LastChangedBy: 'Deichgraeber',
      to_Agency_AgencyID: '070029',
      to_Customer_CustomerID: '000318',
      TotalPrice: 23439,
      TravelID: 175,
      TravelStatus_code: 'A',
      TravelUUID: '00667221A8E4645C17002DF03754AB66'
    }])
  })

  it('supports $select', async () => {
    const { data } = await GET('/processor/Travel', {
      params: { $select: 'TravelID,Description' }
    })
    expect(data.value).to.containSubset([
      { TravelID: 175, Description: 'Sightseeing in Singapore' }
    ])
  })

  it('supports $expand', async () => {
    const { data } = await GET('/processor/Travel', {
      params: {
        $select: 'TravelID',
        $expand: 'to_Agency($select=Name,City)'
      }
    })
    expect(data.value).to.containSubset([
      { TravelID: 175, to_Agency: { Name: "Up 'n' Away", City: 'Hannover' } }
    ])
  })

  it('supports $value requests', async () => {
    const { data } = await GET`/processor/Travel(TravelUUID='52657221A8E4645C17002DF03754AB66',IsActiveEntity=true)/to_Customer/LastName/$value`
    expect(data).to.equal('Prinz')
  })

  it('supports $top/$skip paging', async () => {
    const { data: p1 } = await GET`/processor/Travel?$select=TravelID,Description&$top=3&$orderby=TravelID`
    expect(p1.value).to.containSubset([
      { Description: 'Business Trip for Christine, Pierre', IsActiveEntity: true, TravelID: 1 },
      { Description: 'Vacation', IsActiveEntity: true, TravelID: 2 },
      { Description: 'Vacation', IsActiveEntity: true, TravelID: 3 }
    ])
    const { data: p2 } = await GET`/processor/Travel?$select=Description&$skip=3&$orderby=TravelID`
    expect(p2.value).not.to.containSubset([
      { Description: 'Business Trip for Christine, Pierre', TravelID: 1 },
      { Description: 'Vacation', TravelID: 2 },
      { Description: 'Vacation', TravelID: 3 }
    ])
  })

  it('new draft has initial key, key is auto incremented upon activation', async () => {
    const { data: newDraft } = await POST('/processor/Travel', {})
    expect(newDraft).to.contain({ TravelID: 0 }) // initial value: 0

    // patch new draft in order to fill mandatory fields
    await PATCH(`/processor/Travel(TravelUUID='${newDraft.TravelUUID}',IsActiveEntity=false)`, {
      BeginDate: '2028-04-01',
      EndDate: '2028-04-02',
      BookingFee: '11',
      to_Customer_CustomerID: '000001',
      to_Agency_AgencyID: '070001',
      CurrencyCode_code: 'USD'
    })

    const { data: newTravel } = await SAVE(`/processor/Travel(TravelUUID='${newDraft.TravelUUID}',IsActiveEntity=false)`)
    expect(newTravel).to.contain({ TravelID: 4134, TotalPrice: 11 })
  })

  it('re-calculates totals after booking fee changed', async () => {
    const Travel4133 = '/processor/Travel(TravelUUID=\'76757221A8E4645C17002DF03754AB66\',IsActiveEntity=true)'
    const Draft = '/processor/Travel(TravelUUID=\'76757221A8E4645C17002DF03754AB66\',IsActiveEntity=false)'
    const Booking = '/processor/Booking(BookingUUID=\'3A997221A8E4645C17002DF03754AB66\',IsActiveEntity=false)'
    const Supplement = '/processor/BookingSupplement(BookSupplUUID=\'85D87221A8E4645C17002DF03754AB66\',IsActiveEntity=false)'

    const { data: draft } = await EDIT(Travel4133)
    expect(draft).to.containSubset({
      TotalPrice: 7375,
      TravelID: 4133
    })

    // Ensure it is not in accepted state as that would disallow changing
    await POST(Draft + '/TravelService.rejectTravel')
    await PATCH(Draft, { BeginDate: '2222-01-01', EndDate: '2222-01-02' })

    // Change the Travel's Booking Fee
    await PATCH(Draft, { BookingFee: '120' })
    await expect_totals(7475)

    // Change a Booking's Flight Price
    await PATCH(Booking, { FlightPrice: '1657' })
    await expect_totals(5475)

    // Change a Supplements's Price
    await PATCH(Supplement, { Price: '220' })
    await expect_totals(5675)

    // Save Draft
    await SAVE(Draft)
    await expect_totals(5675, 'IsActiveEntity=true')

    async function expect_totals (expected, _active = 'IsActiveEntity=false') {
      const { data: { TotalPrice } } = await GET(`/processor/Travel(TravelUUID='76757221A8E4645C17002DF03754AB66',${_active})?
        $select=TotalPrice
      `)
      expect(TotalPrice).to.eql(expected)
    }
  })

  it('deduct discount multiple times does not end up in error', async () => {
    const { data: res1 } = await GET`/processor/Travel(TravelUUID='52657221A8E4645C17002DF03754AB66',IsActiveEntity=true)`
    expect(res1).to.contain({ TotalPrice: 900, BookingFee: 20 })

    const { data: res2 } = await POST(
      '/processor/Travel(TravelUUID=\'52657221A8E4645C17002DF03754AB66\',IsActiveEntity=true)/TravelService.deductDiscount',
      { percent: 11 }
    )
    expect(res2).to.contain({ TotalPrice: 897.8, BookingFee: 17.8 })

    const { data: res3 } = await POST(
      '/processor/Travel(TravelUUID=\'52657221A8E4645C17002DF03754AB66\',IsActiveEntity=true)/TravelService.deductDiscount',
      { percent: 11 }
    )
    expect(res3).to.contain({ TotalPrice: 895.842, BookingFee: 15.842 })

    const { data: res4 } = await POST(
      '/processor/Travel(TravelUUID=\'52657221A8E4645C17002DF03754AB66\',IsActiveEntity=true)/TravelService.deductDiscount',
      { percent: 11 }
    )
    // rounded to 3 decimals
    expect(res4).to.contain({ TotalPrice: 894.099, BookingFee: 14.099 })
  })

  it('allows deducting discounts on drafts as well', async () => {
    const Active = '/processor/Travel(TravelUUID=\'93657221A8E4645C17002DF03754AB66\',IsActiveEntity=true)'
    const Draft = '/processor/Travel(TravelUUID=\'93657221A8E4645C17002DF03754AB66\',IsActiveEntity=false)'

    const { data: res0 } = await GET(Active)
    expect(res0).to.contain({ TravelID: 66, TotalPrice: 729, BookingFee: 10 })

    const { data: res1 } = await EDIT(Active)
    expect(res1).to.contain({ TotalPrice: 729, BookingFee: 10 })

    // Change the Travel's dates to avoid validation errors
    const today = new Date().toISOString().split('T')[0]
    await PATCH(Draft, { BeginDate: today })
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
    await PATCH(Draft, { EndDate: tomorrow })

    const { data: res2 } = await POST(`${Draft}/TravelService.deductDiscount`, { percent: 50 })
    expect(res2).to.contain({ TotalPrice: 724, BookingFee: 5 })

    const { data: res3 } = await GET(Draft)
    expect(res3).to.contain({ TotalPrice: 724, BookingFee: 5 })

    await SAVE(Draft)

    const { data: res4 } = await GET(Active)
    expect(res4).to.contain({ TotalPrice: 724, BookingFee: 5 })
  })
})
