using { sap.common.CodeList } from '@sap/cds/common';
namespace sap.common.uom;

entity PackagingUnits : CodeList {
  key code : String(3);             // e.g. pc for Piece(s)
  abbrev   : localized String(3);   // e.g. st for Stück
}

entity Weights : CodeList {
  key code : String(3); // e.g. kg for Kilogram(s)
}

entity Lengths : CodeList {
  key code : String(3); // e.g. m for Meter(s)
}

type PackagingUnit : Association to PackagingUnits;
type Length : Association to Lengths;
type Weight : Association to Weights;
