using { sap.capire.bookshop as my } from '../db/schema';
service AdminService @(requires:'admin') {
  entity Books as projection on my.Books;
  entity Authors as projection on my.Authors;
}

//Since ID is computed, we can hide the popup for ID on Create
annotate AdminService.Books with {
	ID @Core.Computed;
}

annotate AdminService.Authors with {
	ID @Core.Computed;
}