using { AdminService } from '@capire/bookstore';
using from '../common'; // to help UI linter get the complete annotations



////////////////////////////////////////////////////////////////////////////
//
//	Books Object Page
//

annotate AdminService.Books with @(
	UI: {
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>General}', Target: '@UI.FieldGroup#General'},
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Translations}', Target:  'texts/@UI.LineItem'},
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Details}', Target: '@UI.FieldGroup#Details'},
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Admin}', Target: '@UI.FieldGroup#Admin'},
		],
		FieldGroup#General: {
			Data: [
				{Value: title},
				{Value: author_ID},
				{Value: genre_ID},
				{Value: descr},
			]
		},
		FieldGroup#Details: {
			Data: [
				{Value: stock},
				{Value: price},
				{Value: currency_code, Label: '{i18n>Currency}'},
			]
		},
		FieldGroup#Admin: {
			Data: [
				{Value: createdBy},
				{Value: createdAt},
				{Value: modifiedBy},
				{Value: modifiedAt}
			]
		}
	}
);

////////////////////////////////////////////////////////////////////////////
//
//	Value Help for Tree Table
//
annotate AdminService.Books with {
    genre @(Common: {
        Label    : 'Genre',
        ValueList: {
            CollectionPath              : 'Genres',
            Parameters                  : [
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'name',
            },
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: genre_ID,
                ValueListProperty: 'ID',
            }
            ],
            PresentationVariantQualifier: 'VH',
        }
    });
}

annotate AdminService.Genres with @UI: {
    PresentationVariant #VH: {
        $Type                      : 'UI.PresentationVariantType',
        Visualizations             : ['@UI.LineItem'],
        RecursiveHierarchyQualifier: 'GenreHierarchy'
    },
    LineItem               : [{
        $Type: 'UI.DataField',
        Value: name,
        Label :'{i18n>Name}'
    }],
};

// Hide ID because of the ValueHelp
annotate AdminService.Genres with {
  ID @UI.Hidden;
};

////////////////////////////////////////////////////////////
//
//  Draft for Localized Data
//

annotate sap.capire.bookshop.Books with @fiori.draft.enabled;
annotate AdminService.Books with @odata.draft.enabled;

annotate AdminService.Books.texts with @(
	UI: {
		Identification: [{Value:title}],
		SelectionFields: [ locale, title ],
		LineItem: [
			{Value: locale, Label: 'Locale'},
			{Value: title, Label: 'Title'},
			{Value: descr, Label: 'Description'},
		]
	}
);

annotate AdminService.Books.texts with {
    ID       @UI.Hidden;
    ID_texts @UI.Hidden;
};

// Add Value Help for Locales
annotate AdminService.Books.texts {
	locale @(
		ValueList.entity:'Languages', Common.ValueListWithFixedValues, //show as drop down, not a dialog
	)
}
// In addition we need to expose Languages through AdminService as a target for ValueList
using { sap } from '@sap/cds/common';
extend service AdminService {
	@readonly entity Languages as projection on sap.common.Languages;
}

// Workaround for Fiori popup for asking user to enter a new UUID on Create
annotate AdminService.Books with { ID @Core.Computed; }

