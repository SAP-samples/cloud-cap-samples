const express = require('express')
const cds = require('@sap/cds/lib')


module.exports = exports = function() { return express.Router()

  .use (express.json()) //> for application/json -> cqn
  .use (express.text()) //> for text/plain -> cql -> cqn
  .use (logger)
  .use (slugs)

  /**
   * These few lines are a full-blown CAP protocol adapter.
   * Handles CQN requests sent as application/json,
   * as well as CQL requests sent as text/plain.
   */
  .use ('/:srv', (req,res,next) => {
    cds.context = { req } //> sets cds.context.http
    let srv = cds.service.paths['/'+req.params.srv]; if (!srv) return next()
    let cqn = is_string(req.body) ? CQL(req.body) : req.body
    srv.run(cqn) .then (r => res.json(r)) .catch (next)
  })

}


/** Following are convenience variants for CQL requests */
const slugs = express.Router()
/**
 * Returns CSN in response to $csn requests
 */
.get ('/:srv/\\$csn', (req,res,next) => {
  let srv = cds.service.paths['/'+req.params.srv]; if (!srv) return next()
  let csn = !cds.minify ? cds.model : cds.minify (cds.model, { service: srv.name })
  res.json (csn)
})

/**
 * Prepares CQN in req.body from REST-style convenience request formats:
 * GET /Books
 * GET /Books/201
 * GET /Books order by stock desc
 * GET /Books { title as book, stock } order by stock desc
 */
.get ('/:srv/:entity/:id?(%20:tail)?', (req,_,next) => {
  let { entity, id, tail } = req.params, q = SELECT.from(entity,id)
  if (is_array(req.body)) q.columns(req.body)
  if (is_string(req.body)) tail = req.body
  if (tail) q = { SELECT: { ...CQL(`SELECT from _ ${tail}`).SELECT, ...q.SELECT }}
  req.body = q; next() // delegating to main handler, i.e. -> continue below
})


const logger = (req,res,next) => {
  console.log (req.method, decodeURI(req.url), req.body)
  next()
}
const is_array = Array.isArray
const is_string = x => typeof x === 'string'


/** cds.plugin facade */
exports.activate = ()=>{
  const CQLAdapter = require('./cql-adapter')
  cds.on('bootstrap', ()=> cds.app.use ('/cql', new CQLAdapter))
  cds.on('listening', ()=>console.log(`\nTry out the requests in`, {file:
    cds.utils.local(__dirname+'/test.http')
  }))
}
