//using from '@capire/orders';
using { sap.capire.bookshop as db }          from '../db/schema';
using { sap.capire.bookshop.Books }      from '@capire/bookshop';
using { sap.capire.bookshop.Orders }     from '@capire/orders';
using { sap.capire.bookshop.OrderItems } from '@capire/orders';

//@requires: 'system-user'
 service PDMService {

     entity Customers as projection on db.Customers;

     entity OrderItemView as
     SELECT from Orders
                   { key ID,
                     key Items.ID as Item_ID,
                     OrderNo,
                     Customer.ID as Customer_ID,
                     Customer.email as Customer_Email,
                     Items.book.ID as Item_Book_ID,
                     Items.amount as Item_Amount,
                     Items.netAmount as Item_NetAmount};
  
     annotate PDMService.Customers with @(PersonalData.EntitySemantics: 'DataSubject')
           {
              ID           @PersonalData.FieldSemantics: 'DataSubjectID';
              firstName    @PersonalData.IsPotentiallyPersonal;
              lastName     @PersonalData.IsPotentiallyPersonal;
              creditCardNo @PersonalData.IsPotentiallySensitive;
              dateOfBirth  @PersonalData.IsPotentiallyPersonal;
           };

     annotate PDMService.OrderItemView with @(PersonalData.EntitySemantics: 'ContractRelated')
           {
              Customer_ID  @PersonalData.FieldSemantics: 'DataSubjectID';
           };

 };