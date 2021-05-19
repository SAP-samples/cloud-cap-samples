const { GET, POST, expect } = require('../test') .run ('bookshop')
const cds = require('@sap/cds/lib')
if (cds.User.default) cds.User.default = cds.User.Privileged // hard core monkey patch
else cds.User = cds.User.Privileged // hard core monkey patch for older cds releases

describe('Custom Handlers', () => {

  it('should reject out-of-stock orders', async () => {
    await POST('/browse/submitOrder', { book: 201, amount: 5 })
    await POST('/browse/submitOrder', { book: 201, amount: 5 })
    await expect(POST('/browse/submitOrder', { book: 201, amount: 5 })).to.be.rejectedWith(/409 - 5 exceeds stock for book #201/)
    const { data } = await GET`/admin/Books/201/stock/$value`
    expect(data).to.equal(2)
  })
})
