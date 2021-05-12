using from '_base/app/services';
using OrdersService from './extension_service';


// new entity -- draft enabled
annotate OrdersService.Z_NewEntity   with @odata.draft.enabled;
// new codelist entity -- draft enabled
annotate OrdersService.Z_SalesRegion with @odata.draft.enabled;


// new entity -- titles
annotate OrdersService.Z_NewEntity with {
    description   @title : 'Description';
    integerField  @title : 'Integer Field Title';
    dateField     @title : 'Date Field Title';
    stringField   @title : 'String Field Title';
    enumField     @title : 'Enum Field Title';
    rangeField    @title : 'Range Field Title';
}

// new entity -- titles
annotate OrdersService.Z_NewCodeList with {
	code          @title: 'Code Title';
}

// new entity -- titles
annotate OrdersService.Z_NewCompEntity with {
    description   @title : 'Description';
    integerField  @title : 'Integer Field Title';
    dateField     @title : 'Date Field Title';
    stringField   @title : 'String Field Title';
}


// new entity in service -- UI
annotate OrdersService.Z_NewEntity with @(UI : {
    HeaderInfo       : {
        TypeName       : 'New Entity',
        TypeNamePlural : 'New Entities',
        Title          : {
            $Type : 'UI.DataField',
            Value : description
        }
    },
    LineItem         : [
        {Value : description},
        {Value : dateField },
        {Value : integerField },
        {Value : stringField},
		{Value : enumField},
        {Value : rangeField}
    ],
    Facets           : [
		{$Type: 'UI.ReferenceFacet', Label: 'Main', Target : '@UI.FieldGroup#Main'}
	],
    FieldGroup #Main : {Data : [
        {Value : description},
        {Value : dateField },
        {Value : integerField },
        {Value : stringField},
		{Value : enumField},
        {Value : rangeField}
    ]}
} ) ;


// new entity -- UI
annotate OrdersService.Z_NewCodeList with @(
	UI: {
		HeaderInfo: {
			TypeName: 'New Code',
			TypeNamePlural: 'New Codes',
			Title          : {
                $Type : 'UI.DataField',
                Value : code
            }
		},
		LineItem: [
			{Value: code}      
		],
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: 'Main',    Target: '@UI.FieldGroup#Main'}
		],
		FieldGroup#Main: {
			Data: [
		        {Value: code}     
			]
		}
	},
) {

};


// new entity -- UI
annotate OrdersService.Z_NewCompEntity with @(
	UI: {
		HeaderInfo: {
			TypeName: 'New Composition',
			TypeNamePlural: 'New Compositions',
			Title          : {
                $Type : 'UI.DataField',
                Value : description
            }
		},
		LineItem: [
			{Value : description},
            {Value : dateField },
            {Value : integerField },
            {Value : stringField}    
		],
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: 'Main',    Target: '@UI.FieldGroup#Main'}
		],
		FieldGroup#Main: {
			Data: [
		    {Value : description},
            {Value : dateField },
            {Value : integerField },
            {Value : stringField}        
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
			{Value: OrderNo,             Label:'OrderNo'},
			{Value: Z_newField,          Label:'New Field'},        // extension field
			{Value: Z_NewAssociation_ID, Label:'New Association'},  // extension field
			{Value: Z_NewCodeList_code,  Label:'New Code'},         // extension field
			{Value: createdAt,           Label:'Date'}
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
			{$Type: 'UI.ReferenceFacet', Label: 'New Composition',   Target: 'Z_NewComposition/@UI.LineItem'} // new composition
		],
		FieldGroup#Details: {
			Data: [
				{Value: currency_code, Label:'Currency'},                  // correction
				{Value: Z_newField,          Label:'New Field'},        // extension field
			    {Value: Z_NewAssociation_ID, Label:'New Association'},  // extension field
			    {Value: Z_NewCodeList_code,  Label:'New Code'},         // extension field
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
) ;


