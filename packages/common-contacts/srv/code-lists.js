const cds = require ('@sap/cds')
const READ='READ', WRITE = ['CREATE','UPDATE']

const intercept = exports.intercept = cds.service.impl (async (srv) => {

    for (let each in srv.entities) {

        // intercept JSON-encoded elements
        const jsons = await jsonsIn (srv.entities[each].elements)
        if (jsons) {
            srv.before (WRITE, each, ({data:row})=>{
                for (let e of jsons) if (row[e])  row[e] = JSON.stringify (row[e])
            })
            srv.after (READ, each, (row)=>{
                for (let e of jsons) if (row[e])  row[e] = JSON.parse (row[e])
            })
        }

        // intercept references
        const refs = await refsIn (srv.entities[each].elements, srv.model)
        if (refs) srv.after (READ, each, (rows, req)=>{
            for (let row of rows) {
                for (let {element,codelist} of refs) {
                    const entry = codelist [row[element]]
                    if (entry) {
                        const localized = entry.texts [req.user.locale || intercept.locale]
                        row[element] = localized ? localized.name : entry.name
                    }
                }
            }
        })

    }

})


function jsonsIn (elements) {
    const jsons=[]; for (let e in elements) {
        if (elements[e]['@JSON'])  jsons.push(e)
    }
    return jsons.length && jsons
}

async function refsIn (elements, model) {
    const refs=[]; for (let e in elements) {
        const $ref = elements[e]['@ref']
        if ($ref) {
            const d = model.definitions [$ref['=']]
            refs.push({
                element:e,
                codelist: CodeLists[d.name] || (CodeLists[d.name] = await load(d))
            })
        }
    }
    return refs.length && refs
}

const load = exports.load = async (codelist) => {
    const all = {}
    const [entries,texts] = await Promise.all ([
        SELECT.from (codelist),
        SELECT.from (codelist.elements.texts.target)
    ])
    for (let {code,name,descr} of entries) all[code] = {name,descr}
    for (let {code,locale,name,descr} of texts) (all[code].texts || (all[code].texts={})) [locale] = {name,descr}
    return all
}

const CodeLists = {}
