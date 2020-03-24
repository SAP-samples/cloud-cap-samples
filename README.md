# Welcome to SAP Cloud Application Programming model samples

Find here the samples for the openSAP course [Building Applications with the SAP Cloud Application Programming Model](https://open.sap.com/courses/cp7).

## Get Access to SAP Business Application Studio
The recommended environment for the course is SAP Business Application Studio.  Watch [unit 2 of week 1](https://open.sap.com/courses/cp7/items/51pzQUzbXHr2kdbOmVs6jI) for how to get access.

## Setup

In SAP Business Application Studio, open a terminal.
Then clone the repo with this specific branch:

```sh
git clone https://github.com/sap-samples/cloud-cap-samples -b OpenSAP-week3-unit5
cd cloud-cap-samples
```

In the `cloud-cap-samples` folder run:
```sh
npm install
```

## Run

Now you're ready to run the samples, for example:
```sh
cd packages/bookshop
cds deploy
cds watch
```

After that, watch out for the little popup in the lower right corner of SAP Business Application Studio that asks you to open the application in your browser.

## Hints
- If your demo user logon window does not show up:  clear the browsers login data
- If your port is still in use run in your terminal:
```
> pkill node      //kill running node process
```

## Deploy to Cloud Foundry

Clean-up the CF space in your trial account if you already used it before. Make sure that there are no services or applications deployed.

Generation of the xs-security.json
```sh
cds compile srv/ --to xsuaa > xs-security.json 
```

In this unit we use  [MTA](https://sap.github.io/cloud-mta-build-tool/) to do the deployment to CF
```sh
npm install -g mbt
```
You can generate the MTA.yaml from CDS and do manual modifications or simply use the already generated and adapted  mta.yaml in the branch and directly generate the .mtar file



### BEGIN OPTIONAL PART

If you do not want to generate the MTA.YAML yourself please do the following:

- Generate the mta.yaml with the HANA dependency
```sh
cds add hana --force
cds add mta
```

- Add the path to the generated xs-security.json in the MTA.YAML
```
    parameters:
         path: ./xs-security.json
         service:xsuaa
         service-plan: application
         ....
```
- Add the application block in the MTA.YAML
```
     ##############    APP   #########################
     - name: capire-bookshop-app
       type: nodejs
       path: gen/app
       parameters:
          memory: 256M
       build-parameters:
         requires:
           - name: capire-bookshop-srv
       requires:
        - name: capire-bookshop-uaa
        - name: srv-binding
          group: destinations
          properties:
             forwardAuthToken: true
             name: srv-binding
             url: ~{srv-url}
```
- Make sure to use service hanatrial instead of hana in the MTA.YAML
```
   parameters:
     service: hanatrial
```
### END OPTIONAL PART

Generate the .mtar file for the deployment and deploy to cloud foundry:
```sh
mbt build -t ./
cf login -a https://api.cf.eu10.hana.ondemand.com
cf deploy sap.capire-bookshop_1.0.0.mtar
```

## Get Support

Check out the cap docs at https://cap.cloud.sap. <br>
In case you find a bug or need support, please [open an issue in here](https://github.com/SAP-samples/cloud-cap-samples/issues/new).


## License

Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under SAP Sample Code License Agreement, except as noted otherwise in the [LICENSE](/LICENSE) file.
