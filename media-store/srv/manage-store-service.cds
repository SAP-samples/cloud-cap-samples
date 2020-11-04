using {sap.capire.media.store as my} from '../db/schema';

service ManageStore @(requires : 'employee') {
    entity Tracks     as projection on my.Tracks;
    entity Albums     as projection on my.Albums;
    entity Artists    as projection on my.Artists;
    /*
    Below entities exposed
    due to errors when creating Tracks/Albums/Artists
    */
    entity MediaTypes as projection on my.MediaTypes;
    entity Genres     as projection on my.Genres;
}
