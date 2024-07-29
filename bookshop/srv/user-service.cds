/**
 * Exposes user information
 */
service UserService @(path: '/user') {
  /**
   * The current user
   */
  @odata.singleton entity me @cds.persistence.skip {
    id     : String; // user id
    locale : String;
    tenant : String;
  }

  action login() returns me;
}
