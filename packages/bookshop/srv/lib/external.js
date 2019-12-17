const { Service } = require('./common')
class API_BUSINESS_PARTNER extends Service {}

class Addresses extends API_BUSINESS_PARTNER.entity {
  constructor() {
    super()
    /*key*/ this.contact = ''
    /*key*/ this.ID = ''
    this.country = ''
    this.cityName = ''
    this.postalCode = ''
    this.streetName = ''
    this.houseNumber = ''
  }
  static get name() { return 'API_BUSINESS_PARTNER.Addresses' }
}

module.exports = {
  BusinessPartnerService: API_BUSINESS_PARTNER,
  Addresses,
}
