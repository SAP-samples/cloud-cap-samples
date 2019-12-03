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
					{ $Type: 'Common.ValueListParameterOut', LocalDataProperty: 'shippingAddress_AddressID', ValueListProperty: 'AddressID'},
					{ $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'PostalCode'},
					{ $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'CityName'},
					{ $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'StreetName'},
					{ $Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'HouseNumber'},
				]
			}
		}
	);
}


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
			{Value: createdBy, Label:'Customer'},
			{Value: createdAt, Label:'Date'},
			{Value: OrderNo },
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
		// TODO: Trigger side effects when `shippingAddress_AddressID` is changed
		FieldGroup#ShippingAddress: {
			Data: [
				{Value: shippingAddress_AddressID, Label:'{i18n>ShippingAddress}'},
				{Value: shippingAddress.HouseNumber, Label:'{i18n>HouseNumber}'},
				{Value: shippingAddress.StreetName, Label:'{i18n>StreetName}'},
				{Value: shippingAddress.CityName, Labe:'{i18n>CityName}'},
				{Value: shippingAddress.PostalCode, Label:'{i18n>PostalCode}'},
			]
		},
	},
  Common.SideEffects : {
    EffectTypes      : #ValueChange,
    SourceProperties : [shippingAddress_AddressID],
    TargetProperties : [
      shippingAddress.HouseNumber,
      shippingAddress.StreetName,
      shippingAddress.CityName,
			shippingAddress.PostalCode
    ]
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