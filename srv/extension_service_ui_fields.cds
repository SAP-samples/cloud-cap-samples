using from '_base/app/services';
using OrdersService from './extension_service';


// extend existing entity Orders with new extension fields and new composition

@odata.draft.enabled
annotate OrdersService.Orders with @(UI : {
  LineItem            : [
    {
      Value : OrderNo,
      Label : 'OrderNo'
    },
    {
      Value : Z_orderInfo,
      Label : 'Additional Information'
    }, // extension field
    {
      Value : Z_internalNo,
      Label : 'Internal Order Number'
    }, // extension field
    {
      Value : Z_expectedDelivery,
      Label : 'Expecxted Delivery Date'
    }, // extension field
    {
      Value : Z_priority,
      Label : 'Priority'
    }, // extension field
    {
      Value : Z_discount,
      Label : 'Discount'
    }, // extension field
    {
      Value : createdAt,
      Label : 'Date'
    },
  ],
  FieldGroup #Details : {Data : [
    {
      Value : currency_code,
      Label : 'Currency'
    },
    {
      Value : Z_orderInfo,
      Label : 'Additional Information'
    }, // extension field
    {
      Value : Z_internalNo,
      Label : 'Internal Order Number'
    }, // extension field
    {
      Value : Z_expectedDelivery,
      Label : 'Expected Delivery Date'
    }, // extension field
    {
      Value : Z_priority,
      Label : 'Priority'
    }, // extension field
    {
      Value : Z_discount,
      Label : 'Discount'
    }, // extension field
  ]},
})

{
  createdAt @UI.HiddenFilter : false;
  createdBy @UI.HiddenFilter : false;
};
