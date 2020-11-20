service WithDraft {
  @odata.draft.enabled
  entity Boo as projection on Foo;
}
service WithoutDraft {
  entity Boo as projection on Foo;
}

entity Foo {
  key ID : UUID;
  bar : Composition of many {
    key pos : Integer; //> meant to be a local key only
  }
}
