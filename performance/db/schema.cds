using { Currency, cuid, managed } from '@sap/cds/common';

namespace sap.capire.performance;


entity OrdersHeaders : managed {
  key ID   : UUID;
  OrderNo  : String @title:'Order Number'; //> readable key 
  buyer    : String;
  currency : Currency;
  Items    : Composition of many OrdersItems on Items.Header = $self;
}

entity OrdersItems   {
    key ID    : UUID;
    product   : Association to Books;
    quantity  : Integer;
    title     : String; //> intentionally replicated as snapshot from product.title
    price     : Double; //> materialized calculated field
    Header    : Association to OrdersHeaders;  
};


entity Books {
  key ID : Integer;
  title  : localized String(111);
  descr  : localized String(1111);
  author : Association to Authors;
  stock  : Integer;
  price  : Decimal;
  currency : Currency;
}

entity Authors  {
  key ID : Integer;
  name   : String(111);
  dateOfBirth  : Date;
  dateOfDeath  : Date;
  placeOfBirth : String;
  placeOfDeath : String;
  books  : Association to many Books on books.author = $self;
}


entity Apples : cuid, managed { 
  description  : String;
  vendor       : association to one Vendor;
  appleDetails : appleDetailsType;
}

entity Bananas : cuid, managed { 
  description   : String;
  vendor        : association to one Vendor;
  bananaDetails : bananaDetailsType;
}

entity Cherries : cuid, managed {
  description   : String;
  vendor        : association to one Vendor;
  cherryDetails : cherryDetailsType;
}

entity Mangos : cuid, managed {
  description  : String;
  vendor       : association to one Vendor;
  mangoDetails : mangoDetailsType;
}

entity Vendor : cuid, managed { 
  description  : String;
}

type appleDetailsType  : String;
type bananaDetailsType : String;
type cherryDetailsType : String;
type mangoDetailsType  : String;

entity Fruit : cuid, managed {
    type          : String enum { apple; banana; cherry; mango };
    description   : String;
    vendor        : association to one Vendor;   
    appleDetails  : composition of AppleDetails;
    bananaDetails : composition of BananaDetails;
    cherryDetails : composition of CherryDetails;
    mangoDetails  : composition of MangoDetails; 
}

entity AppleDetails : cuid {
  appleDetails : appleDetailsType;
}

entity BananaDetails : cuid {
  bananaDetails : bananaDetailsType;
}

entity CherryDetails : cuid {
  cherryDetails : cherryDetailsType;
}

entity MangoDetails : cuid {
  mangoDetails : mangoDetailsType;
}

view Banana as select from Fruit
{
    type,
    description,
    vendor,
    bananaDetails,
}
    where type = 'banana';


aspect apple  { appleDetails  : appleDetailsType; };
aspect banana { bananaDetails : bananaDetailsType;};
aspect cherry { cherryDetails : cherryDetailsType;};
aspect mango  { mangoDetails  : mangoDetailsType; };
entity Fruit_2 : apple, banana, cherry, mango, cuid, managed {
    type        : String enum { apple; banana; cherry; mango };
    description : String;
    vendor      : association to one Vendor;
}