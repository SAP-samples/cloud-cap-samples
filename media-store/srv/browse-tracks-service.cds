using {sap.capire.media.store as my} from '../db/schema';

@cds.query.limit : {
    default : 12,
    max     : 100
}
@(requires : ['identified-user'])
service BrowseTracks {
    @readonly
    entity Tracks as projection on my.Tracks;

    @(requires : ['authenticated-user'])
    action getInvoicedTracks() returns array of {
        ID         : Tracks.ID;
        trackName  : Tracks.name;
        genreName  : my.Genres.name;
        composer   : Tracks.composer;
        unitPrice  : Tracks.unitPrice;
        albumTitle : my.Albums.title;
    };

    @readonly
    entity Genres as projection on my.Genres;
}
