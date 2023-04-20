using {sap.capire.bookshop as db}      from '../db/data-privacy';
using {sap.capire.bookshop.Books}      from '../db/data-privacy';
using {sap.capire.bookshop.Orders}     from '../db/data-privacy';
using {sap.capire.bookshop.OrderItems} from '../db/data-privacy';

//@requires: 'PersonalDataManagerUser' // security check
service PDMService {

  entity Customers             as projection on db.Customers;
  entity CustomerPostalAddress as projection on db.CustomerPostalAddress;

  //   create view on Orders and Items as flat projection
  entity OrderItemView         as
    select from Orders {
          ID,
      key Items.ID        as Item_ID,
          OrderNo,
          Customer.ID     as Customer_ID,
          Customer.email  as Customer_Email,
          Items.book.ID   as Item_Book_ID,
          Items.amount    as Item_Amount,
          Items.netAmount as Item_NetAmount
    };

  //  annotate new view
  annotate PDMService.OrderItemView with @(PersonalData.EntitySemantics : 'Other') {
    Item_ID        @PersonalData.FieldSemantics : 'ContractRelatedID';
    Customer_ID    @PersonalData.FieldSemantics : 'DataSubjectID';
    Customer_Email @PersonalData.IsPotentiallyPersonal;
  };

  // annotations for Personal Data Manager - Search Fields
  annotate Customers with @(Communication.Contact : {
    n    : {
      surname : lastName,
      given   : firstName
    },
    bday : dateOfBirth
  });

  //  Data Privacy annotations on 'Customers' and 'CustomerPostalAddress' are derived from original entity definitions

};
