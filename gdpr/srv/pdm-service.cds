using {
  sap.capire.gdpr as gdpr,
  sap.capire.orders as orders
} from '../db/data-privacy';

@requires : 'PersonalDataManagerUser' // > authorization check
service PDMService {

  entity Customers               as projection on gdpr.Customers;
  entity CustomerPostalAddresses as projection on gdpr.CustomerPostalAddresses;
  entity Orders                  as projection on orders.Orders;

  /*
   * additional annotations for Personal Data Manager's Search Fields
   */
  annotate Customers with @(Communication.Contact : {
    n    : {
      surname : lastName,
      given   : firstName
    },
    bday : dateOfBirth
  });

};
