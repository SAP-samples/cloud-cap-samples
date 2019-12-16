module.exports = srv => {
  srv.on('UPDATE', req => {
    const payload = {
      KEY: [{ BUSINESSPARTNER: req.data.BusinessPartner }]
    }
    console.log('<< Message:', payload)
    req.on('succeeded', () => {
      srv.emit('sap/S4HANAOD/c532/BO/BusinessPartner/Changed', payload)
    })
  })
}
