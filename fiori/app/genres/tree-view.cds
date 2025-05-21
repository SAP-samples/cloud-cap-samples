using { AdminService } from '@capire/bookstore';

////////////////////////////////////////////////////////////////////////////
//
//	Genres Tree View
//

// Tell Fiori about the structure of the hierarchy
annotate AdminService.Genres with @Aggregation.RecursiveHierarchy #GenresHierarchy : {
  ParentNavigationProperty : parent, // navigates to a node's parent
  NodeProperty             : ID, // identifies a node, usually the key
};

// Fiori the following to be defined explicitly, even though they're always the same
extend AdminService.Genres with @(
  // The columns expected by Fiori to be present in hierarchy entities
  Hierarchy.RecursiveHierarchy #GenresHierarchy : {
    LimitedDescendantCount : LimitedDescendantCount,
    DistanceFromRoot       : DistanceFromRoot,
    DrillState             : DrillState,
    LimitedRank            : LimitedRank
  },
  // Disallow filtering on these properties from Fiori UIs
  Capabilities.FilterRestrictions.NonFilterableProperties: [
    'LimitedDescendantCount',
    'DistanceFromRoot',
    'DrillState',
    'LimitedRank'
  ],
  // Disallow sorting on these properties from Fiori UIs
  Capabilities.SortRestrictions.NonSortableProperties    : [
    'LimitedDescendantCount',
    'DistanceFromRoot',
    'DrillState',
    'LimitedRank'
  ],
) columns { // Ensure we can query these fields from database
  null as LimitedDescendantCount : Int16,
  null as DistanceFromRoot       : Int16,
  null as DrillState             : String,
  null as LimitedRank            : Int16,
};
