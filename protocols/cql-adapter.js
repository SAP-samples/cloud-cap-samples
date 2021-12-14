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
   * Prepares CQN in req.body from REST-style requests
   */
  .get ('/:srv/:entity/:id?(%20:tail)?', (req,_,next) => {
    let { entity, id, tail } = req.params
    let q = SELECT.from(entity,id)
    if (typeof req.body === 'object' && Object.keys(req.body).length)
      q.columns(req.body)
    if (typeof req.body === 'string')
      tail = req.body
    if (tail) {
      let { SELECT } = CQL(`SELECT from Foo ${tail}`); delete SELECT.from
      Object.assign (q.SELECT, SELECT)
    }
    req.body = q
    next()
  })

  /**
   * Handles CQN and CQL requests
   */
  .use ('/:srv', (req,res,next) => {
    let srv = cds.service.paths['/'+req.params.srv]; if (!srv) return next()
    let tx = cds.context = cds.tx (req) // should reduce to: cds.context = req
    return srv.run(
      typeof req.body === 'object' ? req.body : CQL(req.body)
    )
    .then (tx.commit, tx.rollback) // shouldn't be neccessary
    .then (r => res.json(r), next)
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
