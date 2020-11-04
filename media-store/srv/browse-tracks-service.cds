using {sap.capire.media.store as my} from '../db/schema';

service BrowseTracks {
    @readonly
    entity Tracks  as projection on my.Tracks excluding {
        alreadyOrdered
    };

    @readonly
    entity MarkedTracks @(restrict : [
    {
        grant : ['*', ],
        to    : 'customer'
    },
    {
        grant : '*',
        to    : 'employee'
    },
    ])             as projection on my.Tracks;

    /*
    Below entities exposed
    due to 'navigation property errors' when expanding with odata
    */
    @readonly
    entity Genres  as projection on my.Genres {
        * , tracks : redirected to Tracks
    };

    @readonly
    entity Albums  as projection on my.Albums {
        * , tracks : redirected to Tracks
    };

    @readonly
    entity Artists as projection on my.Artists;
}
