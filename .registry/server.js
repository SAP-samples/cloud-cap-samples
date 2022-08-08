const { exec, execSync } = require ('child_process')
const isWin = process.platform === 'win32'
const express = require ('express')
const fs = require ('fs')
const { dirname, relative } = require('path')
const axios = require('axios')
const app = express()

const cwd = __dirname
const port=process.env.PORT || 4444
let scopes = process.argv.filter(a => a.startsWith('@'))
if (!scopes.length)  scopes = ['@capire']

// clean up on start (exit handler might not complete on Windows)
exec(isWin ? 'del *.tgz' : 'rm *.tgz', {cwd})


app.use('/-/:tarball', async (req,res,next) => {
  console.debug ('GET', req.params)
  try {
    const { tarball } = req.params
    const pkgFull = tarball.substring(0, tarball.lastIndexOf('-'))
    const scope = '@'+pkgFull.substring(0, pkgFull.indexOf('-'))
    const pkg = pkgFull.substring(pkgFull.indexOf('-')+1)
    fs.lstat(tarball,(err => {
      if (err) { // no tgz yet
        const loc = dirname(require.resolve(`${scope}/${pkg}/package.json`))
        console.debug (`npm pack ${relative(cwd, loc)}`)
        exec(`npm pack ${loc}`,{cwd},next)
      }
      else next() //> express.static below
    }))
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

app.use('/-', express.static(__dirname))

app.get('/*', async (req,res)=>{
  const urlRegex = /^\/(@[\w-]+)\/(.+)/
  const url = decodeURIComponent(req.url)
  console.debug ('GET',url)
  try {
    if (!urlRegex.test(url))  return res.sendStatus(404)
    const [, scpe, pkg ] = urlRegex.exec(url)
    const packageName = `${scpe}/${pkg}`

    // delegate to default registry for @sap/non-cds packages
    if (scpe === ('@sap') && !packageName.startsWith('@sap/cds')) {
      return forward(req, res)
    }
    const package = require (`${packageName}/package.json`)
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
          dependencies: package.dependencies,
          devDependencies: package.devDependencies
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

  for (const scope of scopes) {
    console.log (`npm set ${scope}:registry=${url}`)
    execSync(`npm set ${scope}:registry=${url}`)
  }
  console.log (`registry listening on ${url}`)
})


const _exit = ()=>{
  server.close()
  for (const scope of scopes) {
    execSync(`npm conf rm "${scope}:registry"`)
  }
  process.exit()
}

async function forward(req, res) {
  try {
    const url = `https://registry.npmjs.org${req.url}`
    const resAxios = await axios.get(url)
    console.debug('->', decodeURI(url), resAxios.status)
    return res.json(resAxios.data)
  } catch (e) {
    return res.sendStatus(e.response.status)
  }
}

process.on ('SIGTERM',_exit)
process.on ('SIGHUP',_exit)
process.on ('SIGINT',_exit)
process.on ('SIGUSR2',_exit)
