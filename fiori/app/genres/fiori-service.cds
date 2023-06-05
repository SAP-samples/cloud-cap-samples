using {sap.capire.bookshop} from '../../db/common';

annotate bookshop.GenreHierarchy {
  ID             @sap.hierarchy.node.for;
  parent         @sap.hierarchy.parent.node.for;
  hierarchyLevel @sap.hierarchy.level.for;
  drillState     @sap.hierarchy.drill.state.for;
}
