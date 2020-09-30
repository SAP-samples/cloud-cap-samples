namespace sap.capire.media.store;

aspect NamedEntityAspect {
    key ID : Integer;
    name   : String(120);
}

aspect ContactInfoAspect {
    key ID     : Integer;
    lastName   : String(20);
    firstName  : String(40);
    city       : String(40);
    state      : String(40);
    adress     : String(70);
    country    : String(40);
    postalCode : String(10);
    phone      : String(24);
    fax        : String(24);
    email      : String(60);
}

entity MediaTypes : NamedEntityAspect {}
entity Genres : NamedEntityAspect {}
entity Playlists : NamedEntityAspect {}

entity PlaylistTrack {
    key playlist : Association to Playlists;
    key track    : Association to Tracks;
}

entity Artists : NamedEntityAspect {}

entity Albums {
    key ID     : Integer;
        title  : String(120);
        artist : Association to Artists;
}

// entity Employees : ContactInfoAspect {
//     reportsTo : Association to Employees;
//     title     : String(20);
//     birthDate : DateTime;
//     hireDate  : DateTime;
// }

// entity Customers : ContactInfoAspect {
//     company    : String(80);
//     supportRep : Association to Employees;
// }

// keep columns order for importing data
entity Employees {
    key ID         : Integer;
        lastName   : String(20);
        firstName  : String(40);
        title      : String(20);
        reportsTo  : Association to Employees;
        birthDate  : DateTime;
        hireDate   : DateTime;
        adress     : String(70);
        city       : String(40);
        state      : String(40);
        country    : String(40);
        postalCode : String(10);
        phone      : String(24);
        fax        : String(24);
        email      : String(60);
}

entity Customers {
    key ID         : Integer;
        firstName  : String(40);
        lastName   : String(20);
        company    : String(80);
        adress     : String(70);
        city       : String(40);
        state      : String(40);
        country    : String(40);
        postalCode : String(10);
        phone      : String(24);
        fax        : String(24);
        email      : String(60);
        supportRep : Association to Employees;
}

entity Invoices {
    key ID                : Integer;
        customer          : Association to Customers;
        invoiceDate       : DateTime;
        billingAdress     : String(70);
        billingCity       : String(40);
        billingState      : String(40);
        bilingCountry     : String(40);
        billingPostalCode : String(40);
        total             : Decimal(10, 2);
}

entity InvoiceItems {
    key ID        : Integer;
        invoice   : Association to Invoices;
        track     : Association to Tracks;
        unitPrice : Decimal(10, 2);
        quantity  : Integer;
}

entity Tracks {
    key ID           : Integer;
        name         : String(200);
        album        : Association to Albums;
        mediaType    : Association to MediaTypes;
        genre        : Association to Genres;
        composer     : String(220);
        milliseconds : Integer;
        bytes        : Integer;
        unitPrice    : Decimal(10, 2);
}
