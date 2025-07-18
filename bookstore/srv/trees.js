const cds = require('@sap/cds/lib')

// PoC for simplified Fiori Tree Views
cds.on('compile.for.runtime', csn => {
  for (let each of cds.linked(csn).definitions) {
    if (each.is_entity && each._service && each['@hierarchy']) _hierarchy (each)
  }
})


const _hierarchy = entity => {

  // Add annotations explaining the hierarchy structure to Fiori
  const Qualifier = entity.name.slice (entity._service.name.length+1) + 'Hierarchy'
  const parent = _parent4(entity)
  entity[`@Aggregation.RecursiveHierarchy#${Qualifier}.ParentNavigationProperty`] ??= {'=': parent.name }
  entity[`@Aggregation.RecursiveHierarchy#${Qualifier}.NodeProperty`] ??= {'=': parent.keys[0].ref[0] }

  // Add expected hierarchy elements to the entity
  const columns = entity.projection.columns ??= ['*']
  const elements = entity.elements
  for (let e of Hierarchy.elements) {
    entity[`@Hierarchy.RecursiveHierarchy#${Qualifier}.${e.name}`] = {'=': e.name }
    if (e.name in elements) continue
    const { name, value, ...rest } = e
    elements[e.name] = Object.defineProperty ({ __proto__:e, ...rest }, 'parent', { value: entity })
    columns.push ({ ...value, as: name, cast: { type: e.type } })
  }

  // Disable filter and sort for hierarchy elements
  entity['@Capabilities.FilterRestrictions.NonFilterableProperties'] =
  entity['@Capabilities.SortRestrictions.NonSortableProperties'] =
  Object.keys (Hierarchy.elements)
}


const _parent4 = entity => {
  const parent = entity['@hierarchy.parent'] || entity['@hierarchy.via']
  if (parent) return entity.elements [parent['=']||parent]
  else for (let e of entity.elements) // use first recursive uplink association
    if (e.is2one && e._target === entity) return e
}


const { Hierarchy } = cds.linked `aspect Hierarchy {
  LimitedDescendantCount : Int16 = null;
  DistanceFromRoot : Int16 = null;
  DrillState : String = null;
  LimitedRank : Int16 = null;
}`.definitions
