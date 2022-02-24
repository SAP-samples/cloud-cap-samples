using {
  cuid,
  managed
} from '@sap/cds/common';
using {sap.capire.bookshop} from '@capire/bookshop';

namespace sap.capire.graphql;

extend bookshop.Books with {
  chapters : Composition of many Chapters
               on chapters.book = $self;
}

entity Chapters : managed {
  key book   : Association to bookshop.Books;
  key number : Integer;
      title  : String;
}

entity Orders : cuid, managed {
  @mandatory
  book     : Association to bookshop.Books;
  @mandatory
  @assert.range : [ 1, 5 ]
  quantity : Integer;
}
