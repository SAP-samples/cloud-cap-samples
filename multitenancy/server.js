const cds = require ('@sap/cds');


cds.on('bootstrap', async app => {
    await cds.mtx.in(app);
});


module.exports = cds.server;
