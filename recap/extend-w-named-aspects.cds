using { User, cuid, managed } from '@sap/cds/common';

// Looks like inheritance, but isn't
entity Foo @bar : cuid, managed { bar:Car; }

// It's just syntactical sugar for Aspects
entity Boo {}
extend Boo with cuid;
extend Boo with managed;
extend Boo with { bar:Car; }
annotate Boo with @bar;

// There's close to no limits
entity Moo : Foo {}
entity Zoo {}; extend Zoo with Foo;

// This one will apply to all uses above
type Car : String;
annotate Car with @car;

// And these to all uses here and wherever else
extend managed with {
  notes : String;
}

// CDS is built with CDS
annotate cds.UUID with @odata.Type: 'Edm.Integer';
