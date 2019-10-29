namespace sap.capire.bookshop;

using { AdminService } from '@sap/capire-bookshop/srv/admin-service';
using { sap.capire.bookshop } from '../db/schema';

@impl:'srv/services'
extend service AdminService with {
  entity Genres as projection on bookshop.Genres;
}
