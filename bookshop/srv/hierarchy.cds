namespace my.common;

aspect Hierarchy {
  LimitedDescendantCount : Integer64 = null;
  DistanceFromRoot       : Integer64 = null;
  DrillState             : String = null;
  Matched                : Boolean = null;
  MatchedDescendantCount : Integer64 = null;
  LimitedRank            : Integer64 = null;
}


annotate Hierarchy with @Capabilities.FilterRestrictions.NonFilterableProperties: [
  'LimitedDescendantCount',
  'DistanceFromRoot',
  'DrillState',
  'Matched',
  'MatchedDescendantCount',
  'LimitedRank'
];

annotate Hierarchy with @Capabilities.SortRestrictions.NonSortableProperties: [
  'LimitedDescendantCount',
  'DistanceFromRoot',
  'DrillState',
  'Matched',
  'MatchedDescendantCount',
  'LimitedRank'
];
