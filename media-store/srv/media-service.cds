using {sap.capire.media.store as my} from '../db/schema';

service MediaService {
    entity Employees as projection on my.Employees;
}
