
using { CatalogService, AdminService } from '@capire/bookstore';
annotate CatalogService with @hcql @odata @path:'browse' @requires:[];
annotate AdminService with @hcql @odata @path:'admin';