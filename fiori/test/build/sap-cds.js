const cds = require ('@sap/cds/lib')
const path = require('path')
const cwd = process.cwd()

const _resolve = (root,file) => path.resolve (cwd, root, file.replace(/{(app|db|srv)}\/?/g, (_,folder) => cds.env.folders[folder]))
const _local = (file) => path.relative (cwd,file)


class BuildTask {

  async build (options) {}
  async clean (options) {}

  async model(src='*') {
    return cds.linked (await cds.load(src))
  }

  log(...args) { return console.log(...args) }
  warn(...args) { return console.warn(...args) }
  error(...args) { return console.error(...args) }

  write(x) {
    if (typeof x === 'object') x = JSON.stringify(x,null,'  ')
    return { to: async (dst)=>{
      const file = _resolve (this.options.dest, dst)
      await cds.utils.mkdirp (path.dirname (file))
      await cds.utils.promises.writeFile (file,x)
      console.log ('> wrote:', _local(file))
      return file
    }}
  }

  copy(x) {
    return { to: async (dst) => {} }
  }

}


module.exports = Object.assign (cds, {
  build: {
    run (tasks, _options) {
      const options = { dest:'gen', ..._options }
      return Promise.all(tasks.map (async each => {
        const task = Object.assign (new each, {options})
        await task.build (options)
      }))
    },
    Task: BuildTask
  }
})
