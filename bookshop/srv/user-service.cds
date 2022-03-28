/**
 * Exposes user information
 */
@requires : 'authenticated-user'
service UserService {

  /**
   * The current user
   */
  @odata.singleton
  entity Me {
    ID     : String;
    locale : String;
    tenant : String;
  }

}
