const express = require('express')
const cds = require('@sap/cds')

cds.once('bootstrap',(app)=>{
  const {dirname} = require('path')
  // serving the vue.js app imported from @capire/bookshop
  const vue_app = dirname (require.resolve('@capire/bookshop/app/vue/index.html'))
  app.use ('/vue', express.static(vue_app))
})

module.exports = cds.server
