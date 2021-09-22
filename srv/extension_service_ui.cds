using from '_base/app/services';
using OrdersService from './extension_service';


// new entity -- draft enabled
annotate OrdersService.Z_Customers   with @odata.draft.enabled;
// new codelist entity -- draft enabled
annotate OrdersService.Z_SalesRegion with @odata.draft.enabled;


// new entity -- titles
annotate OrdersService.Z_Customers with {
    ID           @(     
        UI.Hidden,
        Common : {Text : email}
    );
    firstName    @title : 'First Name';
    lastName     @title : 'Last Name';
    email        @title : 'Email';
    creditCardNo @title : 'Credit Card No';
    dateOfBirth  @title : 'Date of Birth';
	status       @title : 'Status';
	creditScore  @title : 'Credit Score';
}

// new entity -- titles
annotate OrdersService.Z_CustomerPostalAddresses with {
    ID          @(       
        UI.Hidden,
        Common : {Text : description}
    );
    description @title : 'Description';
    street      @title : 'Street';
    town        @title : 'Town';
    country     @title : 'Country';
}

// new entity -- titles
annotate OrdersService.Z_SalesRegion with {
	regionCode      @title: 'Region Code';
}

// new entity -- titles
annotate OrdersService.Z_Remarks with {
    number          @title: 'Remark Number';
	remarksLine     @title: 'Remark';
}


// new entity in service -- UI
annotate OrdersService.Z_Customers with @(UI : {
    HeaderInfo       : {
        TypeName       : 'Customer',
        TypeNamePlural : 'Customers',
        Title          : {
            $Type : 'UI.DataField',
            Value : email
        }
    },
    LineItem         : [
        {Value : firstName},
        {Value : lastName},
        {Value : email},
		{Value : status},
        {Value : creditScore}
    ],
    Facets           : [
		{$Type: 'UI.ReferenceFacet', Label: 'Main', Target : '@UI.FieldGroup#Main'},
		{$Type: 'UI.ReferenceFacet', Label: 'Customer Postal Addresses', Target: 'PostalAddresses/@UI.LineItem'}
	],
    FieldGroup #Main : {Data : [
        {Value : firstName},
        {Value : lastName},
        {Value : email},
		{Value : status},
        {Value : creditScore}
    ]}
} ) ;

// new entity -- UI
annotate OrdersService.Z_CustomerPostalAddresses with @(UI : {
    HeaderInfo       : {
        TypeName       : 'CustomerPostalAddress',
        TypeNamePlural : 'CustomerPostalAddresses',
        Title          : {
            $Type : 'UI.DataField',
            Value : description
        }
    },
    LineItem         : [
        {Value : description},
        {Value : street},
        {Value : town},
		{Value : country_code}
	],
    Facets           : [
		{$Type: 'UI.ReferenceFacet', Label: 'Main', Target : '@UI.FieldGroup#Main'}
	],
    FieldGroup #Main : {Data : [
        {Value : description},
        {Value : street},
        {Value : town},
		{Value : country_code}
    ]}
}, ) {

};

// new entity -- UI
annotate OrdersService.Z_SalesRegion with @(
	UI: {
		HeaderInfo: {
			TypeName: 'Sales Region',
			TypeNamePlural: 'Sales Regions',
			Title          : {
                $Type : 'UI.DataField',
                Value : regionCode
            }
		},
		LineItem: [
			{Value: regionCode},   
            {Value: name}, 
            {Value: descr}   
		],
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: 'Main',    Target: '@UI.FieldGroup#Main'}
		],
		FieldGroup#Main: {
			Data: [
		        {Value: regionCode},   
				{Value: name}, 
                {Value: descr}     
			]
		}
	},
) {

};


// new entity -- UI
annotate OrdersService.Z_Remarks with @(
	UI: {
		HeaderInfo: {
			TypeName: 'Remark',
			TypeNamePlural: 'Remarks',
			Title          : {
                $Type : 'UI.DataField',
				Value : number
            }
		},
		LineItem: [
			{Value: number},
			{Value: remarksLine}       
		],
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: 'Main',    Target: '@UI.FieldGroup#Main'}
		],
		FieldGroup#Main: {
			Data: [
		        {Value: number},
			    {Value: remarksLine}       
			]
		}
	},
) {

};

// extend existing entity Orders with new extension fields and new composition

annotate OrdersService.Orders with @(
	UI: {
		LineItem: [...,			
			{Value: Z_Customer_ID,            Label:'Customer'},          // extension field
			{Value: Z_SalesRegion_regionCode, Label:'Sales Region'},      // extension field
			{Value: Z_priority,               Label:'Priority'},          // extension field		
		],
		Facets: [...,
			{$Type: 'UI.ReferenceFacet', Label: 'Remarks', Target: 'Z_Remarks/@UI.LineItem'} // new composition		
		],
		FieldGroup#Details: {
			Data: [...,         
				{Value: Z_Customer_ID,            Label:'Customer'},      // extension field
				{Value: Z_SalesRegion_regionCode, Label:'Sales Region'},  // extension field
				{Value: Z_priority,               Label:'Priority'}       // extension field
			]
		}	
	}
);

// new field in existing service -- exchange ID with text
 annotate OrdersService.Orders with {
	Z_Customer @(
		Common: {
			//show email, not id for Customer in the context of Orders
			Text: Z_Customer.email  , TextArrangement: #TextOnly,
			ValueList: {
				Label: 'Customers',
				CollectionPath: 'Z_Customers',
				Parameters: [
					{ $Type: 'Common.ValueListParameterInOut',
						LocalDataProperty: Z_Customer_ID,  
						ValueListProperty: 'ID'            
					},
					{ $Type: 'Common.ValueListParameterDisplayOnly',
						ValueListProperty: 'email'
					}
				]
			}
		} 
	);
} 

