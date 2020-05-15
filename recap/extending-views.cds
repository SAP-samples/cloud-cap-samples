using { CatalogService } from '@capire/bookshop';

extend sap.capire.bookshop.Books with {
  ISBN : String;
}

/** your docs go here */
extend projection CatalogService.Books with {
  ISBN
}
