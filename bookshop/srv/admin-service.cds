using { sap.capire.bookshop as my } from '../db/schema';
using { my.common.Hierarchy as Hierarchy } from './hierarchy';

extend my.Genres with Hierarchy;

service AdminService @(requires:'admin', path:'/admin') {
  entity Books          as projection on my.Books;
  entity Authors        as projection on my.Authors;
  @readonly
  @cds.search: {name}
  entity GenreHierarchy as projection on my.Genres
}
