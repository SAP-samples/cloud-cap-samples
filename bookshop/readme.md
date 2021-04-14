# Foreign key constraints on DB

As model we use a simplified version of the bookshop scenario, we work with nodejs runtime.


## Preparation

As we want to see the effects of the database constaints, we first need to switch off the integrity checks done by the node runtime. In the `package.json`:
```json
"cds": {
  ...,
  "features": {
    "assert_integrity": false
  }
}
```

Then switch on constraint generation. In the `package.json`:
```json
"cds": {
  ...,
  "cdsc": {
    "beta": {
      "foreignKeyConstraints": true
    }
  }
}
```

## SQLite

In SQLite, FK constraints can only be specified during the creation of a table. They cannot be altered for an existing table. So here we at least don't have issues with existing data.

For SQLite, constraint checks need to be enabled by application at runtime for each db connection with the command
```sql
PRAGMA foreign_keys = ON;
```
We do this via a custom handler in `admin-service.js`.

Now run the requests in `requests.http` (use `http://localhost:4004` as server URL). They behave as expected.

But the error messages are not providing any details. They say "constraint violation", but they don't say which table/constraint is violated:
```
HTTP/1.1 500 Internal Server Error
...
{
  "error": {
    "code": "SQLITE_CONSTRAINT",
    "message": "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed in: \nCOMMIT"
  }
}
```

The runtime constraint checks do provide the name of the restricting association (but not the name of the entity where the association lives).

## HANA

Preparation:
* logon to cf account (e.g. trial)
* create HANA service instance: `cf create-service hanatrial hdi-shared bookshop-db`

First make the deplyoment without constraints (switch off constraint generation in `package.json`).

* Run `cds build --production`. No constraints are generated.
* Deploy db model: `cf push -f gen/db`
* Deploy nodejs app: `cf push -f gen/srv --random-route`. Take note of the app URL.

Run the requests in `request.http` (use the URL from the previous step as server URL, prepend with `https://`).
Make sure to introduce some data that violates the constraints. No errors are reported - as expected.

Now switch on constraint generation in `package.json`. 

* Run `cds build --production`. The constraints are placed in separate `hdbconstraint` files in `gen\db\src\gen`. They are generated with `VALIDATED ON`.
* Re-deploy db model: `cf push -f gen/db`. It fails, as the existing data violates the constraints.
* Check logs: `cf logs bookshop-db-deployer --recent`.

```
Error: com.sap.hana.di.constraint: Could not create the database object [8250005]
  at "src/gen/sap.capire.bookshop.Books_author.hdbconstraint" (1:1)
 Error: com.sap.hana.di.constraint: Database error 7: : feature not supported: referential constraint violated by existing value [8201003]
   at "src/gen/sap.capire.bookshop.Books_author.hdbconstraint" (1:1)
```
You can see which constraint is violated, but there is no info about the offensive entries.

Now use the requests from `request.http` to fix the entries that have been broken above.

* Re-deploy db model: `cf push -f gen/db`. It should succeed.

Again run the requests from `request.http`. This time all changes that would lead to a
constraint violation fail.

Inserting a book with non-existing author ID or changing a book's author ID to an invalid value yields
the message
```
HTTP/1.1 500 Internal Server Error
...
{
  "error": {
    "code": "500",
    "message": "Internal Server Error"
  }
}
```
When trying to delete a genre that is still referenced in a book we get
```
HTTP/1.1 462 status code 462
...
{
  "error": {
    "code": "462",
    "message": "failed on update or delete by foreign key constraint violation: TrexColumnUpdate failed on table '21F87859727E470E94917B690908A09D:SAP_CAPIRE_BOOKSHOP_GENRES' with error: DELETE on 21F87859727E470E94917B690908A09D:SAP_CAPIRE_BOOKSHOP_GENRES(ID) failed, because 1 rows with corresponding foreign keys still exist in 21F87859727E470E94917B690908A09D:SAP_CAPIRE_BOOKSHOP_BOOKS(GENRE_ID), rc=1536"
  }
}
```

Note: when using `cdsc` to generate the constraints
```
cdsc Q --beta foreignKeyConstraints -d hana -s hdi -o dbstuff db\schema.cds srv\admin-service.cds
```
there will be constraints for e.g. `sap_common_Currencies_texts`. This cannot be deplyoed, as the corresponding table is removed from `cds` via the tree-shaking mechanism. These constraints need to be removed manually before deployment.

## Todo

* Provide a way to control parameters `VALIDATED` and `ENFORCED` of the constraints (only interesting for HANA, as in SQLite changing constraints after table generation is not possible).
* Provide some tool to identify existing entries that violate constraints. We can generate a list of `SELECT` statements that find these entries, but how do we run it and show the results to the user?
* Can runtimes improve the error messages?
