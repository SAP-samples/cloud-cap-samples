using {sap.capire.media.store as my} from '../db/schema';

service Users {
    /**
     * Below entities also restricted programmatically. Only User
     * can only access to yours record
     */
    entity Customers as projection on my.Customers excluding {
        password,
        supportRep
    };

    entity Employees as projection on my.Customers excluding {
        password,
        supportRep
    };

    action login(email : String(111), password : String(200)) returns {
        roles : array of String(111);
        token : String(500);
        email : String(500);
        ID    : Integer;
    };
}

annotate Users.Customers with @(restrict : [{
    grant : [
        'READ',
        'UPDATE'
    ],
    to    : 'customer'
}]);

annotate Users.Employees with @(restrict : [{
    grant : [
        'READ',
        'UPDATE'
    ],
    to    : 'employee'
}]);
