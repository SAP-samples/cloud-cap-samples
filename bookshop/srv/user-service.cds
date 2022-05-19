/**
 * Exposes user information
 */
service UserService {
  /**
   * The current user
   */
  @odata.singleton entity me {
    id     : String; // user id
    locale : String;
    tenant : String;
  }

  action login() returns me;
}
