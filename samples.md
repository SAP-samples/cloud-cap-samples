# Overview of Samples

The following list gives an overview of the samples provided in subdirectories.
Each sub directory essentially is an individual npm package arranged in an [all-in-one monorepo](all-in-one-monorepo) umbrella setup.


## [@capire/hello-world](hello)

- A simplistic [Hello World](https://cap.cloud.sap/docs/get-started/hello-world) service using [CDS](https://cap.cloud.sap/docs/cds/) and [cds.services](https://cap.cloud.sap/docs/node.js/api#services-api).


## [@capire/bookshop](bookshop)

- [Getting Started](https://cap.cloud.sap/docs/get-started/in-a-nutshell) with CAP, briefly introducing:
- [Project Setup](https://cap.cloud.sap/docs/get-started/) and [Layouts](https://cap.cloud.sap/docs/get-started/projects)
- [Domain Modeling](https://cap.cloud.sap/docs/guides/domain-models)
- [Defining Services](https://cap.cloud.sap/docs/guides/providing-services)
- [Generic Providers](https://cap.cloud.sap/docs/guides/generic-providers)
- [Adding Custom Logic](https://cap.cloud.sap/docs/guides/service-impl)
- [Using Databases](https://cap.cloud.sap/docs/guides/databases)


## [@capire/common](common)

- Showcases how to extend [@sap/cds/common](https://cap.cloud.sap/docs/cds/common) thereby covering:
- Building [extension packages](https://cap.cloud.sap/docs/guides/domain-models#aspects-extensibility)
- Providing [reuse packages](https://cap.cloud.sap/docs/get-started/projects#sharing-and-reusing-content)
- [Verticalization](https://cap.cloud.sap/docs/cds/common#adapting-to-your-needs)
- Using [Aspects](https://cap.cloud.sap/docs/cds/cdl#aspects)
- Used in the [fiori app sample](#fiori)


## [@capire/orders](orders)

- A standalone orders management service, demonstrating:
- Using [Compositions](https://cap.cloud.sap/docs/cds/cdl#compositions) in [Domain Models](https://cap.cloud.sap/docs/guides/domain-models), along with
- [Serving deeply nested documents](https://cap.cloud.sap/docs/guides/generic-providers#serving-structured-data)


## [@capire/reviews](reviews)

- Shows how to implement a modular service to manage product reviews, including:
- Consuming other services synchronously and asynchronously
- Serving requests synchronously
- Emitting events asynchronously
- Grow as you go, with:
- Mocking app services
- Running service meshes
- Late-cut Micro Services
- As well as managed data, input validations, and authorization

## [@capire/suppliers](suppliers)

- Shows how to integrate remote services, in this case the BusinessPartner service from S/4.
- Extending [@capire/bookshop](bookshop) with suppliers from S/4
- Providing that as a pre-built integration & extension package
- Used in [@capire/fiori](fiori)


## [@capire/fiori](fiori)

- A [composite app, reusing and combining](https://cap.cloud.sap/docs/guides/verticalize) these packages:
  - [@capire/bookshop](bookshop)
  - [@capire/common](common)
  - [@capire/orders](orders)
  - [@capire/reviews](reviews)
  - [@capire/suppliers](suppliers)
- [Adds a SAP Fiori elements application](https://cap.cloud.sap/docs/guides/fiori/) to bookshop, thereby introducing to:
  - [OData Annotations](https://cap.cloud.sap/docs/guides/fiori#adding-odata-annotations) in `.cds` files
  - Support for [Fiori Draft](https://cap.cloud.sap/docs/guides/fiori#draft)
  - Support for [Value Helps](https://cap.cloud.sap/docs/guides/fiori#value-help)
  - Serving SAP Fiori apps locally
- [The Vue.js app](bookshop/app/vue) imported from bookshop is served as well


<br>

# All-in-one Monorepo

Each sample sub directory essentially is a standard npm package, some with standard npm dependencies to other samples. The root folder's [package.json](package.json) has local links to the sub folders, such that an `npm install` populates a local `node_modules` folder acts like a local npm registry to the individual sample packages.
