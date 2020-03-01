using { sap.capire.products as my } from '../db/schema';

service BooksService {
  entity Books as SELECT from my.Products;
}

annotate cds.UUID with @odata.Type: 'Edm.String';
