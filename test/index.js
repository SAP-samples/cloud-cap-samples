
const test = require('@sap/cds/lib/utils/tests').in(__dirname,'..')
module.exports = Object.assign(test,{run:test})

// REVISIT: With upcoming release of @sap/cds this should become:
// module.exports = require('@sap/cds/tests').in(__dirname,'..')
