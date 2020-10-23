using {sap.capire.media.store as my} from '../db/schema';

service Users {
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

    function mockLogin(email : String(111), password : String(200)) returns {
        roles       : array of String(111);
        level       : Integer;
        mockedToken : String(500);
        email       : my.Persone.email;
        ID          : my.Persone.ID
    };
}
