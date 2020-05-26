console.log ('Böses Zeug', global, process, cds)
// process.exit()
// const fs = require('fs')
// cds.run('Böses Zeugs')
// SELECT.from ('Foo')

module.exports = cds.service.impl(function(){
  this.after('READ','Books', each => each.title += ' (served through sandbox)')
})
