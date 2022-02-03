using {
  sap.capire.orders,
  sap.capire.gdpr
} from '../db/schema';

@requires : 'admin' // > authorization check
service GDPRService {
  entity Customers as projection on gdpr.Customers;
  entity Orders    as projection on orders.Orders;
}
