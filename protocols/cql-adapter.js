const express = require('express')
const cds = require('@sap/cds/lib')


const CQLAdapter = function() { return express.Router()

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
    req.body = q; next() // update req.body and delegate to main handler
  })

  /**
   * These few lines are a full-blown CAP protocol adapter.
   * Handles CQN requests sent as application/json,
   * as well as CQL requests sent as text/plain.
   */
  .use ('/:srv', (req,res,next) => {
    let srv = cds.service.paths['/'+req.params.srv]; if (!srv) return next()
    let cqn = is_string(req.body) ? cds.parse.cql(req.body) : req.body
    cds.context = {req}
    srv.run (cqn) .then (r => res.json(r)) .catch (next)
  })

}



cds.on('bootstrap', ()=> cds.app
  // we do that on bootstrap so cds.server's default logger has access to req.body
  .use ('/cds', express.json()) //> for application/json -> cqn
  .use ('/cds', express.text()) //> for text/plain -> cql -> cqn
)
cds.on('served', ()=> cds.app
  // we do that on served so it comes after the cds.server's default logger
  .use ('/cds', new CQLAdapter)
)

const is_array = Array.isArray
const is_string = x => typeof x === 'string'
