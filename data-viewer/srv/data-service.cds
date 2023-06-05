/**
 * Exposes data + entity metadata
 */
@requires: 'authenticated-user'
@odata
service DataService @(path: '-data') {

  /**
   * Metadata like name and columns/elements
   */
  entity Entities @cds.persistence.skip {
    key name    : String;
        columns : Composition of many {
                    name  : String;
                    type  : String;
                    isKey : Boolean;
                  }
  }

  /**
   * The actual data, organized by column name
   */
  entity Data @cds.persistence.skip {
    record : array of {
      column : String;
      data   : String;
    }
  }

}
