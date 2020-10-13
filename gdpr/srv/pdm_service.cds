@requires: 'system-user'
 service GDPRService {

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