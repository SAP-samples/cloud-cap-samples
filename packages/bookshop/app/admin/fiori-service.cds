using AdminService from '../../srv/admin-service';

////////////////////////////////////////////////////////////////////////////
//
//	Books Object Page
//

annotate sap.capire.bookshop.Books with @odata.draft.enabled;

@odata.draft.enabled
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



////////////////////////////////////////////////////////////
//
//  Draft for Localized Data
//

// using sap.capire.bookshop.Books as Books;

// context sap.capire.bookshop.texts {

//   extend Books with {
//     localized: Association to Books_texts on localized.ID = $self.ID and localized.locale = $user.locale;
//     texts: Composition of many Books_texts on texts.ID = ID;
//   }

//   // _texts entity as generated today
//   entity Books_texts {
//     // key ID: UUID;
//     // key locale : String(5);
//     title : String(111);
//     descr : String(1111);
//   }

//   // Enhancements required for Fiori Draft
//   @assert.unique.locales: [ ID, locale ]
//   extend Books_texts with {
//     key ID_texts: UUID;
//     /* key */ ID: UUID;
//     /* key */ locale : String(5);
//   }

// }

// BUG in compiler? -> neither of which works
// entity ![localized].sap.capire.bookshop.Books as select from Books { *,
// entity _localized.sap.capire.bookshop.Books as select from Books { *,
// entity localized.sap.capire.bookshop.Books as select from Books { *,
//   coalesce(localized.title, title) as title,
//   coalesce(localized.descr, descr) as descr,
// };


annotate AdminService.Books_texts with @(
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
using { sap.common } from '@sap/cds/common';

extend service AdminService {
	entity Languages as projection on common.Languages;
}
annotate AdminService.Books_texts {
	locale @ValueList:{entity:'Languages',type:#fixed}
}
