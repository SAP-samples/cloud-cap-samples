namespace sap.capire.bookshop;
using from './admin-service';

view Books.field.control as select from Books { ID,
  genre.name == 'Drama' ? 'readonly' :
  null as price
}
extend Books with {
  fc : Association to Books.field.control on fc.ID = $self.ID
}
