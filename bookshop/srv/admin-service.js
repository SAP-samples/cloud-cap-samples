const cds = require("@sap/cds")
const cds_sandbox = require("sap/cds/sandbox")
const { VM, VMScript } = require("vm2")
const fs = require("fs")
const path = require("path")
const { nextTick } = require("process")

class AdminService extends cds.ApplicationService {
  init() {
    this.after("READ", async (result, req) => {
      if (!(result === undefined || result == null)) {
        const code = getCode(req.target.name, "READ")
        if (code) {
          await executeCode(code, req, result)
        }
      }
    })

    this.before("CREATE", async (req) => {
      const code = getCode(req.target.name, "CREATE")
      if (code) {
        await executeCode(code, req)
      }
    })

    this.before("UPDATE", async (req) => {
      const code = getCode(req.target.name, "CREATE")
      if (code) {
        await executeCode(code, req)
      }
    })

    this.on("*", async (req, next) => {
      if (!(req.target === undefined || req.target == null)) return next()
      //ToDo: check whether action or event is part of an extension
      if (req.constructor.name === "EventMessage") {
        const code = getCode(req.event, "ON")
        if (code) {
          await executeCode(code, req)
        }
      } else if (req.constructor.name === "ODataRequest") {
        var output = {}
        const code = getCode(this.name + "." + req.event, "ON")
        if (code) {
          await executeCode(code, req, {}, output)
          return output
        }
      }
    })

    //ToDo: Prefix for Service not in event emitter
    this.before("CREATE", "Authors", async (req) => {
      let Author = req.data
      await this.emit("createdAuthor", { Author })

    })
 
    return super.init()
  }
}

var counter = 1;

function newLabel() {return "VM2 - req: " + counter++}

function getCode(name, operation) {
  const filename = name + "." + operation + ".js"
  const file = path.join(__dirname, "..", "handlers", filename)
  try {
    const code = fs.readFileSync(file, "utf8")
    return code
  } catch (error) {
    return ""
  }
}

function scanCode(code) {
  //ESLINT
}
/*
Base assumption: event handlers will always use publicly available application API's (services)
Inbound data for validations
  - this could be a document --> req.target plus expand on related data
  - event facade could have an explicit publishing of specific services or documents (e.g. remote services)
  - CQN Protocol adapter for subsequent reads --> req.data plus application service calls
  - what is the CDS subset to put in?
    - req.data + target-rec (proxy, unloaded)
    - ORM type lazy loading (dereferenced)
    - application developer could actually provide custom proxies for specific functions
    - performance impact of multiple accesses to object graph and multiple DB roundtrips
    - can static code checking or developer annotations influence what is loaded into a graph?
    - alternative: Stripped-down SELECT limited to req.target and ID
      - application service only
      - access rights of user respected
  - What about to-many relationships? For compositions essential, for associations to be questioned
  - Application Service Reads
  - outbound data for changes
  - call remote services
    - register new remote services dynamically
    - CAP provides an API on remote services - connect doesn't need to be done by extension developer
    - alternative: declarative remote services plumbing with CDS service facade
      - model looks like static internal services, remote calls done transparently behind the scenes

  -Emit Events
    
  - choreography of extension points
    - deep inserts vs. fine grained operations
    - input validation may be suited for fine grained operations
    - today not in scope for performance reasons
    - two different use case: Insert new page to book vs. update order-header with items-constraints in place
  - reject request, return errors and warnings - suitable for UI, too

*/
async function executeCode(code, req, result, output) {
  const label=newLabel()
  console.time(label)
  const vm = new VM({
    console: "inherit",
    timeout: 500,
    allowAsync: true,
    sandbox: { req, result, output, cds, SELECT, INSERT, UPDATE, CREATE, JSON },
  })

  try {
    await vm.run(code)
    return output
  } catch (error) {
    console.log(error)
    req.reject("409", "Error in VM")
  }
  finally {
    console.timeEnd(label)
  }
  // console.log(req.data)
}
/** Generate primary keys for target entity in request */
async function genid(req) {
  const { ID } = await cds
    .tx(req)
    .run(SELECT.one.from(req.target).columns("max(ID) as ID"))
  req.data.ID = ID - (ID % 100) + 100 + 1
}

module.exports = { AdminService }
