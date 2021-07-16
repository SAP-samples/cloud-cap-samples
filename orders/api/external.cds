context external {

  /** This is a stand-in for arbitrary ordered Products */
  entity Products @(cds.persistence.skip:'always') {
    key ID : String;
    data : String;
  }

}
