module.exports = class say {
  hello(req) { return `Hello ${req.data.to}!` }
}
