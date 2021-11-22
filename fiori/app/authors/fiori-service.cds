using CatalogService from '@capire/bookshop';

////////////////////////////////////////////////////////////////////////////
//
//	Authors Object Page
//
annotate CatalogService.Authors with @(UI : {
    HeaderInfo        : {
        TypeName       : 'Author',
        TypeNamePlural : 'Authors',
        Description    : {Value : name}
    },
    HeaderFacets      : [{
        $Type  : 'UI.ReferenceFacet',
        Label  : '{i18n>Description}',
        Target : '@UI.FieldGroup#Descr'
    }, ],
    Facets            : [{
        $Type  : 'UI.ReferenceFacet',
        Label  : '{i18n>Details}',
        Target : 'books/@UI.LineItem'
    }, ],
    FieldGroup #Descr : {Data : [
        {Value : name},
        {Value : dateOfBirth},
        {Value : dateOfDeath},
        {Value : placeOfBirth},
        {Value : placeOfDeath},
    ]},
});