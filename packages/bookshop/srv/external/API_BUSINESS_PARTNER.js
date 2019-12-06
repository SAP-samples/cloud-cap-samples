module.exports = srv => {

    srv.on('UPDATE', req => {

        const payload = {
            KEY: [{ BUSINESSPARTNER: req.user.id }]
        }
        console.log('<< Message:', payload)
        srv.emit('sap/messaging/ccf/BO/BusinessPartner/Changed', payload)

    })

}