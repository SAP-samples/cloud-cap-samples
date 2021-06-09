using {sap.capire.media.store as my} from '../db/schema';
using {BrowseTracks.Tracks} from './browse-tracks-service';


service BrowseInvoices @(requires : 'customer') {
    /**
     * Invoices entity also restricted programmatically Only owned
     * invoices youser can access
     */
    @readonly
    entity Invoices as projection on my.Invoices;

    action invoice(tracks : array of {
        ID : Integer;
    });

    action cancelInvoice(ID : Integer);

    /**
     * Below entities exposed due to 'navigation property errors'
     * when expanding with odata
     */
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
