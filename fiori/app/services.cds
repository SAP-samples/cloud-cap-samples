/*
  This model controls what gets served to Fiori frontends...
*/
using { sap.capire.bookshop } from '../db/hierarchy';
using { AdminService } from '@capire/bookstore';

extend service AdminService with {
  @readonly 
  @cds.search: {name}
  entity GenreHierarchy as projection on bookshop.Genres;
}

annotate AdminService.GenreHierarchy with @Aggregation.RecursiveHierarchy #GenreHierarchy: {
  $Type                   : 'Aggregation.RecursiveHierarchyType',
  NodeProperty            : ID, // identifies a node
  ParentNavigationProperty: parent // navigates to a node's parent
};

annotate AdminService.GenreHierarchy with @Hierarchy.RecursiveHierarchy #GenreHierarchy: {
  $Type                 : 'Hierarchy.RecursiveHierarchyType',
  LimitedDescendantCount: LimitedDescendantCount,
  DistanceFromRoot      : DistanceFromRoot,
  DrillState            : DrillState,
  Matched               : Matched,
  MatchedDescendantCount: MatchedDescendantCount,
  LimitedRank           : LimitedRank
};


using from './admin-authors/fiori-service';
using from './admin-books/fiori-service';
using from './browse/fiori-service';

using from './common';
using from '@capire/bookstore/srv/mashup';

