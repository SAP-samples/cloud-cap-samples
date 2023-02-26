//
//  Add Author.age and .lifetime with a DB-specific function
//

using { AdminService } from '@capire/bookshop';

extend projection AdminService.Authors with {
  strftime('%Y',dateOfDeath)-strftime('%Y',dateOfBirth)              as age: Integer,
  strftime('%Y',dateOfBirth) || ' – ' || strftime('%Y',dateOfDeath)  as lifetime : String
}
