using { AdminService } from '../../../srv/admin-service';
annotate AdminService with @requires: false;
extend AdminService.Authors with columns {
  null as books // to simulate the exclusion of books
}
