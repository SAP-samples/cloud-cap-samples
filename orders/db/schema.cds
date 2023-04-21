using { sap.capire.bookshop.Books }       from '../../bookshop/db/schema';
using { User, Currency, managed, cuid }   from '../../common';
namespace sap.capire.orders;

entity Orders : cuid, managed {
  OrderNo  : String(22) @title:'Order Number'; //> readable key
  Items    : Composition of many OrderItems;
  buyer    : User;
  currency : Currency;
}

entity OrderItems : cuid, managed {
    book      : Association to Products;
    quantity  : Integer;
    title     : String; //> intentionally replicated as snapshot from product.title
    amount    : Double; //> materialized calculated field
    netAmount : Double; 
}

/** This is a stand-in for arbitrary ordered Products */
entity Products @(cds.persistence.skip:'always') {
  key ID : String;
}


// this is to ensure we have filled-in currencies
// using from '@capire/common';
