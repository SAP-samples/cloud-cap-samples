using { CatalogService }
from '../../app/browse/fiori-service';

annotate CatalogService.Books with @(
  UI.LineItem: [... up to {Value:author}, {Value:rating}, ...]
);

annotate CatalogService.Books:rating with @title: 'Rating';
