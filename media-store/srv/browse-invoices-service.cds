using {sap.capire.media.store as my} from '../db/schema';
using {BrowseTracks.Tracks} from './browse-tracks-service';

@(requires : 'customer')
service BrowseInvoices {
    @readonly
    entity Invoices as projection on my.Invoices;

    action invoice(tracks : array of {
        ID        : Integer;
        unitPrice : Decimal(10, 2);
    });

    action cancelInvoice(ID : Integer);

    @readonly
    entity Tracks   as projection on my.Tracks excluding {
        alreadyOrdered
    };

    @readonly
    entity Genres   as projection on my.Genres {
        * , tracks : redirected to Tracks
    };

    @readonly
    entity Albums   as projection on my.Albums {
        * , tracks : redirected to Tracks
    };

    @readonly
    entity Artists  as projection on my.Artists;
}
