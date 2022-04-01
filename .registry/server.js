const { exec } = require ('child_process')
const isWin = process.platform === 'win32'
const express = require ('express')
const fs = require ('fs')
const app = express()

const { PORT=4444 } = process.env
const [,,port=PORT,scope='@capire'] = process.argv
const cwd = __dirname

// clean up on start (exit handler might not complete on Windows)
exec(isWin ? 'del *.tgz' : 'rm *.tgz', {cwd})


app.use('/-/:tarball', (req,res,next) => {
  console.debug ('GET', req.params)
  try {
    const { tarball } = req.params
    const pkgFull = tarball.substring(0, tarball.lastIndexOf('-'))
    const [, pkg ] = /^\w+-(.+)/.exec(pkgFull)
    fs.lstat(tarball,(err => {
      if (err) console.debug (`npm pack ../${pkg}`)
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
  const urlRegex = /^\/(@[\w-]+)\/(.+)/
  const url = decodeURIComponent(req.url)
  console.debug ('GET',url)
  try {
    if (!urlRegex.test(url))  return res.sendStatus(404)
    const [, scpe, pkg ] = urlRegex.exec(url)
    const package = require (`${scpe}/${pkg}/package.json`)
    const tarball = `${scpe.slice(1)}-${pkg}-${package.version}.tgz`
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
            "tarball": `${server.url}/-/${tarball}`
          },
        }
      },
    })
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND')  return res.sendStatus(404)
    console.error(e);  throw e
  }
})

const server = app.listen(port, ()=>{
  const url = server.url = `http://localhost:${server.address().port}`
  console.log (`npm set ${scope}:registry=${url}`)
  exec(`npm set ${scope}:registry=${url}`)
  console.log (`${scope} registry listening on ${url}`)
})


const _exit = ()=>{
  server.close()
  exec(`npm conf rm "${scope}:registry"`, ()=> { process.exit() })
}

process.on ('SIGTERM',_exit)
process.on ('SIGHUP',_exit)
process.on ('SIGINT',_exit)
process.on ('SIGUSR2',_exit)
