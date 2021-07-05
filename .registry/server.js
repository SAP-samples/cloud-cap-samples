const { exec } = require ('child_process')
const express = require ('express')
const fs = require ('fs')
const app = express()

const { PORT=4444 } = process.env
const [,,port=PORT] = process.argv
const cwd = __dirname

app.use('/-/:tarball', (req,res,next) => {
  console.debug ('GET', req.params)
  try {
    const { tarball } = req.params
    const [, pkg ] = /^capire-(\w+)/.exec(tarball)
    fs.lstat(tarball,(err => {
      if (err) exec(`npm pack ../${pkg}`,{cwd},next)
      else next()
    }))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

app.use('/-', express.static(__dirname))

app.get('/*', (req,res)=>{
  const url = decodeURIComponent(req.url)
  console.debug ('GET',url)
  try {
    const [, capire, pkg ] = /^\/(@capire)\/(\w+)/.exec(url)
    const package = require (`${capire}/${pkg}/package.json`)
    const tarball = `capire-${pkg}-${package.version}.tgz`
    // https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md
    res.json({
      "name": package.name,
      "dist-tags": {
        "latest": package.version
      },
      "versions": {
        [package.version]: {
          "name": package.name,
          "version": package.version,
          "dist": {
            "tarball": `http://localhost:${port}/-/${tarball}`
          },
        }
      },
    })
  } catch (e) {
    console.error(e)
    res.sendStatus(404)
  }
})

app.listen(port, ()=>{
  console.log (`npm set @capire:registry=http://localhost:${port}`)
  console.log (`@capire registry listening on http://localhost:${port}`)
  exec(`npm set @capire:registry=http://localhost:${port}`)
})

const _exit = ()=>{
  console.log ('\nnpm conf rm @capire:registry')
  exec('npm conf rm @capire:registry')
  exec('rm *.tgz')
  process.exit()
}
process.on ('SIGTERM',_exit)
process.on ('SIGHUP',_exit)
process.on ('SIGINT',_exit)
process.on ('SIGUSR2',_exit)
