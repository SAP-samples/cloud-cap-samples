/** Service implementation for AdminService */
module.exports = cds.service.impl(function() {
    this.before ('CREATE', 'Orders', _checkOrderCreateAuth)
  })
  
  
  /** Check authorization  */
  function _checkOrderCreateAuth (req) {
    req.user.currency[0] === req.data.currency_code || req.reject(403)
  }