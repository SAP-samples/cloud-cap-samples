//
//  Add Author.age and .lifetime with a DB-specific function
//

using { AdminService } from '@capire/bookshop';

extend projection AdminService.Authors with {
  YEARS_BETWEEN(dateOfBirth, dateOfDeath)         as age: Integer,
  YEAR(dateOfBirth) || ' – ' || YEAR(dateOfDeath) as lifetime : String
}
