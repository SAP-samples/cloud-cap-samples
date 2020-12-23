using CatalogService from '@capire/bookshop';

////////////////////////////////////////////////////////////////////////////
//
//	Books Object Page
//
annotate CatalogService.Books with @(
	UI: {
  	HeaderInfo: {
			TypeName: 'Book',
			TypeNamePlural: 'Books',
  		Description: {Value: author}
  	},
		HeaderFacets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Description}', Target: '@UI.FieldGroup#Descr'},
		],
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Details}', Target: '@UI.FieldGroup#Price'},
		],
		FieldGroup#Descr: {
			Data: [
				{Value: descr},
			]
		},
		FieldGroup#Price: {
			Data: [
				{Value: price},
				{Value: currency.symbol, Label: '{i18n>Currency}'},
			]
		},
	}
);


////////////////////////////////////////////////////////////////////////////
//
//	Books Object Page
//
annotate CatalogService.Books with @(
	UI: {
	  SelectionFields: [ ID, price, currency_code ],
		LineItem: [
			{Value: title},
			{Value: author, Label:'{i18n>Author}'},
			{Value: genre.name},
			{Value: price},
			{Value: currency.symbol, Label:' '},
		]
	},
);
