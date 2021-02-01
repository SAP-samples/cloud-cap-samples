const fs = require("fs");
const path = require("path");
const peg = require("pegjs");
const pegGrammarPath = path.join(__dirname, "/odata2cqn.pegjs");
const odataPegGrammar = fs.readFileSync(pegGrammarPath, {
  encoding: "utf8",
  flag: "r",
});
const parser = peg.generate(odataPegGrammar);


module.exports = {
  parse: {
    url: parser.parse,
  },
  to: {
    cqn: parser.parse,
    url: (cqn) => pending(cqn)
  },
  serialize: (data) => pending(data),
  deserialize: (body) => pending(body),
}

const pending = ()=>{
  throw new Error ('Not yet implemented')
}
