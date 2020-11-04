using {sap.capire.media.store as my} from '../db/schema';

service Users {
    // redundant entity
    // We need actions without exposing entity for now.
    // But we forced to expose for make actions work.
    entity Customers @(restrict : [{
        grant : [
            'READ',
            'WRITE'
        ],
        to    : 'employee'
    }, ]) as projection on my.Customers;

    type Person {
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
    }

    @(requires : 'authenticated-user')
    action updatePerson(person : Person);

    @(requires : 'authenticated-user')
    function getPerson() returns Person;

    action login(email : String(111), password : String(200)) returns {
        roles : array of String(111);
        token : String(500);
        email : String(500);
        ID    : Integer;
    };
}
