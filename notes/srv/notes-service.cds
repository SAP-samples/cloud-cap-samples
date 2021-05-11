using sap.capire.notes from '../db/data-model';
using { Suppliers as MashupSuppliers } from '../db/mashup';
using { API_BUSINESS_PARTNER as BusinessPartner } from './external/API_BUSINESS_PARTNER.csn';

/**
 * Notes Service
 *
 * Maintain notes for suppliers
 */
service NotesService {
    entity Notes as projection on notes.Notes;
    entity Suppliers as projection on MashupSuppliers;
}