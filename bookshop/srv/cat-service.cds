using {sap.capire.bookshop as my} from '../db/schema';

service CatalogService @(path : '/browse') {

  /**
   * For displaying lists of Books
   */
  @readonly
  entity ListOfBooks as projection on Books excluding {
    descr
  };

  /**
   * For display in details pages
   */
  @readonly
  entity Books       as projection on my.Books {
    * , author.name as authorName
  } excluding {
    createdBy,
    modifiedBy
  };

  @readonly
  entity Authors     as projection on my.Authors {
    * , books : redirected to Books
  } excluding {
    createdBy,
    modifiedBy
  };

  @requires : 'authenticated-user'
  action submitOrder(book : Books:ID, quantity : Integer) returns {
    stock : Integer
  };

  event OrderedBook : {
    book     : Books:ID;
    quantity : Integer;
    buyer    : String
  };
}
