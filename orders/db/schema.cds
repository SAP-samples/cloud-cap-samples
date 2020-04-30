using { sap.capire.bookshop.Books } from '@capire/bookshop';
using { Currency, managed, cuid } from '@sap/cds/common';
namespace sap.capire.bookshop;

entity Orders : cuid, managed {
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many {
    key pos : Integer;
    book    : Association to Books;
    amount  : Integer;
  };
  currency : Currency;
}
