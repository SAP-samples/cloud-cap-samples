// PoC for simplified Fiori Tree Views
const cds = require('@sap/cds/lib')

cds.on('compile.to.edmx', csn => {
  const { 'AdminService.Genres': Genres } = csn.definitions

  Genres['@Hierarchy.RecursiveHierarchy#GenreHierarchy.$Type'] = 'Hierarchy.RecursiveHierarchyType'
  Genres['@Hierarchy.RecursiveHierarchy#GenreHierarchy.LimitedDescendantCount'] = {'=':'LimitedDescendantCount'}
  Genres['@Hierarchy.RecursiveHierarchy#GenreHierarchy.DistanceFromRoot'] = {'=':'DistanceFromRoot'}
  Genres['@Hierarchy.RecursiveHierarchy#GenreHierarchy.DrillState'] = {'=':'DrillState'}
  Genres['@Hierarchy.RecursiveHierarchy#GenreHierarchy.LimitedRank'] = {'=':'LimitedRank'}

  Genres['@Aggregation.RecursiveHierarchy#GenreHierarchy.$Type'] = 'Aggregation.RecursiveHierarchyType'
  Genres['@Aggregation.RecursiveHierarchy#GenreHierarchy.NodeProperty'] = {'=':'ID'}
  Genres['@Aggregation.RecursiveHierarchy#GenreHierarchy.ParentNavigationProperty'] = {'=':'parent'}
})
