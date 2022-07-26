
async function run() {
  const {stock, price, author_ID} = req.data
  if (stock<0) return req.reject('409', 'Stock must not be negative')
  if (price<0) return req.reject('409', 'Price must not be negative')
  let {name} = await SELECT.one`name`.from(`Authors`).where({ID: author_ID})
  req.data.authorName=name
}
output = run()
