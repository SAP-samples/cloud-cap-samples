

# Welcome to cap/samples

Find here a collection of samples for the [SAP Cloud Application Programming Model](https://cap.cloud.sap) organized in a simplistic [monorepo setup](samples.md#all-in-one-monorepo).

[See **Overview** of contained samples](samples.md):

![](etc/samples.drawio.svg)

![](https://github.com/SAP-samples/cloud-cap-samples/workflows/CI/badge.svg)



### Preliminaries

Ensure you have the latest LTS version of Node.js, [`@sap/cds-dk`](https://www.npmjs.com/package/@sap/cds-dk) installed globally, `git` and your IDE ready (see [Initial Setup](https://cap.cloud.sap/docs/get-started/#setup))

### Download

If you've [Git](https://git-scm.com/downloads) installed, clone this repo as shown below, otherwise [download as ZIP file](archive/main.zip).

```sh
git clone https://github.com/sap-samples/cloud-cap-samples samples
cd samples
```

### Setup

In the samples folder run:

```sh
npm ci
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

## Code Tours

Take one of the [guided tours](.tours) in VS Code through our CAP samples and learn which CAP features are showcased by the different parts of the repository. Just install the [CodeTour extension](https://marketplace.visualstudio.com/items?itemName=vsls-contrib.codetour) for VS Code. We'll add more code tours in the future. Stay tuned!

## Get Support

Check out the documentation at [https://cap.cloud.sap](https://cap.cloud.sap). <br>
In case you've a question, find a bug, or otherwise need support, use our [community](https://answers.sap.com/tags/9f13aee1-834c-4105-8e43-ee442775e5ce) to get more visibility.


## License

Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
