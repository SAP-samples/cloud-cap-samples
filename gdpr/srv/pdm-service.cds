using {sap.capire.bookshop as db} from '../db/data-privacy';
using {sap.capire.bookshop.Books} from '../db/data-privacy';
using {sap.capire.orders.Orders} from '../db/data-privacy';
using {sap.capire.orders.OrderItems} from '../db/data-privacy';

//@requires: 'PersonalDataManagerUser' // security check
service PDMService {

  // Data Privacy annotations on 'Customers', 'Addresses', and 'BillingData' are derived from original entity definitions
  entity Customers     as projection on db.Customers;
  entity Addresses     as projection on db.Addresses;
  entity BillingData   as projection on db.BillingData;

  //   create view on Orders and Items as flat projection
  entity OrderItemView as
    select from Orders {
          ID,
      key Items.ID        as item_ID,
          OrderNo,
          customer.ID     as customer_ID,
          customer.email  as customer_email,
          Items.book.ID   as item_Book_ID,
          Items.amount    as item_Amount,
          Items.netAmount as item_NetAmount
    };

  //  annotate new view
  annotate PDMService.OrderItemView with @(PersonalData.EntitySemantics: 'Other') {
    item_ID        @PersonalData.FieldSemantics: 'ContractRelatedID';
    customer_ID    @PersonalData.FieldSemantics: 'DataSubjectID';
    customer_email @PersonalData.IsPotentiallyPersonal;
  };

  // annotations for Personal Data Manager - Search Fields
  annotate Customers with @(Communication.Contact: {
    n   : {
      surname: lastName,
      given  : firstName
    },
    bday: dateOfBirth
  });

};
