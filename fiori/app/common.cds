/*
 Common Annotations shared by all apps
*/

using { sap.capire.bookshop as my } from '@capire/bookstore';
using { sap.common } from '@capire/common';
using { sap.common.Currencies } from '@sap/cds/common';

////////////////////////////////////////////////////////////////////////////
//
//	Books Lists
//
annotate my.Books with @(
  Common.SemanticKey : [ID],
  UI                 : {
    Identification  : [{ Value: title }],
    SelectionFields : [
      ID,
      author_ID,
      price,
      currency_code
    ],
    LineItem        : [
      { Value: ID, Label: '{i18n>Title}' },
      { Value: author.ID, Label: '{i18n>Author}' },
      { Value: genre.name },
      { Value: stock },
      { Value: price },
      { Value: currency.symbol },
    ]
  }
) {
  ID  @Common: {
    SemanticObject : 'Books',
    Text: title,
    TextArrangement : #TextOnly
  };
  author @ValueList.entity      : 'Authors';
};

annotate Currencies with {
  symbol @Common.Label : '{i18n>Currency}';
}

////////////////////////////////////////////////////////////////////////////
//
//	Books Details
//
annotate my.Books with @(UI : {HeaderInfo : {
  TypeName       : '{i18n>Book}',
  TypeNamePlural : '{i18n>Books}',
  Title          : { Value: title },
  Description    : { Value: author.name }
}, });


////////////////////////////////////////////////////////////////////////////
//
//	Books Elements
//
annotate my.Books with {
  ID     @title: '{i18n>ID}';
  title  @title: '{i18n>Title}';
  genre  @title: '{i18n>Genre}'   @Common: { Text: genre.name, TextArrangement: #TextOnly };
  author @title: '{i18n>Author}'  @Common: { Text: author.name, TextArrangement: #TextOnly };
  price  @title: '{i18n>Price}'   @Measures.ISOCurrency : currency_code;
  stock  @title: '{i18n>Stock}';
  descr  @title: '{i18n>Description}'  @UI.MultiLineText;
  image  @title: '{i18n>Image}';
}

////////////////////////////////////////////////////////////////////////////
//
//	Computed Fields for Tree Tables 
//
//  DISCLAIMER: The below are an alpha version implementation and will change in final release !!!
//
aspect Hierarchy {
  LimitedDescendantCount : Integer64 = null;
  DistanceFromRoot       : Integer64 = null;
  DrillState             : String = null;
  Matched                : Boolean = null;
  MatchedDescendantCount : Integer64 = null;
  LimitedRank            : Integer64 = null;
}

annotate Hierarchy with @Capabilities.FilterRestrictions.NonFilterableProperties: [
  'LimitedDescendantCount',
  'DistanceFromRoot',
  'DrillState',
  'Matched',
  'MatchedDescendantCount',
  'LimitedRank'
];

annotate Hierarchy with @Capabilities.SortRestrictions.NonSortableProperties: [
  'LimitedDescendantCount',
  'DistanceFromRoot',
  'DrillState',
  'Matched',
  'MatchedDescendantCount',
  'LimitedRank'
];

extend my.Genres with Hierarchy;

////////////////////////////////////////////////////////////////////////////
//
//	Genres Tree Table Annotations
//
//  DISCLAIMER: The below are an alpha version implementation and will change in final release !!!
//
annotate my.Genres with @Aggregation.RecursiveHierarchy #GenreHierarchy: {
  $Type                   : 'Aggregation.RecursiveHierarchyType',
  NodeProperty            : ID, // identifies a node
  ParentNavigationProperty: parent // navigates to a node's parent
};

annotate my.Genres with @Hierarchy.RecursiveHierarchy #GenreHierarchy: {
  $Type                 : 'Hierarchy.RecursiveHierarchyType',
  LimitedDescendantCount: LimitedDescendantCount,
  DistanceFromRoot      : DistanceFromRoot,
  DrillState            : DrillState,
  Matched               : Matched,
  MatchedDescendantCount: MatchedDescendantCount,
  LimitedRank           : LimitedRank
};

annotate my.Genres with @(
 readonly,
 cds.search: {name}
);
////////////////////////////////////////////////////////////////////////////
//
//	Genres List
//
annotate my.Genres with @(
    Common.SemanticKey : [name],
    UI : {
        SelectionFields : [name],
        LineItem : [
         { Value : name, Label : '{i18n>Name}' },
        ],
    }
);

