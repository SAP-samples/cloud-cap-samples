using { CatalogService, sap.capire.bookshop as my } from '@capire/bookshop';
using from '@capire/common';

extend service CatalogService with {
  @cds.localized:false
  entity BooksSans as projection on my.Books {
    *, //> non-localized defaults, e.g. title
    key ID,
    texts.title as localized_title,
    texts.locale
  };
}
