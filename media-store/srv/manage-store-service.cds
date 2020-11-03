using {sap.capire.media.store as my} from '../db/schema';

@(requires : 'employee')
service ManageStore {
    entity Tracks as projection on my.Tracks;
    action addTrack(name : String(25), albumTitle : String(255), genreName : String(255), composer : String(255));
    entity Albums as projection on my.Albums;
    entity Genres as projection on my.Genres;
}
