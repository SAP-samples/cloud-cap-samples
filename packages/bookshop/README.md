# Bookshop With Address Data From SAP S/4HANA

This is an extended bookshop with business-partner address data from SAP S/4HANA.
When the user creates an order and uses the value help of the shipping address,
a synchronous request to SAP S/4HANA is triggered yielding all possible addresses
belonging to this business partner. Once an address is selected, its data
is replicated into a local database. To keep data in sync, an event handler
is registered which listens to all changes of business partners and updates the 
local database table.


## Running With Mocks
Just execute the following command in the `bookshop` folder.
```
cds run --in-memory --with-mocks
```



## Running With an S/4HANA Backend

To run your app in non-mock mode you need an SAP S/4HANA Cloud system and connect it to your SAP Cloud Platform. You can use the
[SAP Cloud Platform Extension Factory](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/346864df64f24011b49abee07bbd79af.html) to automate parts of this task. You need to enable synchronous APIs as well as events that are sent whenever business partners are changed.

To run the app locally, you need to create a `default-env.json` file in the `bookshop` folder containing the binding information (credentials of Enterprise Messaging as well as the destination to the business-partner service).

Provide the credentials in the `cds.requires` section of the `package.json` file in the `bookshop` folder, e.g.

```json
  "cds": {
    "requires": {
      "API_BUSINESS_PARTNER": {
        "kind": "odata",
        "model": "srv/external",
        "credentials": {
          "destination": "cap-api098"
        }
      },
      "messaging": {
        "kind": "enterprise-messaging",
        "credentials": {
          "prefix": "sap/S4HANAOD/c098/BO"
        }
      }
    }
  }
```

Here, `destination` is the destination of your business-partner service and `prefix` is the prefix
of the topic of the events.

Then simply run the following command in the `bookshop` folder.
```
cds run --in-memory
```

## User Flow
After starting the app, go to http://localhost:4004/fiori.html#Shell-home and open the app `Manage Orders` to create an order.
Use the value help of the shipping address to select an address. Create an order item and save the order.
Then change the address of your business partner (in the mocked case you can trigger the PATCH request in `req.http` ). Refresh
the object page of your order and see the change.
