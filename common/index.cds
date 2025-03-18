using { sap } from '@sap/cds/common';

using from '@sap/cds-common-content';

extend sap.common.Currencies with {
  // Currencies.code = ISO 4217 alphabetic three-letter code
  // with the first two letters being equal to ISO 3166 alphabetic country codes
  // See also:
  // [1] https://www.iso.org/iso-4217-currency-codes.html
  // [2] https://www.currency-iso.org/en/home/tables/table-a1.html
  // [3] https://www.ibm.com/support/knowledgecenter/en/SSZLC2_7.0.0/com.ibm.commerce.payments.developer.doc/refs/rpylerl2mst97.htm
  numcode  : Integer;
  exponent : Integer; //> e.g. 2 --> 1 Dollar = 10^2 Cent
  minor    : String; //> e.g. 'Cent'
}


/**
 * The Code Lists below are designed as optional extensions to
 * the base schema. Switch them on by adding an Association to
 * one of the code list entities in your models or by:
 * annotate sap.common.Countries with @cds.persistence.skip:false;
 */

context sap.common.countries {

  extend sap.common.Countries {
    regions   : Composition of many Regions on regions._parent = $self.code;
  }

  entity Regions : sap.common.CodeList {
    key code : String(5); // ISO 3166-2 alpha5 codes, e.g. DE-BW
    children  : Composition of many Regions on children._parent = $self.code;
    cities    : Composition of many Cities on cities.region = $self;
    _parent   : String(11);
  }
  entity Cities : sap.common.CodeList {
    key code  : String(11);
    region    : Association to Regions;
    districts : Composition of many Districts on districts.city = $self;
  }
  entity Districts : sap.common.CodeList {
    key code  : String(11);
    city      : Association to Cities;
  }

}
