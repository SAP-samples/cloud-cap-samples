using {sap.capire.bookshop as my} from '../db/schema';

service AdminService // @(requires : 'admin')
{
  entity Books   as projection on my.Books actions {
    action   increaseStock(count : Integer);
    function stock() returns Integer;
  };

@Extensibility : {
  Fields.Enabled      : true,
  Fields.Quota: 100,
  Relations.Enabled   : false,
  Annotations.Enabled : true,
  Logic.Enabled : true,
  Logic.constraints: true,
  Logic.calculations: true,
  Logic.Handler : [create, update, delete, read]
}
  entity Authors as projection on my.Authors;

  action renameAuthor(author : Authors:ID, newName : String) returns {
    msg : String
  };
  function getStock(book: Books:ID) returns Integer;
  event newBook : {
    book : Books:ID;
    name : Books:title
  };
}
