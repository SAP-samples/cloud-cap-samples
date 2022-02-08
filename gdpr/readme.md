# how-to

## required services and subscriptions

services:
- Audit Log Service
- SAP HANA Cloud
- SAP HANA Schemas & HDI Containers
- Application Logging Service
- Personal Data Manager
- Authorization and Trust Management Service

subscriptions:
- Audit Log Viewer Service
- Personal Data Manager

## deploy

after adding the necessary entitlements, do:
- `cf l` to log into the respective account
- `cd gdpr` (if still in root of `cloud-cap-samples`)
- `npm run deploy`, which executes build and deployment via `.etc/deploy.sh`

## authorization

create roles for Audit Log Viewer Service and Personal Data Manager, and assign the roles to the respective users

# open issues

- deploy via mta, which can bind with parameters, and get rid of scripts in `.etc`
- use approuter to remove hacky custom auth impl (`srv/auth.js`)
- clarify annotation `EntitySemantics`, which differs between audit logging (`Other`) and personal data manager (`LegalGround`)
- annotations for order items Fiori preview app
  + `Products` has `@cds.persistence.skip:'always'`
- how to reuse intial data from `common`?
