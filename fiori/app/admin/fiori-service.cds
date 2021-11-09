using { AdminService } from '../../db/schema';
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

annotate AdminService.Authors with @(
	UI: {
		HeaderInfo: {
			Description: {Value: lifetime}
		},
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Details}', Target: '@UI.FieldGroup#Details'},
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Books}', Target: 'books/@UI.LineItem'},
		],
		FieldGroup#Details: {
			Data: [
				{Value: placeOfBirth},
				{Value: placeOfDeath},
				{Value: dateOfBirth},
				{Value: dateOfDeath},
				{Value: age, Label: '{i18n>Age}'},
			]
		},
	}
);



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

// Add Value Help for Locales
annotate AdminService.Books.texts {
	locale @ValueList:{entity:'Languages'};
	locale @Common.ValueListWithFixedValues:true; //show as drop down, not a dialog
	locale @Common.ValueListForValidation:''; // validate against this list
}
// In addition we need to expose Languages through AdminService as a target for ValueList
using { sap } from '@sap/cds/common';
extend service AdminService {
	@readonly entity Languages as projection on sap.common.Languages;
}
