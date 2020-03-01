// Proxy for importing services from bookshop sample
using from '@capire/bookshop/srv/admin-service';
using from '@capire/bookshop/srv/cat-service';

annotate AdminService with @impl:'srv/admin-service.js';
