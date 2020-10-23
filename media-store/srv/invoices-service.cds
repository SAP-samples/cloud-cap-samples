using {sap.capire.media.store as my} from '../db/schema';

@(requires : 'authenticated-user')
service Invoices {
    @readonly
    entity Invoices     as projection on my.Invoices;

    action invoice(tracks : array of {
        ID        : Integer;
        unitPrice : Decimal(10, 2);
    });

    @readonly
    entity InvoiceItems as projection on my.InvoiceItems;
}
