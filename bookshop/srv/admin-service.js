const cds = require("@sap/cds");
const { VM, VMScript } = require("vm2");
const fs = require("fs");
const path = require("path");

class AdminService extends cds.ApplicationService {
  init() {
    const { Books, Authors } = cds.entities("sap.capire.bookshop");

    this.after("READ", async (result, req) => {
      const code = getCode(req, "READ");
      if (code) {
        await executeCode(code, req, result);
      }
    });

    this.after("READ", "ListOfBooks", (each) => {
      if (each.stock > 111) each.title += ` -- 11% discount!`;
    });

    this.before("CREATE", async (req) => {
      const code = getCode(req, "CREATE");
      if (code) {
        await executeCode(code, req);
        //console.log(req.data)
      }
    });

    //this.before("NEW", "Authors", genid);
    //this.before("NEW", "Books", genid);
    return super.init();
  }
}

function getCode(req, operation) {
  const filename = req.target.name + "." + operation + ".js";
  const file = path.join(__dirname, "..", "handlers", filename);
  try {
    const code = fs.readFileSync(file, "utf8");
    return code;
  } catch (error) {
    return "";
  }
}

function scanCode(code) {
  //ESLINT
}

async function executeCode(code, req, result) {
  let output = {};
  console.time("vm2");
  const vm = new VM({
    console: "inherit",
    timeout: 1000,
    allowAsync: true,
    sandbox: { req, result, output, cds, SELECT, INSERT, UPDATE, CREATE, JSON },
  });
  
  try {
    await vm.run(code)
  } catch (error) {
    req.reject('409','Error in VM')
    console.log(error)
  }
  // console.log(req.data)
  console.timeEnd("vm2");
}
/** Generate primary keys for target entity in request */
async function genid(req) {
  const { ID } = await cds
    .tx(req)
    .run(SELECT.one.from(req.target).columns("max(ID) as ID"));
  req.data.ID = ID - (ID % 100) + 100 + 1;
}

module.exports = { AdminService };
