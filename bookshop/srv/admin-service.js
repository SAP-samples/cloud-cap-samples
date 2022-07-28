const cds = require("@sap/cds")
//const cds_sandbox = require("sap/cds/sandbox")
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
          await executeCode.call(this, code, req, result)
        }
      }
    })

    this.before("CREATE", async (req) => {
      const code = getCode(req.target.name, "CREATE")
      if (code) {
        await executeCode.call(this, code, req)
      }
    })

    this.before("UPDATE", async (req) => {
      const code = getCode(req.target.name, "CREATE")
      if (code) {
        await executeCode.call(this, code, req)
      }
    })

    this.on("*", async (req, next) => {
      if (!(req.target === undefined || req.target == null)) return next()
      //ToDo: check whether action or event is part of an extension
      // DO NOT OVERWRITE EXISTING Action Implementations!
      // evaluate: Can we augment action implementation with super.next?
      if (req.constructor.name === "EventMessage") {
        const code = getCode(req.event, "ON")
        if (code) {
          await executeCode.call(this, code, req)
        }
      } else if (req.constructor.name === "ODataRequest") {
        var output = {}
        const code = getCode(this.name + "." + req.event, "ON")
        if (code) {
          await executeCode.call(this, code, req, {}, output)
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

//should only work in local exection (cds watch)
// alternative: Upon Bootstrapping, merge files into CSN
function getCodeFromFile(name, operation) {
  const filename = name + "." + operation + ".js"
  const file = path.join(__dirname, "..", "handlers", filename)
  try {
    const code = fs.readFileSync(file, "utf8")
    return code
  } catch (error) {
    return ""
  }
}

//after push this should be the only thing that works
function getCodeFromAnnotation(name, operation) {
  return ""
}

function getCode(name, operation) {
  let code=getCodeFromAnnotation(name, operation)
  if (code==="") {code=getCodeFromFile(name, operation)}
  return code
}

function scanCode(code) {
  //ESLINT
}

async function executeCode(code, req, result, output) {
  const srv = this
  const label=newLabel()
  console.time(label)
  const vm = new VM({
    console: "inherit",
    timeout: 500,
    allowAsync: true,
    sandbox: { req, //todo: isolate req.data, req.reject, req.error, req.message
      result, //important for READ
      output, //used for Action Implementation
      SELECT :  (class extends require('@sap/cds/lib/ql/SELECT')  {then(r,e) {return srv.run(this).then(r,e)}})._api(),  
      INSERT :  (class extends require('@sap/cds/lib/ql/INSERT')  {then(r,e) {return srv.run(this).then(r,e)}})._api(), 
      UPDATE :  (class extends require('@sap/cds/lib/ql/UPDATE')  {then(r,e) {return srv.run(this).then(r,e)}})._api(), 
      CREATE :  (class extends require('@sap/cds/lib/ql/CREATE')  {then(r,e) {return srv.run(this).then(r,e)}})._api(), 
      //srv: this,
      JSON },
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
