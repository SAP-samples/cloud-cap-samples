/*
  Common Annotations shared by all apps
*/

using { sap.capire.bookshop as my } from '@capire/bookshop';


////////////////////////////////////////////////////////////////////////////
//
//	Books Lists
//
annotate my.Books with @(
	Common.SemanticKey: [title],
	UI: {
		Identification: [{Value:title}],
	  SelectionFields: [ ID, author_ID, price, currency_code ],
		LineItem: [
			{Value: ID},
			{Value: title},
			{Value: author.name, Label:'{i18n>Author}'},
			{Value: genre.name},
			{Value: stock},
			{Value: price},
			{Value: currency.symbol, Label:' '},
		]
	}
) {
	author @ValueList.entity:'Authors';
};

annotate my.Authors with @(
	UI: {
		Identification: [{Value:name}],
	}
);


////////////////////////////////////////////////////////////////////////////
//
//	Books Details
//
annotate my.Books with @(
	UI: {
  	HeaderInfo: {
  		TypeName: '{i18n>Book}',
  		TypeNamePlural: '{i18n>Books}',
  		Title: {Value: title},
  		Description: {Value: author.name}
  	},
	}
);



////////////////////////////////////////////////////////////////////////////
//
//	Books Elements
//
annotate my.Books with {
	ID @title:'{i18n>ID}' @UI.HiddenFilter;
	title @title:'{i18n>Title}';
	genre  @title:'{i18n>Genre}'  @Common: { Text: genre.name,  TextArrangement: #TextOnly };
	author @title:'{i18n>Author}' @Common: { Text: author.name, TextArrangement: #TextOnly };
	price @title:'{i18n>Price}';
	stock @title:'{i18n>Stock}';
	descr @UI.MultiLineText;
}

annotate my.Genres with {
  name  @title: '{i18n>Genre}';
}

////////////////////////////////////////////////////////////////////////////
//
//	Authors Elements
//
annotate my.Authors with {
	ID @title:'{i18n>ID}' @UI.HiddenFilter;
	name @title:'{i18n>AuthorName}';
}
