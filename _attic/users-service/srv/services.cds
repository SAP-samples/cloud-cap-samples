using { sap.capire.contacts.Contacts as RegisteredUsers } from '@sap/capire-contacts';
namespace sap.capire.users;

service UsersService @(requires:'authenticated-user') {
  entity MyProfile as select from RegisteredUsers;
  action login ();
}