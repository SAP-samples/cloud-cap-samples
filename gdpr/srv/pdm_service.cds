using from '@capire/bookshop';
using { sap.capire.bookshop as db } from '../db/schema';

@requires: 'system-user'
 service PDM_Service {

     entity Customers as projection on db.Customers;

     entity OrderItems as
     SELECT from db.Orders
                     { key ID,
                     key Items.ID as Item_ID,
                     OrderNo,
                     Customer.ID as Customer_ID,
                     Customer.Email as Customer_Email,
                     Items.book.ID as Item_Book_ID,
                     Items.amount as Item_Amount,
                     Items.netAmount as Item_NetAmount};
 };

 annotate PDM_Service.Customers with @(
 PersonalData.EntitySemantics: 'DataSubject'
 )
 {
 ID    @PersonalData.FieldSemantics: 'DataSubjectID';
 FirstName    @PersonalData.IsPotentiallyPersonal;
 LastName     @PersonalData.IsPotentiallyPersonal;
 CreditCardNo @PersonalData.IsPotentiallyPersonal;
 dateOfBirth  @PersonalData.IsPotentiallyPersonal;
 };