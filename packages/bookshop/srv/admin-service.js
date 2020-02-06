/** Service implementation for AdminService */
module.exports = cds.service.impl(function() {
<<<<<<< HEAD
  this.before ('CREATE', 'Orders', _checkOrderCreateAuth)
})


/** Check authorization  */
function _checkOrderCreateAuth (req) {
  req.user.currency[0] === req.data.currency_code || req.reject(403)
}
=======
    this.before ('CREATE', 'Orders', _checkOrderCreateAuth)
  })
  
  
  /** Check authorization  */
  function _checkOrderCreateAuth (req) {
    req.user.currency[0] === req.data.currency_code || req.reject(403)
  }
>>>>>>> cad3a32c78620f4c4558fad34991dd48866af8d3
