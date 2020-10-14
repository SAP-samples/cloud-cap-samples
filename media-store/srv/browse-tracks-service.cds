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
}
