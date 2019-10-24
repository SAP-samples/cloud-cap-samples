namespace sap.capire.contacts;


//--------------------------------------------------------------------------
// Aspects


  aspect Organization {
    orgname : String(111);
  }

  aspect Person {
    firstname   : String(111);
    lastname    : String(111);
    prefix      : String(11);
    suffix      : String(11);
    middle      : String(11);
    dateOfBirth : Date;  placeOfBirth : String;
    dateOfDeath : Date;  placeOfDeath : String;
  }

  aspect PostalAddress {
    street    : String(222) @multiline;
    postCode  : String(11);
    district  : String(111);
    city      : String(111);
    region    : String(111);
    country   : String(111);
  }

  aspect ContactOptions {
    email     : String @JSON:[{ kind:String, address: EmailAddress }];
    phone     : String @JSON:[{ kind:String, number: PhoneNumber }];
    // phone     : array of { kind:String; number: PhoneNumber };
    // addresses : Composition of many PostalAddress;
  }

  type EmailAddress : String;
  type PhoneNumber  : String;



//--------------------------------------------------------------------------
// Entities

  @cds.persistence.skip:'if-unused'
  entity Contacts : Person, Organization, ContactOptions {
    key ID    : UUID;
    isOrg     : Boolean;
    addresses : Composition of many PostalAddresses on addresses.contact = $self;
  }

  @cds.persistence.skip:'if-unused'
  entity PostalAddresses : PostalAddress {
    contact : Association to Contacts;
    kind    : String;
    key ID  : UUID;
  }
