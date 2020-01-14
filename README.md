# cloud-cap-samples

This is a monorepository for sample projects on [SAP Cloud Application Programming Model](https://cap.cloud.sap).

## Description

This repository provides a list of samples and reusable packages created based on SAP Cloud Application Programming Model.
The SAP Cloud Application Programming Model enables you to quickly create business applications by allowing you to focus on your domain logic. It offers a consistent end-to-end programming model that includes languages, libraries and APIs tailored for full-stack development on SAP Cloud Platform.

The samples provided can be run in a local setup on SQLite Database.


## Requirements
* [Node.js](https://nodejs.org/en/) v8 or higher
* [Git](https://git-scm.com)
* [SQLite DB](https://www.sqlite.org/download.html) (Windows only; pre-installed on Mac/Linux)

#### Optional (if you want to import the code into an editor)
* [VS Code](https://code.visualstudio.com)
* [Add CDS extension to VS](https://cap.cloud.sap/docs/get-started/in-vscode#add-cds-editor)

## Download and Installation

#### Install `cds` development kit
```sh
# `@sap`-scoped packages are set via .npmrc
npm install -g @sap/cds-dk
cds  #> test-run it
```
Got issues?  Check out the [documentation](https://cap.cloud.sap/docs/get-started/).

#### Clone and build the application
`git clone https://github.com/SAP-samples/cloud-cap-samples samples && cd samples && npm i`

#### Run the samples

With that you're ready to run the samples, e.g. start the [_bookshop_](./packages/bookshop) sample as follows:

`npm run bookshop`

## Test

For example, try these links in your browser:
- <http://localhost:4004> to test with generic index page.
- <http://localhost:4004/fiori.html> to test with Fiori sandbox.


## Debug

For example, in [VS Code](https://code.visualstudio.com) switch to _Debug_ view and launch one of the prepared _cds run_ launch configurations.


## Limitations

None

## Known Issues

None

## How to obtain support

Check out the documentation on https://cap.cloud.sap.  In case you find a bug, or you need additional support, please open an issue [here](https://github.com/SAP-samples/cloud-cap-samples/issues/new) in GitHub.

## To-Do (upcoming changes)

None

## License

Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under SAP Sample Code License Agreement, except as noted otherwise in the [LICENSE](/LICENSE) file.
