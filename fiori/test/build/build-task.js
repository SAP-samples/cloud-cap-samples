const cds = require ('./sap-cds')

module.exports = class extends cds.build.Task {

  async build ({src='*'}) {
    this.log (`Generating edmx output for '${src}'...`)
    const csn = await this.model(src)
    return Promise.all (csn.services.map (srv => {
      const edmx = cds.compile(csn).to.edmx({service:srv.name})
      return this.write(edmx).to(`{srv}/src/main/resources/${srv.name}.edmx`)
    }))
  }

}
