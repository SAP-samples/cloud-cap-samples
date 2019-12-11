using AdminService from '../../srv/admin-service';

annotate AdminService.Books with {
	price @Common.FieldControl: #ReadOnly;
}
////////////////////////////////////////////////////////////////////////////
//
//	Common
//
annotate AdminService.OrderItems with {
	book @(
		Common: {
			Text: book.title,
			FieldControl: #Mandatory
		},
		ValueList.entity:'Books',
	);
	amount @(
		Common.FieldControl: #Mandatory
	);
}

annotate AdminService.Orders with {
	shippingAddress @(
		Common: {
			FieldControl: #Mandatory,
			ValueList: { 
				CollectionPath: 'Addresses',
				Label: 'Addresses',
				SearchSupported: 'true',
				Parameters: [
					{ $Type: 'Common.ValueListParameterOut', LocalDataProperty: 'shippingAddress_addressID', ValueListProperty: 'addressID'},
					{ $Type: 'Common.ValueListParameterOut', LocalDataProperty: 'shippingAddress_businessPartner', ValueListProperty: 'businessPartner'},
					{ $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'postalCode'},
					{ $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'cityName'},
					{ $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'country'},
					{ $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'streetName'},
					{ $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'houseNumber'},
				]
			},
			SideEffects : {
    		EffectTypes      : #ValueChange,
    		SourceProperties : [shippingAddress_addressID],
    		TargetProperties : [
				shippingAddress.country,
				shippingAddress.houseNumber,
				shippingAddress.streetName,
				shippingAddress.cityName,
				shippingAddress.postalCode
    		]
  		}
		}
	);
}

////////////////////////////////////////////////////////////////////////////
//
//	UI
//
annotate AdminService.Orders with @(
	UI: {
		////////////////////////////////////////////////////////////////////////////
		//
		//	Lists of Orders
		//
		SelectionFields: [ createdAt, createdBy ],
		LineItem: [
			{Value: createdBy, Label:'Customer'},
			{Value: createdAt, Label:'Date'}
		],
		////////////////////////////////////////////////////////////////////////////
		//
		//	Order Details
		//
		HeaderInfo: {
			TypeName: 'Order', TypeNamePlural: 'Orders',
			Title: {
				Label: 'Order number ', //A label is possible but it is not considered on the ObjectPage yet
				Value: OrderNo
			},
			Description: {Value: createdBy}
		},
		Identification: [ //Is the main field group
			// labels not considered
			{Value: createdBy, Label:'Customer'},
			{Value: createdAt, Label:'Date'},
			{Value: OrderNo },
			{Value: 'shippingAddress', Label: 'Address ID'}
		],
		HeaderFacets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Created}', Target: '@UI.FieldGroup#Created'},
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Modified}', Target: '@UI.FieldGroup#Modified'},
		],
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>ShippingAddress}', Target: '@UI.FieldGroup#ShippingAddress'},
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Details}', Target: '@UI.FieldGroup#Details'},
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>OrderItems}', Target: 'Items/@UI.LineItem'},
		],
		FieldGroup#Details: {
			Data: [
				{Value: currency_code, Label:'Currency'}
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
		FieldGroup#ShippingAddress: {
			Data: [
				{Value: shippingAddress_addressID, Label:'{i18n>shippingAddress}'},
				{Value: shippingAddress.houseNumber, Label:'{i18n>houseNumber}'},
				{Value: shippingAddress.streetName, Label:'{i18n>streetName}'},
				{Value: shippingAddress.cityName, Label:'{i18n>cityName}'},
				{Value: shippingAddress.postalCode, Label:'{i18n>postalCode}'},
			]
		},
	},
) {
	createdAt @UI.HiddenFilter:false;
	createdBy @UI.HiddenFilter:false;
};

//The enity types name is AdminService.my_bookshop_OrderItems
//The annotations below are not generated in edmx WHY?
annotate AdminService.OrderItems with @(
	UI: {
		HeaderInfo: {
			TypeName: 'Order Item', TypeNamePlural: '	',
			Title: {
				Value: book.title
			},
			Description: {Value: book.descr}
		},
		// There is no filterbar for items so the selctionfileds is not needed
		SelectionFields: [ book_ID ],
		////////////////////////////////////////////////////////////////////////////
		//
		//	Lists of OrderItems
		//
		LineItem: [
			{Value: book_ID, Label:'Book'},
			//The following entry is only used to have the assoication followed in the read event
			{Value: book.price, Label:'Book Price'},
			{Value: amount, Label:'Quantity'},
		],
		Identification: [ //Is the main field group
			//{Value: ID, Label:'ID'}, //A guid shouldn't be on the UI
			{Value: book_ID, Label:'Book'},
			{Value: amount, Label:'Amount'},
		],
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>OrderItems}', Target: '@UI.Identification'},
		],
	},
);