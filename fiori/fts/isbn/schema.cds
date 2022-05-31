using { CatalogService, sap.capire.bookshop.Books }
from '../../app/browse/fiori-service';

extend Books with {
  isbn : String @title:'ISBN';
}

annotate CatalogService.Books with @(
  UI.LineItem: [... up to {Value:author}, {Value:isbn}, ...]
);
