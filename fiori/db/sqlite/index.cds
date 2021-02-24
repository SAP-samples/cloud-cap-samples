//
//  Add Author.age with an DB-specific function
//

using { AdminService } from '..';

extend projection AdminService.Authors with {
  strftime('%Y',dateOfDeath)-strftime('%Y',dateOfBirth) as age: Integer  @title : '{i18n>Age}',
  strftime('%Y',dateOfBirth)
    || ' – '
    || strftime('%Y',dateOfDeath)
  as lifetime : String
}
