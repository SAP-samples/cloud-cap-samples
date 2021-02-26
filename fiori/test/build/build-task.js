const cds = require ('./sap-cds')

module.exports = class extends cds.build.Task {

  async build ({src='*'}) {
    this.log (`Generating edmx output for '${src}'...`)
    const csn = await this.model(src)
    return Promise.all (csn.services.map (({name:service}) => {
      const edmx = cds.compile(csn).to.edmx({service})
      return this.write(edmx).to(`{srv}/src/main/resources/${service}.edmx`)
    }))
  }

}
