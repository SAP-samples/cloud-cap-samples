using {
  Currency,
  managed,
  sap
} from '@sap/cds/common';

namespace sap.capire.bookshop;

entity Books : managed {
  key ID       : Integer;
      title    : localized String(111)  @mandatory;
      descr    : localized String(1111);
      author   : Association to Authors @mandatory;
      genre    : Association to Genres;
      stock    : Integer;
      price    : Price;
      currency : Currency;
      image    : LargeBinary            @Core.MediaType: 'image/png';
      pages    : Composition of many Pages
                   on pages.parent = $self;
}

@Capabilities.ExpandRestrictions.NonExpandableProperties: [parent]
entity Pages {
  key parent  : Association to Books;
  key number  : Integer;
      content : String(1111);
}

entity Authors : managed {
  key ID           : Integer;
      name         : String(111) @mandatory;
      dateOfBirth  : Date;
      dateOfDeath  : Date;
      placeOfBirth : String;
      placeOfDeath : String;
      books        : Association to many Books
                       on books.author = $self;
}

/** Hierarchically organized Code List for Genres */
entity Genres : sap.common.CodeList {
  key ID       : UUID;
      parent   : Association to Genres;
      children : Composition of many Genres
                   on children.parent = $self;
}

type Price : Decimal(9, 2);


// ------------------------------------------------------------------
// temporary workaround for reuse in fiori sample and hana deployment
annotate Books with @fiori.draft.enabled;
