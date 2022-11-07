

////////////////////////////////////////////////////////////////////////////
//
//	Note: this is designed for the OrdersService being co-located with
//	bookshop. It does not work if OrdersService is run as a separate
// 	process, and is not intended to do so.
//
////////////////////////////////////////////////////////////////////////////



using { OrdersService } from '../srv/orders-service';


@odata.draft.enabled
annotate OrdersService.Orders with @(
	UI: {
		SelectionFields: [ createdBy ],
		LineItem: [
			{Value: OrderNo, Label:'OrderNo'},
			{Value: buyer, Label:'Customer'},
			{Value: currency.symbol, Label:'Currency'},
			{Value: createdAt, Label:'Date'},
		],
		HeaderInfo: {
			TypeName: 'Order', TypeNamePlural: 'Orders',
			Title: {
				Label: 'Order number ', //A label is possible but it is not considered on the ObjectPage yet
				Value: OrderNo
			},
			Description: {Value: createdBy}
		},
		Identification: [ //Is the main field group
			{Value: createdBy, Label:'Customer'},
			{Value: createdAt, Label:'Date'},
			{Value: OrderNo },
		],
		HeaderFacets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Created}', Target: '@UI.FieldGroup#Created'},
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Modified}', Target: '@UI.FieldGroup#Modified'},
		],
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Details}', Target: '@UI.FieldGroup#Details'},
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>OrderItems}', Target: 'Items/@UI.LineItem'},
		],
		FieldGroup#Details: {
			Data: [
				{Value: currency.code, Label:'Currency'}
			]
		},
		FieldGroup#Created: {
			Data: [
				{Value: createdBy},
				{Value: createdAt},
			]
		},
		FieldGroup#Modified: {
			Data: [
				{Value: modifiedBy},
				{Value: modifiedAt},
			]
		},
	},
) {
	createdAt @UI.HiddenFilter:false;
	createdBy @UI.HiddenFilter:false;
};



annotate OrdersService.Orders.Items with @(
	UI: {
		LineItem: [
			{Value: product_ID, Label:'Product ID'},
			{Value: title, Label:'Product Title'},
			{Value: price, Label:'Unit Price'},
			{Value: quantity, Label:'Quantity'},
		],
		Identification: [ //Is the main field group
			{Value: quantity, Label:'Quantity'},
			{Value: title, Label:'Product'},
			{Value: price, Label:'Unit Price'},
		],
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>OrderItems}', Target: '@UI.Identification'},
		],
	},
) {
	quantity @(
		Common.FieldControl: #Mandatory
	);
};
