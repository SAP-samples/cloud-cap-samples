// Proxy for importing services from bookshop sample
using from '@capire/bookshop/srv/admin-service';
annotate AdminService with @impl:'srv/admin-service.js';
