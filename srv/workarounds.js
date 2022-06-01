// Temporary fix as monky-patch -> will soon go away with upcomming fix to OData library

const cds = require('@sap/cds/lib')

const { init } = cds.ApplicationService.prototype
cds.extend(cds.ApplicationService).with(class {
  /**
   * This experimentally adds support to register standard ES6 class methods
   * of subclasses of cds.ApplicationService using "@on/before/after ..."
   * pragmas.
   */
  init () {
    for (let o = this; ;) {
      o = Reflect.getPrototypeOf(o); if (!o || o === cds.Service.prototype) break
      const pds = Object.getOwnPropertyDescriptors(o)
      for (const p in pds) {
        if (p === 'constructor' || p === 'init') continue
        const pragma = /^[^{]+{\s*"@(on|before|after) (\w+)(?: ([\w/]+)(?::(\w+))?)?"/.exec(pds[p].value); if (!pragma) continue
        const [, on, event, path, element] = pragma; const handler = pds[p].value
        this[on](event, path,
          !element
            ? handler
            : on === 'after'
              ? (_, req) => element in req.data && handler.call(this, _, req)
              : (req, next) => element in req.data && handler.call(this, req, next)
        )
        // console.debug (`${this.name}.${on} (${event}, ${path}, this.${p})`)
      }
    }
    return init.call(this)
  }
})

const { error } = cds.Request.prototype
cds.extend(cds.Request).with(class {
  /**
   * This is a temporary fix for req.error() ensuring target element
   * reference paths containing UUIDs are rendered correctly when UUIDs have
   * been mapped to `Edm.String` as we do in SFlight, due to ABAP-based data.
   */
  error (e) {
    if (e.target) e.target = e.target.replace(/\((\w+)UUID=([^,)]+)/g, '($1UUID=\'$2\'')
    return error.call(this, ...arguments)
  }

  /**
   * This experimentally adds a req._target property which can be used as
   * arguments to SELECT.from or UPDATE to read the single instance of
   * req.target referred to by the incomming request. It also transparently
   * points to .drafts persistence, if in a draft scenario.
   */
  get _target () {
    let { target } = this; const [key] = this.params
    if (key && this.path.indexOf('/') < 0) { // > .../draftActivate
      // deviate to draft?
      const { IsActiveEntity } = key
      if (IsActiveEntity !== undefined) Object.defineProperty(key, 'IsActiveEntity', { value: IsActiveEntity, enumerable: false }) // > skip as key in cqn
      if (cds.version < '6.0.0') {
        if (IsActiveEntity === 'false') target = target.drafts
      } else {
        if (IsActiveEntity === false) target = target.drafts
      }
      // prepare target query
      const q = SELECT.one.from(target, key)
      const { from: { ref }, where } = q.SELECT
      if (cds.version < '5.6.0') { ref[ref.length - 1] = { id: ref[ref.length - 1], where, cardinality: { max: 1 } } }
      target = { ref }
    }
    return super._target = target
  }
})
