//----------------------
// workarounds -> should be done by @cds-compiler

annotate cds.UUID with @odata.Type: 'Edm.String';

using from '@sap/capire-products';
annotate sap.capire.products.Products with { texts @odata.contained }
annotate sap.capire.products.Categories with { texts @odata.contained }

annotate sap.capire.reviews.ReviewsService with @imported;
annotate sap.capire.reviews.Reviews with @cds.persistence.skip;
annotate sap.capire.reviews.Likes with @cds.persistence.skip;
