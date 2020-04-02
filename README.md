# Welcome to SAP Cloud Application Programming model samples

Find here the samples for the openSAP course [Building Applications with the SAP Cloud Application Programming Model](https://open.sap.com/courses/cp7).

## Notes on the Demo in Week 4 Unit 4
To add all pipeline specific file to your project, run the following command:

```sh
cds add pipeline
```

Details on how to start your Jenkins in your own environment can be found in the [Operations Guide](https://github.com/SAP/devops-docker-cx-server/blob/master/docs/operations/cx-server-operations-guide.md).

Please note that other than shown in the video Jenkins now is secured by default with an admin user and password.
After you have started Jenkins with the command `cx-server start`, you can get the initial password by running `./cx-server initial-credentials`.

## Get Access to SAP Business Application Studio
The recommended environment for the course is SAP Business Application Studio.  Watch [unit 2 of week 1](https://open.sap.com/courses/cp7/items/51pzQUzbXHr2kdbOmVs6jI) for how to get access.

## Setup

In SAP Business Application Studio, open a terminal.
Then clone the repo with this specific branch:

```sh
git clone https://github.com/sap-samples/cloud-cap-samples -b openSAP-week4-unit4
cd cloud-cap-samples
```

In the `cloud-cap-samples` folder run:
```sh
npm install
```

## Run

Now you're ready to run the samples, for example:
```sh
cds watch
```

After that, watch out for the little popup in the lower right corner of SAP Business Application Studio that asks you to open the application in your browser.


## Get Support

Check out the cap docs at https://cap.cloud.sap. <br>
In case you find a bug or need support, please [open an issue in here](https://github.com/SAP-samples/cloud-cap-samples/issues/new).


## License

Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under SAP Sample Code License Agreement, except as noted otherwise in the [LICENSE](/LICENSE) file.
