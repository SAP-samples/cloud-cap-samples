module.exports = srv => {
    srv.on(['CREATE', 'UPDATE', 'DELETE'], req => {
        const payload = {
            KEY: [{ BUSINESSPARTNER: req.data.BusinessPartner }]
        }
        srv.emit('BusinessPartner/Changed', payload)
        console.log('<< Emitted', payload)
    })
}