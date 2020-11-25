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

    type AuthData {
        accessToken  : String(500);
        refreshToken : String(500);
        ID           : Integer;
        email        : String(500);
        roles        : array of String(111);
    };

    action login(email : String(111), password : String(200)) returns AuthData;
    action refreshTokens(refreshToken : String(500)) returns AuthData;
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
