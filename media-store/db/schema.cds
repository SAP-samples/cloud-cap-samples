namespace sap.capire.media.store;

aspect Named {
    key ID : Integer default 1;
    name   : String(120);
}

aspect Person {
    key ID     : Integer;
    lastName   : String(20) default 'dummy';
    firstName  : String(40) default 'dummy';
    city       : String(40) default 'dummy';
    state      : String(40) default 'dummy';
    address    : String(70) default 'dummy';
    country    : String(40) default 'dummy';
    postalCode : String(10) default 123;
    phone      : String(24) default 'dummy';
    fax        : String(24) default 'dummy';
    email      : String(60) default 'dummy@email.com';
    password   : String(500) default 'dummy';
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

entity Employees : Person {
    reportsTo    : Association to Employees;
    title        : String(20);
    birthDate    : DateTime;
    hireDate     : DateTime;
    subordinates : Association to many Employees
                       on subordinates.reportsTo = $self;
}

entity Customers : Person {
    company    : String(80);
    supportRep : Association to Employees;
    invoices   : Association to many Invoices
                     on invoices.customer = $self;
}

entity Invoices {
    key ID                : Integer;
        customer          : Association to Customers;
        invoiceDate       : DateTime;
        billingAddress    : String(70) default 'dummy';
        billingCity       : String(40) default 'dummy';
        billingState      : String(40) default 'dummy';
        billingCountry    : String(40) default 'dummy';
        billingPostalCode : String(40) default 123;
        total             : Decimal(10, 2);
        invoiceItems      : Composition of many InvoiceItems
                                on invoiceItems.invoice = $self;
        status            : Integer enum {
            submitted = 1;
            canceled  = -1;
        } default 1;
}

entity InvoiceItems {
    key ID        : Integer;
        invoice   : Association to Invoices;
        track     : Association to Tracks;
        unitPrice : Decimal(10, 2);
        quantity  : Integer default 1;
}

entity Tracks {
    key ID                     : Integer;
        name                   : String(200);
        album                  : Association to Albums;
        mediaType              : Association to MediaTypes;
        genre                  : Association to Genres;
        composer               : String(220);
        milliseconds           : Integer default 230619;
        bytes                  : Integer default 3990994;
        unitPrice              : Decimal(10, 2) default 0.99;
        virtual alreadyOrdered : Boolean;

        // Two compositions below needed for cascade delete track
        invoiceItems           : Composition of many InvoiceItems
                                     on invoiceItems.track = $self;
        playlistTracks         : Composition of many {
                                     key playlist : Association to Playlists;
                                     key track    : Association to Tracks;
                                 };
};
