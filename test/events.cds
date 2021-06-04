service Sue {
  @cds.persistence.skip
  entity Foo { key ID:Integer; title:String; status:String(1); }
  entity Bar { key ID:Integer; foo: Association to Foo }
  event Foo.changed : projection on Foo { ID, status }
}
