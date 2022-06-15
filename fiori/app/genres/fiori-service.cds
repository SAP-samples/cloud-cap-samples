namespace sap.capire.bookshop;

using { sap.capire.bookshop } from '@capire/bookstore/srv/mashup';

entity GenreHierarchy : bookshop.Genres {
  hierarchyLevel : Integer default 0;
  drillState     : String default 'leaf';
  parent         : Association to GenreHierarchy;
  children       : Composition of many GenreHierarchy on children.parent = $self;
}

annotate bookshop.GenreHierarchy {
  ID             @sap.hierarchy.node.for;
  parent         @sap.hierarchy.parent.node.for;
  hierarchyLevel @sap.hierarchy.level.for;
  drillState     @sap.hierarchy.drill.state.for;
}

extend service CatalogService with {
  @readonly entity GenreHierarchy as projection on bookshop.GenreHierarchy;
}
