using sap.capire.officesupplies from '../db/schema';

service CatalogService {
    entity Products as projection on officesupplies.Products;
    entity Suppliers as projection on officesupplies.Suppliers;
};

annotate CatalogService.Products with @(
    UI: {
      HeaderInfo: {
        TypeName: '{i18n>Cat.TypeName}',
        TypeNamePlural: '{i18n>Cat.TypeNamePlural}',
        Title: { $Type: 'UI.DataField', Value: title }
      },    
      SelectionFields: [ identifier, title, availability, price],      
      LineItem: [
        {$Type: 'UI.DataField', Value: image_url},
        {$Type: 'UI.DataField', Value: identifier},
        {$Type: 'UI.DataField', Value: title},
        {$Type: 'UI.DataField', Value: availability},
        {$Type: 'UI.DataField', Value: price}
      ],
      HeaderFacets: [       
        {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#ProductDetail', Label:'{i18n>Cat.HeaderFacetDetails}' },
        {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#SupplierDetail', Label:'{i18n>Cat.HeaderFacetSupplier}' },
        {$Type: 'UI.ReferenceFacet', Target: '@UI.DataPoint#Price'}
      ],
      Facets: [
        {
          $Type: 'UI.CollectionFacet',
          Label: '{i18n>Cat.FacetProductInformation}',
          Facets: [
            {$Type: 'UI.ReferenceFacet', Target: '@UI.FieldGroup#Description', Label: '{i18n>Cat.FacetSectionDescription}'},
          ]
        }
      ],
      DataPoint#Price: {Value: price, Title: '{i18n>Cat.HeaderPrice}'},
      FieldGroup#Description: {
        Data:[
            {$Type: 'UI.DataField', Value: description}
        ]
      },          
      FieldGroup#ProductDetail: {
        Data:[
          {$Type: 'UI.DataField', Value: identifier},
          {$Type: 'UI.DataField', Value: availability}
        ]
      },
      FieldGroup#SupplierDetail: {
        Data:[
          {$Type: 'UI.DataField', Value: supplier.identifier},
          {$Type: 'UI.DataField', Value: supplier.postCode},
          {$Type: 'UI.DataField', Value: supplier.phone}
        ]
      }
    }
);

annotate CatalogService.Products with {
  ID @( Common: { Label: '{i18n>Cat.ProductID}'} );
  availability @( Common.Label: '{i18n>Cat.ProductStock}' );
  price @( Common.Label: '{i18n>Cat.ProductPrice}', Measures.ISOCurrency: currency_code );
  description @( Common.Label: '{i18n>Cat.ProductDescr}' );
  image_url @( Common.Label: '{i18n>Cat.ProductImage}', UI.IsImageURL: true);
}

annotate CatalogService.Suppliers with {
  identifier @( Common : { Label: '{i18n>Cat.SuppliersIdentifier}', Text: name,  TextArrangement: #TextFirst } );
  postCode @( Common : { Label: '{i18n>Cat.SuppliersPostCode}', Text: city, TextArrangement: #TextFirst } );
  phone @Common.Label: '{i18n>Cat.SuppliersPhone}';
}