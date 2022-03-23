@requires : 'authenticated-user'
service UserService {

  @odata.singleton
  entity User {
    ID     : String;
    locale : String;
    tenant : String;
  }

}
