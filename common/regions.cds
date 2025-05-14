using { sap.common } from '@sap/cds/common';
namespace sap.common.countries;

extend common.Countries {
  regions   : Composition of many Regions on regions._parent = $self.code;
}

entity Regions : common.CodeList {
  key code : String(5); // ISO 3166-2 alpha5 codes, e.g. DE-BW
  children  : Composition of many Regions on children._parent = $self.code;
  cities    : Composition of many Cities on cities.region = $self;
  _parent   : String(11);
}
entity Cities : common.CodeList {
  key code  : String(11);
  region    : Association to Regions;
  districts : Composition of many Districts on districts.city = $self;
}
entity Districts : common.CodeList {
  key code  : String(11);
  city      : Association to Cities;
}
