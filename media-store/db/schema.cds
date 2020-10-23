namespace sap.capire.media.store;

aspect Named {
    key ID : Integer;
    name   : String(120);
}

aspect Persone {
    key ID     : Integer;
    lastName   : String(20);
    firstName  : String(40);
    city       : String(40);
    state      : String(40);
    address    : String(70);
    country    : String(40);
    postalCode : String(10);
    phone      : String(24);
    fax        : String(24);
    email      : String(60);
    password   : String(111);
}

entity MediaTypes : Named {}

entity Genres {
    key ID     : Integer;
        name   : localized String;
        tracks : Association to many Tracks
                     on tracks.genre = $self;
}

entity Playlists : Named {}

entity PlaylistTrack {
    key playlist : Association to Playlists;
    key track    : Association to Tracks;
}

entity Artists : Named {}

entity Albums {
    key ID     : Integer;
        title  : String(120);
        artist : Association to Artists;
        tracks : Association to many Tracks
                     on tracks.album = $self;
}

entity Employees : Persone {
    reportsTo    : Association to Employees;
    title        : String(20);
    birthDate    : DateTime;
    hireDate     : DateTime;
    subordinates : Association to many Employees
                       on subordinates.reportsTo = $self;
}

entity Customers : Persone {
    company    : String(80);
    supportRep : Association to Employees;
    invoices   : Association to many Invoices
                     on invoices.customer = $self;
}

entity Invoices {
    key ID                : Integer;
        customer          : Association to Customers;
        invoiceDate       : DateTime;
        billingAddress    : String(70);
        billingCity       : String(40);
        billingState      : String(40);
        billingCountry    : String(40);
        billingPostalCode : String(40);
        total             : Decimal(10, 2);
        invoiceItems      : Association to many InvoiceItems
                                on invoiceItems.invoice = $self;
}

entity InvoiceItems {
    key ID        : Integer;
        invoice   : Association to Invoices;
        track     : Association to Tracks;
        unitPrice : Decimal(10, 2);
        quantity  : Integer;
}

entity Tracks {
    key ID                     : Integer;
        name                   : String(200);
        album                  : Association to Albums;
        mediaType              : Association to MediaTypes;
        genre                  : Association to Genres;
        composer               : String(220);
        milliseconds           : Integer;
        bytes                  : Integer;
        unitPrice              : Decimal(10, 2);
        invoiceItems           : Association to many InvoiceItems
                                     on invoiceItems.track = $self;
        virtual alreadyOrdered : Boolean;
}
