module.exports = srv => {
    srv.on('UPDATE', req => {

        const payload = {
            KEY: [{ BUSINESSPARTNER: req.data.BusinessPartner }]
        }
        console.log('<< emitting:', payload)
        srv.emit('BusinessPartner/Changed', payload)

  })
}
