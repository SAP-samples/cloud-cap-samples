require('./cql-adapter') //> that's all required to add cql adapter

const cds = require('@sap/cds')
cds.on('listening', ()=>console.log(`Try out the requests in`, {file:
  cds.utils.local(__dirname+'/requests.http')
}))
