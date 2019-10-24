namespace sap.capire.currencies;
using { sap.common.Currencies } from '@sap/cds/common';

extend Currencies with {
  // Currencies.code = ISO 4217 alphabetic three-letter code
  // with the first two letters being equal to ISO 3166 alphabetic country codes
  numcode  : Integer;
  exponent : Integer; //> e.g. 2 --> 1 Dollar = 10^2 Cent
  minor    : String; //> e.g. 'Cent'
  // country  : String; //> country or region
}


// see also
// [1] https://www.iso.org/iso-4217-currency-codes.html
// [2] https://www.currency-iso.org/en/home/tables/table-a1.html
// [3] https://www.ibm.com/support/knowledgecenter/en/SSZLC2_7.0.0/com.ibm.commerce.payments.developer.doc/refs/rpylerl2mst97.htm