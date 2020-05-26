const cds = require ('@sap/cds')
const path = require ('path')
const fs = require ('fs')
const protected = {db:1,messaging:1,auth:1}
const { isfile } = cds.utils

cds.on('served', ()=>{
  for (let each of cds.services) {
    if (each.name in protected) continue
    // search for local srv/<each>.js files and if exist
    // activate them in a service extension sandbox
    const impl = isfile (path.resolve('srv/'+each.name+'.js'))
    if (impl) activate_sandboxed (each,impl)
  }
})

function activate_sandboxed (srv,impl) {
  console.log (`[cds] - extending ${srv.name} with sandboxed:`, {impl:path.relative(process.cwd(),impl)})
  const src = fs.readFileSync (impl)
  const sandbox = Object.keys(global).filter(name => name !== 'cds')
  const fn = new Function (
    'module','cds','global','process', ...sandbox,
    src
  )
  // restricted sandboxed variant of 'module' and 'cds'
  const module = {}
  const cds = {
    service: {
      impl: fn=>fn
    }
  }
  fn (module,cds,undefined,undefined, ...sandbox.map((()=>(undefined))))
  if (typeof module.exports === 'function') try {
    module.exports.call (srv,srv)
  } catch (e) {
    console.log (e)
  }
}

module.exports = cds.server
