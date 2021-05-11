using from '_base/app/services';
using OrdersService from './extension_service';


// new entity -- draft enabled
annotate OrdersService.Z_Customers with @odata.draft.enabled;

// new entity -- titles
annotate OrdersService.Z_Customers with {
    Z_ID           @(      // workaround
        UI.Hidden,
        Common : {Text : Z_email}
    );
    Z_firstName    @title : 'First Name';
    Z_lastName     @title : 'Last Name';
    Z_email        @title : 'Email';
    Z_creditCardNo @title : 'Credit Card No';
    Z_dateOfBirth  @title : 'Date of Birth';
	Z_status       @title : 'Status';
	Z_creditScore  @title : 'Credit Score';
}

// new entity -- titles
annotate OrdersService.Z_CustomerPostalAddresses with {
    Z_ID          @(       // workaround
        UI.Hidden,
        Common : {Text : Z_description}
    );
    Z_description @title : 'Description';
    Z_street      @title : 'Street';
    Z_town        @title : 'Town';
    Z_country     @title : 'Country';
}


// new entity -- titles
annotate OrdersService.Z_Remarks with {
//  number            @title: 'Remark Number';
	Z_number          @title: 'Remark Number';
	Z_remarksLine     @title: 'Remark';
}


// new entity in service -- UI
annotate OrdersService.Z_Customers with @(UI : {
    HeaderInfo       : {
        TypeName       : 'Customer',
        TypeNamePlural : 'Customers',
        Title          : {
            $Type : 'UI.DataField',
            Value : Z_email
        }
    },
    LineItem         : [
        {Value : Z_firstName},
        {Value : Z_lastName},
        {Value : Z_email},
		{Value : Z_status},
        {Value : Z_creditScore}
    ],
    Facets           : [
		{$Type: 'UI.ReferenceFacet', Label: 'Main', Target : '@UI.FieldGroup#Main'},
		{$Type: 'UI.ReferenceFacet', Label: 'Customer Postal Addresses', Target: 'Z_PostalAddresses/@UI.LineItem'}
	],
    FieldGroup #Main : {Data : [
        {Value : Z_firstName},
        {Value : Z_lastName},
        {Value : Z_email},
		{Value : Z_status},
        {Value : Z_creditScore}
    ]}
} ) ;

// new entity -- UI
annotate OrdersService.Z_CustomerPostalAddresses with @(UI : {
    HeaderInfo       : {
        TypeName       : 'CustomerPostalAddress',
        TypeNamePlural : 'CustomerPostalAddresses',
        Title          : {
            $Type : 'UI.DataField',
            Value : Z_description
        }
    },
    LineItem         : [
        {Value : Z_description},
        {Value : Z_street},
        {Value : Z_town},
		{Value : Z_country_code}
	],
    Facets           : [
		{$Type: 'UI.ReferenceFacet', Label: 'Main', Target : '@UI.FieldGroup#Main'}
	],
    FieldGroup #Main : {Data : [
        {Value : Z_description},
        {Value : Z_street},
        {Value : Z_town},
		{Value : Z_country_code}
    ]}
}, ) {

};



// new entity -- UI
annotate OrdersService.Z_Remarks with @(
	UI: {
		HeaderInfo: {
			TypeName: 'Remark',
			TypeNamePlural: 'Remarks',
			Title          : {
                $Type : 'UI.DataField',
                Value : Z_number
		//		Value : number
            }
		},
		LineItem: [
			{Value: Z_number},
		//	{Value: number},
			{Value: Z_remarksLine}       
		],
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: 'Main',    Target: '@UI.FieldGroup#Main'}
		],
		FieldGroup#Main: {
			Data: [
		        {Value: Z_number},
		//		{Value: number},
			    {Value: Z_remarksLine}       
			]
		}
	},
) {

};


// extend existing entity Orders with new extension fields and new composition

@odata.draft.enabled
annotate OrdersService.Orders with @(
	UI: {
		SelectionFields: [ createdAt, createdBy ],
		LineItem: [
			{Value: OrderNo, Label:'OrderNo'},
		//	{Value: Z_Customer_Z_ID, Label:'Customer'},  // workaround - extension field
			{Value: Z_priority,    Label:'Priority'},    // extension field
			{Value: createdAt,   Label:'Date'}
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
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Created}',  Target: '@UI.FieldGroup#Created'},
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Modified}', Target: '@UI.FieldGroup#Modified'},
		],
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Details}',    Target: '@UI.FieldGroup#Details'},
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>OrderItems}', Target: 'Items/@UI.LineItem'},
			{$Type: 'UI.ReferenceFacet', Label: 'Remarks',           Target: 'Z_Remarks/@UI.LineItem'} // new composition
		],
		FieldGroup#Details: {
			Data: [
				{Value: currency_code, Label:'Currency'},      // correction
			//	{Value: Z_Customer_Z_ID, Label:'Customer'},    // workaround - extension field
				{Value: Z_priority,    Label:'Priority'}       // extension field
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
) 

//{
//	createdAt @UI.HiddenFilter:false;
//	createdBy @UI.HiddenFilter:false;
//}
;



// new field in existing service -- exchange ID with text
 annotate OrdersService.Orders with {
	Z_Customer @(
		Common: {
			//show email, not id for Customer in the context of Orders
			Text: Z_Customer.Z_email  , TextArrangement: #TextOnly,
			ValueList: {
				Label: 'Customers',
				CollectionPath: 'Z_Customers',
				Parameters: [
					{ $Type: 'Common.ValueListParameterInOut',
						LocalDataProperty: Z_Customer_Z_ID,  // workaround
						ValueListProperty: 'Z_ID'            // workaround
					},
					{ $Type: 'Common.ValueListParameterDisplayOnly',
						ValueListProperty: 'Z_email'
					}
				]
			}
		} 
	);
} 



