# cloud-cap-samples

This is a monorepository for sample projects on [SAP Cloud Application Programming Model](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/00823f91779d4d42aa29a498e0535cdf.html?q=cloud%20application%20programming%20model).

## Description

This repository provides a list of samples and reusable packages created based on SAP Cloud Application Programming Model.
The SAP Cloud Application Programming Model enables you to quickly create business applications by allowing you to focus on your domain logic. It offers a consistent end-to-end programming model that includes languages, libraries and APIs tailored for full-stack development on SAP Cloud Platform.

The samples provided can be run in a local setup on SQLite Database. 

#### Samples:
* [bookstore](./packages/bookstore) - A variant of the bookshop application, built in a modular fashion on top of products-service and common reuse packages.
* [products-service](./packages/products-service) - A reuse package providing domain models and services to manage product catalogs.

## Requirements
* [Node.js](https://nodejs.org/en/) v8 or higher
* [Git](https://git-scm.com) 
* [SQLite DB](https://www.sqlite.org/download.html) (Windows only; pre-installed on Mac/Linux)

#### Optional (if you want to import the code into an editor)
* [VS Code](https://code.visualstudio.com) 
* [Add CDS extension to VS](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/be944d6d51f343f6b3f53c29c44ff00a.html)

## Download and Installation

#### Clone and build the application
`git clone https://github.com/SAP-samples/cloud-cap-samples.git`

`cd samples`

`npm install`

#### Run the samples

`npm run <sample name>`

eg: `npm run bookshop`

#### Test the application

Open these links in your browser:

* <http://localhost:4004/fiori.html> &ndash; Fiori Launchpad sandbox
* <http://localhost:4004/> &ndash; generic index page

## Limitations

None

## Known Issues

None 

## How to obtain support

In case you find a bug, or you need additional support, please open an issue [here](https://github.wdf.sap.corp/staging-for-SAP-samples-public/cloud-cap-samples/issues) in GitHub.

## To-Do (upcoming changes)

None

## License

Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under SAP Sample Code License Agreement, except as noted otherwise in the [LICENSE](/LICENSE) file.

