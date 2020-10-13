using {sap.capire.media.store as my} from '../db/schema';

@(requires : ['identified-user'])
service BrowseTracks {
    @readonly
    entity Tracks as projection on my.Tracks;

    @readonly
    entity Genres as projection on my.Genres;
}
