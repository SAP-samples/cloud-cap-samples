module.exports = class say {
  hello(req) {
    let {to} = req.data
    if (to === 'me') to = require('os').userInfo().username
    return `Hello ${to}!`
  }
}
