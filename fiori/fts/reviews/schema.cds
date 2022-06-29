using { CatalogService } from '../../app/browse/fiori-service';

// Add existing field `rating` to list on Fiori UI
annotate CatalogService.Books with @(
  UI.LineItem: [... up to {Value:author}, { Value:rating, Label:'Rating' }, ...]
);
