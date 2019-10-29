# Common Contacts Sample

This sample provides a reuse package with common domain models and services for contacts-related data.

## Usage


#### Import to your project

    npm install @sap/capire-contacts

> e.g. see: [bookstore](../bookstore/package.json)

#### Reusing aspects

Define own entities derived from the pre-defined aspects as in [_bookstore_](../bookstore/db/schema.cds):

```swift
using { sap.capire.contacts.Person } from '@sap/capire-contacts';
entity Authors : contacts.Person { ... }
```

> **Note:** All entities in this package are annotated with _`@cds.persistence.skip`:'if-unused'_, so they will be ignored if not referred to from other entities in your models.


#### Reusing entities

Reuse the entities as in this example from [_users-service_](../users-service/srv/services.cds):
```swift
using { sap.capire.contacts.Contacts } from '@sap/capire-contacts';
service UsersService @(requires:'authenticated-user') {
  entity MyProfile as select from Contacts where ID=$user;
  ...
}
```


#### Reusing code lists

Reuse the code lists as in [_./tests/index.cds_](./tests/index.cds):

```swift
service Sue { ...
  // expose Countries to activate provided code lists
    @readonly entity Countries as projection on sap.capire.contacts.Countries;
}
```



#### Reuse code list service

```js
const { intercept } = require ('@sap/capire-contacts/srv/code-lists')
```



## Content



## Concepts

* [Reuse of packages](https://cap.cloud.sap/docs/get-started/projects#reuse)
* Code Lists, `@sap/cds/common` and `@cds.persistence.skip`: 'if-unused'
* Using `aspects` vs `entities`
