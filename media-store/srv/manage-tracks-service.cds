using {sap.capire.media.store as my} from '../db/schema';

@(requires : 'authenticated-user')
service ManageTracks {
    @(restrict : [{
        grant : [
            'READ',
            'WRITE'
        ],
        to    : 'employee'
    }, ])
    entity Genres as projection on my.Genres;
}
