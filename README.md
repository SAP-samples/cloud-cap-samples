# Welcome to cap/samples

Find here a collection of samples for the [SAP Cloud Application Programming Model](https://cap.cloud.sap) organized in a simplistic [monorepo setup](samples.md#all-in-one-monorepo). &rarr; See [**Overview** of contained samples](samples.md)

![](https://github.com/SAP-samples/cloud-cap-samples/workflows/CI/badge.svg)
[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/cloud-cap-samples)](https://api.reuse.software/info/github.com/SAP-samples/cloud-cap-samples)

### Preliminaries

1. Install [**@sap/cds-dk**](https://cap.cloud.sap/docs/get-started/) globally:

   ```sh
   npm i -g @sap/cds-dk
   ```

2. _Optional:_ [Use Visual Studio Code](https://cap.cloud.sap/docs/get-started/tools#vscode)

### Download

If you've [Git](https://git-scm.com/downloads) installed, clone this repo as shown below, otherwise [download as ZIP file](archive/master.zip).

```sh
git clone https://github.com/sap-samples/cloud-cap-samples samples
cd samples
```

### Setup

In the samples folder run:

```sh
npm install
```

### Run

With that you're ready to run the samples, for example:

```sh
cds watch bookshop
```

After that open this link in your browser: [http://localhost:4004](http://localhost:4004)

When asked to log in, type `alice` as user and leave the password field blank, which is the [default user](https://cap.cloud.sap/docs/node.js/authentication#mocked).

### Testing

Run the provided tests with [_jest_](http://jestjs.io) or [_mocha_](http://mochajs.org), for example:

```sh
npx jest
```
> While mocha is a bit smaller and faster, jest runs tests in parallel and isolation, which allows to run all tests.


### Serve `npm`

We've included a simple npm registry mock, which allows you to do an `npm install @capire/<package>` locally. Use it as follows:

1. Start the @capire registry:
```sh
npm run registry
```
> While running this will have `@capire:registry=http://localhost:4444` set with npmrc.

2. Install one of the @capire packages wherever you like, for example:

```sh
npm add @capire/common @capire/bookshop
```


## Code Tours

Take one of the [guided tours](.tours) in VS Code through our CAP samples and learn which CAP features are showcased by the different parts of the repository. Just install the [CodeTour extension](https://marketplace.visualstudio.com/items?itemName=vsls-contrib.codetour) for VS Code. We'll add more code tours in the future. Stay tuned!

## Get Support

Check out the documentation at [https://cap.cloud.sap](https://cap.cloud.sap). <br>
In case you've a question, find a bug, or otherwise need support, use our [community](https://answers.sap.com/tags/9f13aee1-834c-4105-8e43-ee442775e5ce) to get more visibility.


## License

Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE.txt) file.
