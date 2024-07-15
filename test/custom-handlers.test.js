const cds = require('@sap/cds')

describe('cap/samples - Custom Handlers', () => {

  const { GET, POST, expect } = cds.test(__dirname+'/../bookshop')
  beforeAll(()=>{
    cds.User.default = cds.User.Privileged // hard core monkey patch
  })

  it('should reject out-of-stock orders', async () => {
    await expect(POST `/browse/submitOrder ${{ book: 201, quantity: 5 }}`).to.be.fulfilled
    await expect(POST `/browse/submitOrder ${{ book: 201, quantity: 5 }}`).to.be.fulfilled
    await expect(POST `/browse/submitOrder ${{ book: 201, quantity: 5 }}`).to.be.rejectedWith(
      /409 - 5 exceeds stock for book #201/)
    const { data } = await GET`/admin/Books/201/stock/$value`
    expect(data).to.equal(2)
  })
})
