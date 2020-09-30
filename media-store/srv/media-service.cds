using { sap.capire.media.store as my } from '../db/schema';

service MediaService {
    entity Employees as projection on my.Employees;
    entity Customers as projection on my.Customers;
    entity Albums        as projection on my.Albums;
    entity Artists       as projection on my.Artists;
    entity Genres        as projection on my.Genres;
    entity InvoiceItems  as projection on my.InvoiceItems;
    entity Invoices      as projection on my.Invoices;
    entity MediaTypes    as projection on my.MediaTypes;
    entity PlaylistTrack as projection on my.PlaylistTrack;
    entity Playlists     as projection on my.Playlists;
    entity Tracks        as projection on my.Tracks;
}
