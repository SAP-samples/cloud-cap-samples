using { sap } from '..';

entity Foo {
  key ID  : Integer;
  country : String @ref: sap.capire.contacts.Countries;
}
service Sue {
  entity Foos as projection on Foo;
  // expose Countries to activate provided code lists
  @readonly entity Countries as projection on sap.capire.contacts.Countries;
}
