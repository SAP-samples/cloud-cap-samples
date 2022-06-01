using { sap.fe.cap.travel as my } from '../../db/schema';

//
// annotations for value helps
//

annotate my.Travel {

  TravelStatus @Common.ValueListWithFixedValues;

  to_Agency @Common.ValueList: {
    CollectionPath : 'TravelAgency',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: to_Agency_AgencyID, ValueListProperty: 'AgencyID'},  // local data property is the foreign key
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'Name'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'Street'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'PostalCode'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'City'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'CountryCode_code'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'PhoneNumber'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'EMailAddress'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'WebAddress'}
    ]
  };

  to_Customer @Common.ValueList: {
    CollectionPath : 'Passenger',
    Label : 'Customer ID',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: to_Customer_CustomerID, ValueListProperty: 'CustomerID'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'FirstName'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'LastName'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'Title'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'Street'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'PostalCode'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'City'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'CountryCode_code'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'PhoneNumber'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'EMailAddress'}
    ]
  };

  CurrencyCode @Common.ValueList: {
    CollectionPath : 'Currencies',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: CurrencyCode_code, ValueListProperty: 'code'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'descr'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'symbol'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'minor'}
    ]
  };

}


annotate my.Booking {

  BookingStatus @Common.ValueListWithFixedValues;

  to_Customer @Common.ValueList: {
    CollectionPath : 'Passenger',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: to_Customer_CustomerID, ValueListProperty: 'CustomerID'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'FirstName'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'LastName'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'Title'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'Street'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'PostalCode'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'City'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'CountryCode_code'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'PhoneNumber'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'EMailAddress'}
    ]
  };

  to_Carrier @Common.ValueList: {
    CollectionPath : 'Airline',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: to_Carrier_AirlineID, ValueListProperty: 'AirlineID'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'Name'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'CurrencyCode_code'}
    ]
  };

  ConnectionID @Common.ValueList: {
    CollectionPath : 'Flight',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: to_Carrier_AirlineID,    ValueListProperty: 'AirlineID'},
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: ConnectionID, ValueListProperty: 'ConnectionID'},
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: FlightDate,   ValueListProperty: 'FlightDate'},
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: FlightPrice,  ValueListProperty: 'Price'},
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: CurrencyCode_code, ValueListProperty: 'CurrencyCode_code'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'to_Airline/Name'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'PlaneType'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'MaximumSeats'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'OccupiedSeats'}
    ],
    PresentationVariantQualifier: 'SortOrderPV'  // use presentation variant to sort by FlightDate desc
  };

  FlightDate @Common.ValueList: {
    CollectionPath : 'Flight',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: to_Carrier_AirlineID,    ValueListProperty: 'AirlineID'},
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: ConnectionID, ValueListProperty: 'ConnectionID'},
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: FlightDate,   ValueListProperty: 'FlightDate'},
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: FlightPrice,  ValueListProperty: 'Price'},
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: CurrencyCode_code, ValueListProperty: 'CurrencyCode_code'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'to_Airline/Name'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'PlaneType'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'MaximumSeats'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'OccupiedSeats'}
    ]
  };

  CurrencyCode @Common.ValueList: {
    CollectionPath : 'Currencies',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: CurrencyCode_code, ValueListProperty: 'code'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'descr'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'symbol'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'minor'}
    ]
  };

}


annotate my.BookingSupplement {

  to_Supplement @Common.ValueList: {
    CollectionPath : 'Supplement',
    Label : '',
    Parameters : [
    {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: to_Supplement_SupplementID, ValueListProperty: 'SupplementID'},
    {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: Price,        ValueListProperty: 'Price'},
    {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: CurrencyCode_code, ValueListProperty: 'CurrencyCode_code'},
    {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'Description'}
    ]
  };

  CurrencyCode @Common.ValueList: {
    CollectionPath : 'Currencies',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: CurrencyCode_code, ValueListProperty: 'code'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'descr'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'symbol'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'minor'}
    ]
  };
}


annotate my.Flight {

  AirlineID @Common.ValueList: {
    CollectionPath : 'Airline',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: AirlineID, ValueListProperty: 'AirlineID'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'Name'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'CurrencyCode'}
    ]
  };

  ConnectionID @Common.ValueList: {
    CollectionPath : 'FlightConnection',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: AirlineID, ValueListProperty: 'AirlineID'},
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: ConnectionID, ValueListProperty: 'ConnectionID'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'AirlineID_Text'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'DepartureAirport'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'DestinationAirport'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'DepartureTime'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'ArrivalTime'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'Distance'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'DistanceUnit'}
    ]
  };

}


annotate my.FlightConnection {

  AirlineID @Common.ValueList: {
    CollectionPath : 'Airline',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: AirlineID, ValueListProperty: 'CarrierID'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'AirlineID'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'Name'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'CurrencyCode'}
    ]
  };

  DepartureAirport @Common.ValueList: {
    CollectionPath : 'Airport',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: DepartureAirport_AirportID, ValueListProperty: 'Airport_ID'},  // here FK is required
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'AirportID'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'Name'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'City'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'CountryCode'}
    ]
  };

  DestinationAirport @Common.ValueList: {
    CollectionPath : 'Airport',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut',       LocalDataProperty: DestinationAirport_AirportID, ValueListProperty: 'Airport_ID'},  // here FK is required
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'AirportID'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'Name'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'City'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'CountryCode'}
    ]
  };

}


annotate my.Passenger {

  CountryCode @Common.ValueList : {
    CollectionPath  : 'Countries',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut',       LocalDataProperty : CountryCode_code, ValueListProperty : 'code'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty : 'name'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty : 'descr'}
    ]
  };

}


annotate my.TravelAgency {

  CountryCode @Common.ValueList: {
    CollectionPath : 'Countries',
    Label : '',
    Parameters : [
      {$Type: 'Common.ValueListParameterInOut',       LocalDataProperty: CountryCode_code, ValueListProperty: 'code'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty : 'name'},
      {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty : 'descr'}
    ]
  };

}
