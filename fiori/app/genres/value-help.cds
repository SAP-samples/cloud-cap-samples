// Value help with Tree View
using from '../admin-books/fiori-service';
annotate AdminService.Books:genre with @Common.ValueList.PresentationVariantQualifier: 'VH';
annotate AdminService.Genres with @UI.PresentationVariant #VH: {
  RecursiveHierarchyQualifier : 'GenresHierarchy',
};
