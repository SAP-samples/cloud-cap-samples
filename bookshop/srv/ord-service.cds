// @requires: 'ORDconsumer'
@rest @path:'/ord/v1'
service OrdService {
  @readonly entity documents {
    key id: String;
  }
  @readonly entity csn {
    key id: String;
  }

  function api (service: String, format: String) returns {};
}
