const cds = require ('./sap-cds')
const task = require('./build-task')

cds.build.run ([task], {src:process.argv[2]})
.catch(console.error)
