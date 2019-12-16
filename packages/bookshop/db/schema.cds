namespace sap.capire.bookshop;
using { Currency, managed, cuid } from '@sap/cds/common';
using { API_BUSINESS_PARTNER as external } from '../srv/external/API_BUSINESS_PARTNER';

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

entity Orders : cuid, managed {
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many OrderItems on Items.parent = $self;
  total    : Decimal(9,2) @readonly;
  currency : Currency;
  shippingAddress : Association to one ShippingAddresses;
}
entity OrderItems : cuid {
  parent    : Association to Orders;
  book      : Association to Books;
  amount    : Integer;
  netAmount : Decimal(9,2);
}

@cds.persistence: {table, skip: false}
entity ShippingAddresses as projection on external.A_BusinessPartnerAddress  {
  key AddressID,
  key BusinessPartner,
  Country as country,
  CityName as cityName,
  PostalCode as postalCode,
  StreetName as streetName,
  HouseNumber as houseNumber
}