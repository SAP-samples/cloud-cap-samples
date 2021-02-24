// Forward-declare calculated fields to be filled in database-specific ways
// TODO find a better way to have 'default' fields that still can be overwritten.
using { sap.capire.bookshop } from '@capire/bookshop';
extend bookshop.Authors with {
	virtual age: Integer;
	virtual lifetime: String;
}
