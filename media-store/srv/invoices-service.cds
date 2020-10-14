using {sap.capire.media.store as my} from '../db/schema';

@(requires : 'authenticated-user')
service InvoicesService {
    @readonly
    entity Invoices     as projection on my.Invoices actions {
        action invoice();
    }

    @readonly
    entity InvoiceItems as projection on my.InvoiceItems;
}
