using { sap.capire.bookshop as my } from '../db/schema';
service AdminService @(requires:'admin') {

  entity Books as SELECT from my.Books { *,
    // key ID, key validFrom
  };
  entity Authors as projection on my.Authors;

  // @cds.redirection.target:false
  // entity Books.history @(cds.temporal:false) as projection on Books {
  //   *,
  //   key ID,
  //   key validFrom @(cds.valid.from:false),
  //   validTo @(cds.valid.to:false),
  // };
}

// entity NonTemporalBook as projection on my.Books {
//       *,
//     key ID,
//     key validFrom @(cds.valid.from:false),
//     validTo @(cds.valid.to:false),
// };

extend my.Books with {
  history : Composition of many my.Books on history.ID = $self.ID;
}
