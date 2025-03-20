using { sap.capire.bookshop as my } from '../db/schema';
using {my.common.Hierarchy as Hierarchy} from './hierarchy';

extend my.Genres with Hierarchy;
service CatalogService @(path:'/browse') {

  /** For displaying lists of Books */
  @readonly entity ListOfBooks as projection on Books
  excluding { descr };

  /** For display in details pages */
  @readonly entity Books as projection on my.Books { *,
    author.name as author
  } excluding { createdBy, modifiedBy };

  @readonly
  entity GenreHierarchy as projection on my.Genres;

  @requires: 'authenticated-user'
  action submitOrder ( book: Books:ID, quantity: Integer ) returns { stock: Integer };
  event OrderedBook : { book: Books:ID; quantity: Integer; buyer: String };
}
