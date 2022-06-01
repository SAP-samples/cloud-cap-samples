# Welcome to the DB2 CAP SFlight App

This is a sample app for the travel reference scenario, built with the [SAP Cloud Application Programming Model (CAP)](https://cap.cloud.sap) and [SAP Fiori Elements](https://experience.sap.com/fiori-design-web/smart-templates).

The purpose of this sample app is to:
* Demonstrate SAP Fiori annotations
* Demonstrate and compare SAP Fiori features on various stacks (CAP Node.js, CAP Java SDK, ABAP)
* Run UI test suites on various stacks

![Process Travels Page](img.png)

The app still contains some workarounds that are going to be addressed over time.
In some cases, the model and the handlers can be improved or simplified once further planned CAP features become available.
In other cases, the app itself could be improved. For example, calculation of the total price for a travel
currently simply sums up the single prices ignoring the currencies.

![](https://github.com/SAP-samples/cap-sflight/workflows/CI/badge.svg)
[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/cap-sflight)](https://api.reuse.software/info/github.com/SAP-samples/cap-sflight)


## SAP Fiori UI with Node.js Backend

### Build and Run

1. In a console, execute `npm ci` in the root folder of your project.
2. In a console, execute `cds watch` in the root folder of your project.

### Accessing the SAP Fiori App

Open this link in your browser:
http://localhost:4004/travel_processor/webapp/index.html

### Integration Tests

To start OPA tests, open this link in your browser:
http://localhost:4004/travel_processor/webapp/test/integration/Opa.qunit.html

Test documentation is available at:
https://ui5.sap.com/#/api/sap.fe.test
