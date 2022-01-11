/**
 * Exposes data + entity metadata
 */
//@requires:'admin'
service DataService @( path:'-data' ) {

  /**
   * Metadata like name and columns/elements
   */
  entity Entities {
    key name : String;
    columns: Composition of many {
      name :  String;
      type :  String;
      isKey:  Boolean;
    }
  }

  /**
   * The actual data, organized by column name
   */
  entity Data {
    record   : array of {
      column : String;
      data   : String;
    }
  }

}
