namespace sap.capire.media.store;

aspect NamedEntityAspect {
    key ID : Integer;
    name   : String(120);
}

aspect ContactInfoAspect {
    firstName  : String(40);
    lastName   : String(20);
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

entity Employees : ContactInfoAspect {
    key ID        : Integer;
        reportsTo : Association to Employees;
        title     : String(20);
        birthDate : DateTime;
        hireDate  : DateTime;
}

entity Customers : ContactInfoAspect {
    key ID           : Integer;
        company      : String(80);
        supportRepId : Association to Employees;
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
