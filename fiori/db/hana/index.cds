//
//  Add Author.age and .lifetime with a DB-specific function
//

using { AdminService, sap.common } from '@capire/bookshop';

extend projection AdminService.Authors with {
  YEARS_BETWEEN(dateOfBirth, dateOfDeath)         as age: Integer,
  YEAR(dateOfBirth) || ' – ' || YEAR(dateOfDeath) as lifetime : String
}


// Workaround: include Countries table because csv files point to it
// TODO fix by ignoring hdbtabledata generation for unused entities
annotate common.Countries with @cds.persistence.skip : false;
