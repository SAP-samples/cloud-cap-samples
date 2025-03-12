const cds = require ('@sap/cds')
const LOG = cds.log('cds.log')

module.exports = class LogService extends cds.Service {
  init(){

    this.on('GET','Loggers', (req)=>{
      let loggers = Object.values(cds.log.loggers).map (_logger)
      let {$search} = req._.req.query
      if ($search) {
        const re = RegExp($search,'i')
        loggers = loggers.filter (l => re.test(l.id) || re.test(l.level))
      }
      return loggers.sort ((a,b) => a.id < b.id ? -1 : 1)
    })

    this.on('PUT','Logger', (req)=>{
      const {id} = req.params[0] || req.data
      if (!id) return req.reject('No logger id specified in request')
      return _logger (cds.log (id, req.data))
    })

    this.on('debug', (req)=>{
      const {logger:id} = req.params[0] || req.data
      if (!id) return req.reject('No logger id specified in request')
      return _logger (cds.log (id, {level:'debug'}))
    })

    this.on('reset', (req)=>{
      const {logger:id} = req.params[0] || req.data
      if (!id) return req.reject('No logger id specified in request')
      return _logger (cds.log (id, {level:'info'}))
    })

    this.on('format', (req)=>{
      const $ = req.data; LOG.info('format:',$)
      // Set format for new loggers constructed subsequently
      cds.log.format = (id, level, ...args) => {
        const fmt = []
        if ($.timestamp) fmt.push ('|', (new Date).toISOString())
        if ($.level) fmt.push ('|', _levels[level].padEnd(5))
        if ($.tenant) fmt.push ('|', cds.context && cds.context.tenant)
        if ($.reqid) fmt.push ('|', cds.context && cds.context.id)
        if ($.id) fmt.push ('|', id)
        fmt[0] = '[', fmt.push ('] -', ...args)
        return fmt
      }
      // Apply this format to all existing loggers
      Object.values(cds.log.loggers).forEach (l => l.setFormat (cds.log.format))
    })
  }

}

const _logger = ({id,level}) => ({id, level:_levels[level] })
const _levels = [ 'SILENT', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE' ]
