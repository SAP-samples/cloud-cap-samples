const cds = require('@sap/cds')

/**
 * In order to keep basic bookshop sample as simple as possible, we don't add
 * reuse dependencies. This db/init.js ensures we still have a minimum set of
 * currencies, if not obtained through @capire/common.
 */

// NOTE: We use cds.on('served') to delay the UPSERTs after the db init
// to run after all INSERTs from .csv files happened.
module.exports = cds.on('served', ()=>
  UPSERT.into ('sap.common.Currencies') .columns (
    [ 'code', 'symbol', 'name' ]
  ) .rows (
    [ 'EUR', '€', 'Euro' ],
    [ 'USD', '$', 'US Dollar' ],
    [ 'GBP', '£', 'British Pound' ],
    [ 'ILS', '₪', 'Shekel' ],
    [ 'JPY', '¥', 'Yen' ],
  )
)
