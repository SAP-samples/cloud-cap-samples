module.exports = srv => {
  srv.on('UPDATE', req => {
    const payload = {
      KEY: [{ BUSINESSPARTNER: req.data.BusinessPartner }]
    }
    console.log('<< Message:', payload)
    req.on('succeeded', () => {
      srv.emit('BusinessPartner/Changed', payload)
    })
  })
}
