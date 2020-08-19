const cds = require('@sap/cds')
module.exports = async function() {

    const db = await cds.connect.to('db') // connect to database service
    const { Books } = db.entities // get reflected definitions

    // Reduce stock of ordered books if available stock suffices
    this.on('submitOrder', async req => {
        const { book, amount } = req.data
        const n = await UPDATE(Books, book)
            .with({ stock: { '-=': amount } })
            .where({ stock: { '>=': amount } })
        n > 0 || req.error(409, `${amount} exceeds stock for book #${book}`)
    })

    this.on('getReferenceObject', async req => {
        r = req.data;
        ent = db.entities;
        result = Object.keys(ent);
        //result = [];
        //result.push(this.model.toString());

        return result;
    })

    // Add some discount for overstocked books
    this.after('READ', 'Books', each => {
        if (each.stock > 111) each.title += ` -- 11% discount!`
    })
}