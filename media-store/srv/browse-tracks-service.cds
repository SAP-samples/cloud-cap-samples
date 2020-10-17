using {sap.capire.media.store as my} from '../db/schema';

service BrowseTracks {
    @readonly
    entity Tracks       as projection on my.Tracks excluding {
        alreadyOrdered
    };

    @(requires : 'authenticated-user')
    @readonly
    entity MarkedTracks as projection on my.Tracks;

    @readonly
    entity Genres       as projection on my.Genres {
        * , tracks : redirected to Tracks
    };

    @readonly
    entity Albums       as projection on my.Albums {
        * , tracks : redirected to Tracks
    };

    @readonly
    entity Artists      as projection on my.Artists;
}
