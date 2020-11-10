//using from '@capire/orders';
using { sap.capire.bookshop as db }      from '../db/schema';
using { sap.capire.bookshop.Books }      from '@capire/bookshop';
using { sap.capire.bookshop.Orders }     from '@capire/orders';
using { sap.capire.bookshop.OrderItems } from '@capire/orders';

//@requires: 'system-user'
 service PDMService {

     entity Customers as projection on db.Customers;

     entity CustomerPostalAddress as projection on db.CustomerPostalAddress;

//   create view on Orders and Items as flat projection
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
  
 //  annotate new view 
     annotate PDMService.OrderItemView with @(PersonalData.EntitySemantics: 'ContractRelated')
           {
              Customer_ID    @PersonalData.FieldSemantics: 'DataSubjectID';
              Customer_Email @PersonalData.IsPotentiallyPersonal;
           };

 //  Data Privacy annotations on 'Customers' and 'CustomerPostalAddress' are derived from original entity definitions           

 };