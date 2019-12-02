namespace sap.capire.bookshop;
using { Currency, managed, cuid } from '@sap/cds/common';
using { API_BUSINESS_PARTNER.A_BusinessPartnerAddress as extAddresses } from '../srv/external/API_BUSINESS_PARTNER.csn';

entity Books : managed {
  key ID : Integer;
  title  : localized String(111);
  descr  : localized String(1111);
  author : Association to Authors;
  stock  : Integer;
  price  : Decimal(9,2);
  currency : Currency;
}

entity Authors : managed {
  key ID : Integer;
  name   : String(111);
  dateOfBirth  : Date;
  dateOfDeath  : Date;
  placeOfBirth : String;
  placeOfDeath : String;
  books  : Association to many Books on books.author = $self;
}

entity UserMappings {
  key userID: String;
  businessPartnerID: String;
}

entity Orders : cuid, managed {
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many OrderItems on Items.parent = $self;
  total    : Decimal(9,2) @readonly;
  currency : Currency;
  shippingAddress : Association to one ShippingAddresses; // TODO: Composition or Association?
}
entity OrderItems : cuid {
  parent    : Association to Orders;
  book      : Association to Books;
  amount    : Integer;
  netAmount : Decimal(9,2);
}

// TODO: Use external information
entity ShippingAddresses  {
  key AddressID: String;
  CityName: String @readonly;
  StreetName: String @readonly;
  HouseNumber: String @readonly;
}
