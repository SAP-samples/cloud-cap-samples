////////////////////////////////////////////////////////////////////////////
//
//	Note: this is designed for the GDPRService being co-located with
//	orders. It does not work if GDPRService is run as a separate
// 	process, and is not intended to do so.
//
////////////////////////////////////////////////////////////////////////////


using {GDPRService} from '../srv/gdpr-service';

annotate cds.UUID with @Core.Computed;

/*
 * Orders
 */
@odata.draft.enabled
annotate GDPRService.Orders with @(UI : {
  SelectionFields      : [
    createdAt,
    createdBy
  ],
  LineItem             : [
    {
      Value : OrderNo,
      Label : 'Order number'
    },
    {
      Value : customer.firstName,
      Label : 'First Name'
    },
    {
      Value : customer.lastName,
      Label : 'Last Name'
    }
  ],
  HeaderInfo           : {
    TypeName       : 'Order',
    TypeNamePlural : 'Orders',
    Title          : {
      Value : OrderNo,
      Label : 'Order number'
    }
  },
  Identification       : [
    {
      Value : createdBy,
      Label : 'Created by'
    },
    {
      Value : createdAt,
      Label : 'Created at'
    }
  ],
  HeaderFacets         : [
    {
      $Type  : 'UI.ReferenceFacet',
      Label  : '{i18n>Created}',
      Target : '@UI.FieldGroup#Created'
    },
    {
      $Type  : 'UI.ReferenceFacet',
      Label  : '{i18n>Modified}',
      Target : '@UI.FieldGroup#Modified'
    },
  ],
  Facets               : [
    {
      $Type  : 'UI.ReferenceFacet',
      Label  : '{i18n>Details}',
      Target : '@UI.FieldGroup#Details'
    },
    {
      $Type  : 'UI.ReferenceFacet',
      Label  : '{i18n>OrderItems}',
      Target : 'Items/@UI.LineItem'
    },
  ],
  FieldGroup #Details  : {Data : [
    {
      Value : customer_ID,
      Label : 'Customer'
    },
    {
      Value : customer.firstName,
      Label : 'First Name'
    },
    {
      Value : customer.lastName,
      Label : 'Last Name'
    },
    {
      Value : currency_code,
      Label : 'Currency'
    }
  ]},
  FieldGroup #Created  : {Data : [
    {
      Value : createdBy,
      Label : 'Created by'
    },
    {
      Value : createdAt,
      Label : 'Created at'
    }
  ]},
  FieldGroup #Modified : {Data : [
    {
      Value : modifiedBy,
      Label : 'Modified by'
    },
    {
      Value : modifiedAt,
      Label : 'Modified at'
    }
  ]},
}, ) {
  createdAt @UI.HiddenFilter  : false;
  createdBy @UI.HiddenFilter  : false;
  customer  @ValueList.entity : 'Customers';
};

/*
 * TODO: Order Items are not really maintainable in Fiori preview app
 */
annotate GDPRService.Orders.Items with @(UI : {
  LineItem       : [
    {
      Value : product_ID,
      Label : 'Product ID'
    },
    {
      Value : title,
      Label : 'Product Name'
    },
    {
      Value : price,
      Label : 'Price'
    },
    {
      Value : quantity,
      Label : 'Quantity'
    },
  ],
  Identification : [
    {
      Value : product_ID,
      Label : 'Product ID'
    },
    {
      Value : title,
      Label : 'Product Name'
    },
    {
      Value : quantity,
      Label : 'Quantity'
    },
    {
      Value : price,
      Label : 'Price'
    },
  ],
  Facets         : [{
    $Type  : 'UI.ReferenceFacet',
    Label  : 'Order Items',
    Target : '@UI.Identification'
  }, ],
}, ) {
  ID       @Core.Computed  @UI.Hidden : true;
  title    @Core.Computed;
  price    @Core.Computed;
  quantity @(Common.FieldControl : #Mandatory);
};

/*
 * Customers
 */
@odata.draft.enabled
annotate GDPRService.Customers with @(UI : {
  SelectionFields      : [
    firstName,
    lastName
  ],
  LineItem             : [
    {
      Value : firstName,
      Label : 'First Name'
    },
    {
      Value : lastName,
      Label : 'Last Name'
    },
    {
      Value : dateOfBirth,
      Label : 'Date of Birth'
    }
  ],
  HeaderInfo           : {
    TypeName       : 'Customer',
    TypeNamePlural : 'Customers',
    Title          : {
      Value : lastName,
      Label : 'Last Name'
    },
    Description    : {
      Value : firstName,
      Label : 'First Name'
    }
  },
  Identification       : [
    {
      Value : createdBy,
      Label : 'Created by'
    },
    {
      Value : createdAt,
      Label : 'Created at'
    }
  ],
  HeaderFacets         : [
    {
      $Type  : 'UI.ReferenceFacet',
      Label  : '{i18n>Created}',
      Target : '@UI.FieldGroup#Created'
    },
    {
      $Type  : 'UI.ReferenceFacet',
      Label  : '{i18n>Modified}',
      Target : '@UI.FieldGroup#Modified'
    },
  ],
  Facets               : [
    {
      $Type  : 'UI.ReferenceFacet',
      Label  : '{i18n>Details}',
      Target : '@UI.FieldGroup#Details'
    },
    {
      $Type  : 'UI.ReferenceFacet',
      Label  : '{i18n>Addresses}',
      Target : 'addresses/@UI.LineItem'
    },
  ],
  FieldGroup #Details  : {Data : [
    {
      Value : dateOfBirth,
      Label : 'Date of Birth'
    },
    {
      Value : email,
      Label : 'E-Mail'
    },
    {
      Value : creditCardNo,
      Label : 'Credit Card Number'
    }
  ]},
  FieldGroup #Created  : {Data : [
    {
      Value : createdBy,
      Label : 'Created by'
    },
    {
      Value : createdAt,
      Label : 'Created at'
    }
  ]},
  FieldGroup #Modified : {Data : [
    {
      Value : modifiedBy,
      Label : 'Modified by'
    },
    {
      Value : modifiedAt,
      Label : 'Modified at'
    }
  ]},
}, ) {
  createdAt @UI.HiddenFilter : false;
  createdBy @UI.HiddenFilter : false;
};

annotate GDPRService.CustomerPostalAddresses with @(UI : {
  LineItem       : [
    {
      Value : town,
      Label : 'Town'
    },
    {
      Value : street,
      Label : 'Street'
    },
    {
      Value : country.name,
      Label : 'Country'
    }
  ],
  Identification : [
    {
      Value : town,
      Label : 'Town'
    },
    {
      Value : street,
      Label : 'Street'
    },
    {
      Value : country_code,
      Label : 'Country Code'
    }
  ],
  Facets         : [{
    $Type  : 'UI.ReferenceFacet',
    Label  : 'Customer Postal Address',
    Target : '@UI.Identification'
  }, ],
}, );
