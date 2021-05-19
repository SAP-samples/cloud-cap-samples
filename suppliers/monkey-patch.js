const deploy = require("@sap/cds/lib/deploy");

// TODO: https://github.wdf.sap.corp/cdx/cds/pull/1949

/*
const DEBUG = (...args) => console.log(...args);

deploy.exclude_external_entities_in = function (csn, _bound) {
  // NOSONAR
  for (let [each, { service = each, model, credentials }] of Object.entries(
    cds.requires
  )) {
    if (!model) continue; //> not for internal services like cds.requires.odata
    if (_bound && !credentials) continue;
    DEBUG && DEBUG("excluding external entities for", service, "...");
    const prefix = service + ".";
    for (let each in csn.definitions) {
      if (each.startsWith(prefix)) {
        DEBUG && DEBUG("excluding external entity", each);
        _exclude(each);
      }
    }
  }
  return csn;

  function _exclude(each) {
    const def = csn.definitions[each];
    if (def.kind !== "entity") return;
    def["@cds.persistence.skip"] = true;
    // propagate to all views...
    for (let other in csn.definitions) {
      const d = csn.definitions[other];
      // do not exclude replica table
      if (d["@cds.persistence.table"] === true) continue;
      const p = (d.query && d.query.SELECT) || d.projection;
      if (p && p.from.ref && p.from.ref[0] === each) _exclude(other);
    }
  }
};

*/