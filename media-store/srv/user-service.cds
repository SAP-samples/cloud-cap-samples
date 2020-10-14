using {sap.capire.media.store as my} from '../db/schema';

service UserService {
    function mockLogin(email : String(111), password : String(200)) returns {
        roles       : array of String(111);
        level       : Integer;
        mockedToken : String(500);
        email       : my.Persone.email;
        ID          : my.Persone.ID
    }
}
