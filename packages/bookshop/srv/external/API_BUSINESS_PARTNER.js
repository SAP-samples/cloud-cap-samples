module.exports = srv => {
  srv.on('UPDATE', req => {
    const payload = {
      KEY: [{ BUSINESSPARTNER: req.data.BusinessPartner }]
    }
    req.on('succeeded', () => {
      console.log('<< Message:', payload)
      srv.emit('BusinessPartner/Changed', payload)
    })
  })
}
