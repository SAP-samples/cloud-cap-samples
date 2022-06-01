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

## Deploy to AWS

 1. Login to AWS EC2 Console and create a [security group](https://us-west-2.console.aws.amazon.com/ec2/v2/home?region=us-west-2#CreateSecurityGroup:) called cap-samples
Allow access to the following ports:
    * 22 (SSH)
    * 80 (HTTP)
    * 81 (nginx)
    * 389 (LDAP)
    * 443 (HTTPS)
    * 50000 (DB2)

 2. Create AWS Secrets in [IAM](https://us-east-1.console.aws.amazon.com/iam/home)

 3. Set your credentials as [environment variables](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html). You can also set them for your [codespaces](https://github.com/settings/codespaces)

 4. Create a [key pair](https://us-west-2.console.aws.amazon.com/ec2/v2/home?region=us-west-2#KeyPairs:) called cap-samples

 5. Set the private key of your key pair in Github as Codespace secret ID_RSA

 6. Open repository in codespace

 7. Set your values inside `ansible/external_vars.yml`

 8. Run in terminal `npm run ansible:create` to create and configure a new ec2 instance

 9. Create an Elastic IP and allocate it to the newly create EC instance

 10. Register a new domain with the hoster of your choice and create the following subdomains. Set for the main and the subdomains an A record with the IP of your server
    - cockpit.db2-cap-samples.de
    - login.db2-cap-samples.de
    - auth.db2-cap-samples.de
    - proxy.db2-cap-samples.de
    - webhook.db2-cap-samples.de

 11. Login to [nginx proxy](http://ec2-52-41-239-91.us-west-2.compute.amazonaws.com:81/login) and add new proxy hosts
    - Initial user: admin@example.com
    - Initial password: changeme
    - login.db2-cap-samples.de Port: 4443
    - auth.db2-cap-samples.de  Port: 4444
    - db2-cap-samples.de Port: 4004
    - webhook.db2-cap-samples.de Port: 9000
    - proxy.db2-cap-samples.de Port: 81
    - cockpit.db2-cap-samples.de Port: 9090

 12. Set a new Github Action secret `DEPLOY_WEBHOOK_URL`: https://webhook.db2-cap-samples/hooks/redeployment?secret=fancySecret
 13. Create a new Github Action secret `PAT` with your Personal Access Token
 14. Create a new [deploy key](https://github.com/QuadriO/db2-cap-samples/settings/keys) and set the private key as `COMMIT_KEY`