////////////////////////////////////////////////////////////////////////////
//
//	Genre Details
//
annotate my.Genres with @(UI : {
  Identification : [{ Value: name}],
  HeaderInfo     : {
    TypeName       : '{i18n>Genre}',
    TypeNamePlural : '{i18n>Genres}',
    Title          : { Value: name },
    Description    : { Value: ID }
  }
});

////////////////////////////////////////////////////////////////////////////
//
//	Genres Elements
//
annotate my.Genres with {
  name @title: '{i18n>Genre}';
}

////////////////////////////////////////////////////////////////////////////
//
//	Authors List
//
annotate my.Authors with @(
  Common.SemanticKey : [ID],
  UI                 : {
    Identification  : [{ Value: name}],
    SelectionFields : [name],
    LineItem        : [
      { Value: ID },
      { Value: dateOfBirth },
      { Value: dateOfDeath },
      { Value: placeOfBirth },
      { Value: placeOfDeath },
    ],
  }
) {
  ID  @Common: {
    SemanticObject : 'Authors',
    Text: name,
    TextArrangement : #TextOnly,
  };
};

////////////////////////////////////////////////////////////////////////////
//
//	Author Details
//
annotate my.Authors with @(UI : {
  HeaderInfo : {
    TypeName       : '{i18n>Author}',
    TypeNamePlural : '{i18n>Authors}',
    Title          : { Value: name },
    Description    : { Value: dateOfBirth }
  },
  Facets     : [{
    $Type  : 'UI.ReferenceFacet',
    Target : 'books/@UI.LineItem'
  }, ],
});


////////////////////////////////////////////////////////////////////////////
//
//	Authors Elements
//
annotate my.Authors with {
  ID           @title: '{i18n>ID}';
  name         @title: '{i18n>Name}';
  dateOfBirth  @title: '{i18n>DateOfBirth}';
  dateOfDeath  @title: '{i18n>DateOfDeath}';
  placeOfBirth @title: '{i18n>PlaceOfBirth}';
  placeOfDeath @title: '{i18n>PlaceOfDeath}';
}

////////////////////////////////////////////////////////////////////////////
//
//	Languages List
//
annotate common.Languages with @(
  Common.SemanticKey : [code],
  Identification     : [{ Value: code}],
  UI                 : {
    SelectionFields : [
      name,
      descr
    ],
    LineItem        : [
      { Value: code },
      { Value: name },
    ],
  }
);

////////////////////////////////////////////////////////////////////////////
//
//	Language Details
//
annotate common.Languages with @(UI : {
  HeaderInfo          : {
    TypeName       : '{i18n>Language}',
    TypeNamePlural : '{i18n>Languages}',
    Title          : { Value: name },
    Description    : { Value: descr }
  },
  Facets              : [{
    $Type  : 'UI.ReferenceFacet',
    Label  : '{i18n>Details}',
    Target : '@UI.FieldGroup#Details'
  }, ],
  FieldGroup #Details : {Data : [
    { Value: code },
    { Value: name },
    { Value: descr }
  ]},
});

////////////////////////////////////////////////////////////////////////////
//
//	Currencies List
//
annotate common.Currencies with @(
  Common.SemanticKey : [code],
  Identification     : [{ Value: code}],
  UI                 : {
    SelectionFields : [
      name,
      descr
    ],
    LineItem        : [
      { Value: descr },
      { Value: symbol },
      { Value: code },
    ],
  }
);

////////////////////////////////////////////////////////////////////////////
//
//	Currency Details
//
annotate common.Currencies with @(UI : {
  HeaderInfo           : {
    TypeName       : '{i18n>Currency}',
    TypeNamePlural : '{i18n>Currencies}',
    Title          : { Value: descr },
    Description    : { Value: code }
  },
  Facets               : [
    {
      $Type  : 'UI.ReferenceFacet',
      Label  : '{i18n>Details}',
      Target : '@UI.FieldGroup#Details'
    },
    {
      $Type  : 'UI.ReferenceFacet',
      Label  : '{i18n>Extended}',
      Target : '@UI.FieldGroup#Extended'
    },
  ],
  FieldGroup #Details  : {Data : [
    { Value: name },
    { Value: symbol },
    { Value: code },
    { Value: descr }
  ]},
  FieldGroup #Extended : {Data : [
    { Value: numcode },
    { Value: minor },
    { Value: exponent }
  ]},
});

////////////////////////////////////////////////////////////////////////////
//
//	Currencies Elements
//
annotate common.Currencies with {
  numcode  @title: '{i18n>NumCode}';
  minor    @title: '{i18n>MinorUnit}';
  exponent @title: '{i18n>Exponent}';
}
