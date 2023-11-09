# Bookshop Getting Started Sample

This stand-alone sample introduces the essential tasks in the development of CAP-based services as also covered in the [Getting Started guide in capire](https://cap.cloud.sap/docs/get-started/in-a-nutshell).

## Hypothetical Use Cases

1. Build a service that allows to browse _Books_ and _Authors_.
2. Books have assigned _Genres_, which are organized hierarchically.
3. All users may browse books without login.
4. All entries are maintained by Administrators.
5. End users may order books (the actual order mgmt being out of scope).

## Running the Sample

```sh
npm run watch
```

## Content & Best Practices

| Links to capire                                                                                           | Sample files / folders               |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [Project Setup & Layouts](https://cap.cloud.sap/docs/get-started/jumpstart#project-structure)             | [`./`](./)                           |
| [Domain Modeling with CDS](https://cap.cloud.sap/docs/guides/domain-modeling)                               | [`./db/schema.cds`](./db/schema.cds) |
| [Defining Services](https://cap.cloud.sap/docs/guides/providing-services#modeling-services)               | [`./srv/*.cds`](./srv)               |
| [Single-purposed Services](https://cap.cloud.sap/docs/guides/providing-services#single-purposed-services) | [`./srv/*.cds`](./srv)               |
| [Providing & Consuming Providers](https://cap.cloud.sap/docs/guides/providing-services)                   | http://localhost:4004                |
| [Using Databases](https://cap.cloud.sap/docs/guides/databases)                                            | [`./db/data/*.csv`](./db/data)       |
| [Adding Custom Logic](https://cap.cloud.sap/docs/guides/providing-services#adding-custom-logic)           | [`./srv/*.js`](./srv)                |
| Adding Tests                                                                                              | [`./test`](./test)                   |
| [Sharing for Reuse](https://cap.cloud.sap/docs/guides/extensibility/composition)                          | [`./index.cds`](./index.cds)         |
