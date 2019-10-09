namespace sap.capire.bookstore;

// We reuse Products, which are Books in our domain
using { sap.capire.products.Products as Books } from '@sap/capire-products';
extend Books with {
  author : Association to Authors;
  rating : Decimal(2,1);
}

// We reuse aspect Person to define Authors
using { sap.capire.contacts.Person } from '@sap/capire-contacts';
entity Authors : Person {
  key ID : UUID;
  books  : Association to many Books on books.author = $self;
}

// we use enhanced currencies code lists
using from '@sap/capire-currencies';
