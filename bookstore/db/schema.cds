using { sap.capire.bookshop } from '@capire/bookshop';

// Forward-declare calculated fields to be filled in database-specific ways
// TODO find a better way to have 'default' fields that still can be overwritten.
extend bookshop.Authors with {
	virtual age: Integer;
	virtual lifetime: String;
}
