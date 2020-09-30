# Welcome to cap/samples

Find here a collection of samples for the [SAP Cloud Application Programming Model](https://cap.cloud.sap) organized in a simplistic [monorepo setup](samples.md#all-in-one-monorepo). &rarr; See [**Overview** of contained samples](samples.md)

![](https://github.com/SAP-samples/cloud-cap-samples/workflows/CI/badge.svg)

### Preliminaries

1. [Install @sap/cds-dk](https://cap.cloud.sap/docs/get-started/) as documented in [capire](https://cap.cloud.sap)
2. _Optional:_ [Use Visual Studio Code](https://cap.cloud.sap/docs/get-started/in-vscode)


### Download

Clone this repo as shown below, if you have [git](https://git-scm.com/downloads) installed,
otherwise [download as zip file](archive/master.zip).

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

### Testing

Run the provided tests with [_jest_](http://jestjs.io) or [_mocha_](http://mochajs.org), for example:
```sh
npx jest
```
> While mocha is a bit smaller and faster, jest runs tests in parallel and isolation, which allows to run all tests.


## Get Support

Check out the documentation at [https://cap.cloud.sap](https://cap.cloud.sap). <br>
In case you have a question, find a bug, or otherwise need support, please use our [community](https://answers.sap.com/tags/9f13aee1-834c-4105-8e43-ee442775e5ce).


## License

Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.
