using { sap.fe.cap.travel as schema } from '../../db/schema';

//
// annotations that control rendering of fields and labels
//

annotate schema.Travel with @title: '{i18n>Travel}' {
  TravelUUID   @UI.Hidden;
  TravelID     @title: '{i18n>TravelID}'      @Common.Text: Description;
  BeginDate    @title: '{i18n>BeginDate}';
  EndDate      @title: '{i18n>EndDate}';
  Description  @title: '{i18n>Description}';
  BookingFee   @title: '{i18n>BookingFee}'    @Measures.ISOCurrency: CurrencyCode_code;
  TotalPrice   @title: '{i18n>TotalPrice}'    @Measures.ISOCurrency: CurrencyCode_code;
  TravelStatus @title: '{i18n>TravelStatus}'  @Common.Text: TravelStatus.name     @Common.TextArrangement: #TextOnly;
  to_Customer  @title: '{i18n>CustomerID}'    @Common.Text: to_Customer.LastName;
  to_Agency    @title: '{i18n>AgencyID}'      @Common.Text: to_Agency.Name;
}

annotate schema.TravelStatus with {
  code @Common.Text: name @Common.TextArrangement: #TextOnly
}

annotate schema.Booking with @title: '{i18n>Booking}' {
  BookingUUID   @UI.Hidden;
  to_Travel     @UI.Hidden;
  BookingID     @title: '{i18n>BookingID}';
  BookingDate   @title: '{i18n>BookingDate}';
  ConnectionID  @title: '{i18n>ConnectionID}';
  CurrencyCode  @title: '{i18n>CurrencyCode}';
  FlightDate    @title: '{i18n>FlightDate}';
  FlightPrice   @title: '{i18n>FlightPrice}'    @Measures.ISOCurrency: CurrencyCode_code;
  BookingStatus @title: '{i18n>BookingStatus}'  @Common.Text: BookingStatus.name    @Common.TextArrangement: #TextOnly;
  to_Carrier    @title: '{i18n>AirlineID}'      @Common.Text: to_Carrier.Name;
  to_Customer   @title: '{i18n>CustomerID}'     @Common.Text: to_Customer.LastName;
}

annotate schema.BookingStatus with {
  code @Common.Text : name @Common.TextArrangement: #TextOnly
}

annotate schema.BookingSupplement with @title: '{i18n>BookingSupplement}' {
  BookSupplUUID        @UI.Hidden;
  to_Booking           @UI.Hidden;
  to_Travel            @UI.Hidden;
  to_Supplement        @title: '{i18n>SupplementID}'  @Common.Text: to_Supplement.Description;
  Price                @title: '{i18n>Price}'         @Measures.ISOCurrency: CurrencyCode_code;
  BookingSupplementID  @title: '{i18n>BookingSupplementID}';
  CurrencyCode         @title: '{i18n>CurrencyCode}';
}

annotate schema.TravelAgency with @title: '{i18n>TravelAgency}' {
  AgencyID     @title: '{i18n>AgencyID}'      @Common.Text: Name;
  Name         @title: '{i18n>AgencyName}';
  Street       @title: '{i18n>Street}';
  PostalCode   @title: '{i18n>PostalCode}';
  City         @title: '{i18n>City}';
  CountryCode  @title: '{i18n>CountryCode}';
  PhoneNumber  @title: '{i18n>PhoneNumber}';
  EMailAddress @title: '{i18n>EMailAddress}';
  WebAddress   @title: '{i18n>WebAddress}';
}

annotate schema.Passenger with @title: '{i18n>Passenger}' {
  CustomerID   @title: '{i18n>CustomerID}'    @Common.Text: LastName;
  FirstName    @title: '{i18n>FirstName}';
  LastName     @title: '{i18n>LastName}';
  Title        @title: '{i18n>Title}';
  Street       @title: '{i18n>Street}';
  PostalCode   @title: '{i18n>PostalCode}';
  City         @title: '{i18n>City}';
  CountryCode  @title: '{i18n>CountryCode}';
  PhoneNumber  @title: '{i18n>PhoneNumber}';
  EMailAddress @title: '{i18n>EMailAddress}';
}

annotate schema.Airline with @title: '{i18n>Airline}' {
  AirlineID    @title: '{i18n>AirlineID}'     @Common.Text: Name;
  Name         @title: '{i18n>Name}';
  CurrencyCode @title: '{i18n>CurrencyCode}';
}

annotate schema.Flight with @title: '{i18n>Flight}' {
  AirlineID     @title: '{i18n>AirlineID}';
  FlightDate    @title: '{i18n>FlightDate}';
  ConnectionID  @title: '{i18n>ConnectionID}';
  CurrencyCode  @title: '{i18n>CurrencyCode}';
  Price         @title: '{i18n>Price}'        @Measures.ISOCurrency: CurrencyCode_code;
  PlaneType     @title: '{i18n>PlaneType}';
  MaximumSeats  @title: '{i18n>MaximumSeats}';
  OccupiedSeats @title: '{i18n>OccupiedSeats}';
}

annotate schema.Supplement with @title: '{i18n>Supplement}' {
  SupplementID @title: '{i18n>SupplementID}'  @Common.Text: Description;
  Price        @title: '{i18n>Price}'         @Measures.ISOCurrency: CurrencyCode_code;
  CurrencyCode @title: '{i18n>CurrencyCode}';
  Description  @title: '{i18n>Description}';
}
