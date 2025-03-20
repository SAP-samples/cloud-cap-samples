/*
  UI annotations for the Browse GenreHierarchy App
*/
using CatalogService from '@capire/bookstore';

annotate CatalogService.GenreHierarchy with @Aggregation.RecursiveHierarchy#GenreHierarchy: {
    $Type: 'Aggregation.RecursiveHierarchyType',
    NodeProperty: ID, // identifies a node
    ParentNavigationProperty: parent // navigates to a node's parent
  };

annotate CatalogService.GenreHierarchy with @Hierarchy.RecursiveHierarchy#GenreHierarchy: {
  $Type: 'Hierarchy.RecursiveHierarchyType',
  LimitedDescendantCount: LimitedDescendantCount,
  DistanceFromRoot: DistanceFromRoot,
  DrillState: DrillState,
  Matched: Matched,
  MatchedDescendantCount: MatchedDescendantCount,
  LimitedRank: LimitedRank
};
