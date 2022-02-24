module.exports = function() {
  const { Orders, Books } = this.entities

  this.before('CREATE', Orders, async function(req) {
    const { book_ID, quantity } = req.data

    // reduce the stock, if enough are available, else reject the order
    const applied = await UPDATE(Books, book_ID).set({ stock: { '-=': quantity } }).where({ stock: { '>=': quantity }})
    if (!applied) req.reject(400, `Sorry, ${quantity} are not in stock`)
  })
}
