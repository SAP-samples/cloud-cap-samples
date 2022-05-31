/*
  This model controls what gets served to Fiori frontends...
*/

using from './admin-authors/fiori-service';
using from './admin-books/fiori-service';
using from './browse/fiori-service';
using from './common';
using from '@capire/bookstore/srv/mashup';

annotate CatalogService with @requires: 'authenticated-user';
//> this is required to enforce authenticated users with assigned features on $metadata requests
//> REVISIT: Why do subsequent read requests cause a login?
