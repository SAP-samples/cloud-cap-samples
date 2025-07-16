namespace sap.capire.bookshop;
using from '../db/schema';


/**
 * Validation constraints for Books
 */
view Books.constraints as select from Books { ID,

  // two-step mandatory check
  case
    when title is null  then 'is missing'
    when trim(title)='' then 'must not be empty'
  end as title,
  // the above is equivalent to:
  // title is null ? 'is missing' : trim(title)='' ? 'must not be empty' :

  // range check
  stock < 0 ? 'must not be negative' :
  null as stock,

  // range check
  price < 0 ? 'must not be negative' :
  null as price,

  // assert target check
  genre.ID is not null and not exists genre ? 'does not exist' :
  null as genre,

  // multiple constraints: mandatory + assert target + special
  not exists author ? 'Author does not exist: ' || author.ID :
  author.ID is null ? 'is missing' : // FIXME: expected author.ID to refer to foreign key, apparently that is not the case -> move one line up to see
  count(author.books.ID) -1 > 1 ? author.name || ' already wrote multiple books, please choose another author' : // TODO: we should support count(author.books)
  null as author,

} group by ID;



/**
 * Validation constraints for Authors
 */
view Authors.constraints as select from Authors { ID,

  // two-step mandatory check
  name = null ? 'is missing' : trim(name)='' ? 'must not be empty' :
  null as name,

  // constraint related to two fields
  dateOfDeath > dateOfBirth ? 'date of birth must be before date of death' : null as _born_before_death,
  $self._born_before_death as dateOfBirth,
  $self._born_before_death as dateOfDeath,

}
