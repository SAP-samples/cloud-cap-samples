class Service {

    static get entity(){
        if (this._entity)  return this._entity
        const ec = class extends entity {}; ec._service = this
        return this._entity = ec
    }

    // static then(r,e) {
    //     const srv = this._instance || cds.connect.to (this.name)
    //     if ('then' in srv) return this._instance = srv.then(r,e)
    //     else return r(this._instance = srv)
    // }

}

class entity {
    // static get name(){
    //     return this._service.name +'.'+ this.name
    // }
    // static get _entityName(){
    //     return this._service.name +'.'+ this.name
    // }
}

module.exports = { Service, entity }