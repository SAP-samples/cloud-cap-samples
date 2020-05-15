using { sap.capire.bookshop.Authors } from '@capire/bookshop';

define view Foo as select from Authors {
  ID, name, books[where title like 'Cat%'].currency.code
};
