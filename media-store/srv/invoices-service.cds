using {sap.capire.media.store as my} from '../db/schema';

@(requires : 'authenticated-user')
service BrowseInvoices {

    @readonly
    entity Invoices as projection on my.Invoices;

    @readonly
    entity Tracks   as projection on my.Tracks;

    action invoice(tracks : array of {
        ID        : Integer;
        unitPrice : Decimal(10, 2);
    });

    action cancelInvoice(ID : Integer);
}
