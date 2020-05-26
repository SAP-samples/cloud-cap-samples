using { sap.capire.bookshop.Books } from '@capire/bookshop';

extend Books with {
  ISBN : String;
  discount : Decimal @assert.range:[0,1];
}
