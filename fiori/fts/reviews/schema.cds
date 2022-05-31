using { CatalogService }
// from '../../app/browse/fiori-service';
from '../isbn/schema'; // REVISIT: temporary workaround

annotate CatalogService.Books with @(
  UI.LineItem: [... up to {Value:author}, {Value:rating}, ...]
);

annotate CatalogService.Books:rating with @title: 'Rating';
