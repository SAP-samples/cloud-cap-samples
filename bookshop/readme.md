# Bookshop Getting Started Sample

This sample introduces the essential tasks in the development of CAP-based services as also covered in the [Getting Started guide in capire](https://cap.cloud.sap/docs/get-started/in-a-nutshell).

## Hypothetical Use Cases

1. Build a service that allows to browse _Books_ and _Authors_.
2. Books have assigned _Genres_ which are organized hierarchically.
3. All users may browse books without login.
4. All entries are maintained by Administrators.
5. End users may order books (the actual order mgmt being out of scope)

## Running the Sample

```sh
npm run watch
```

## Content & Best Practices

| Links to capire                                                                                           | Sample files / folders               |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [Project Setup and Layouts](https://cap.cloud.sap/docs/get-started/projects#sharing-and-reusing-content)  | [`./`](./)                           |
| [Defining Domain Models](https://cap.cloud.sap/docs/guides/domain-models)                                 | [`./db/schema.cds`](./db/schema.cds) |
| [Defining Services](https://cap.cloud.sap/docs/guides/providing-services)                                 | [`./srv/*.cds`](./srv)               |
| [Single-purposed Services](https://cap.cloud.sap/docs/guides/providing-services#single-purposed-services) | [`./srv/*.cds`](./srv)               |
| [Generic Providers](https://cap.cloud.sap/docs/guides/generic-providers)                                  | http://localhost:4004                |
| [Using Databases](https://cap.cloud.sap/docs/guides/databases)                                            | [`./db/data/*.csv`](./db/data)       |
| [Adding Custom Logic](https://cap.cloud.sap/docs/guides/service-impl)                                     | [`./srv/*.js`](./srv)                |
| [Adding Tests](https://cap.cloud.sap/docs/guides/testing)                                                 | [`./test`](./test)                   |
| [Sharing for Reuse](https://cap.cloud.sap/docs/get-started/projects#sharing-and-reusing-content)          | [`./index.cds`](./index.cds)         |
