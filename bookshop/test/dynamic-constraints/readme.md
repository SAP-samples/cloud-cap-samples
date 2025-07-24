## Experimental Dynamic Constraints

This example demonstrates how to use dynamic constraints in a CAP application. It includes a service definition and a test setup to validate the constraints.


### Prerequisites

You've setup the [_cap/samples_](https://github.com/sap-samples/cloud-cap-samples) like so:

```sh
git clone -q https://github.com/sap-samples/cloud-cap-samples cap/samples
cd cap/samples
npm install
```

### Testing

Test like that in `cds.repl` from _cap/samples_ root:

```sh
cds repl --run bookshop/test/dynamic-constraints
````

```javascript
await AdminService.create ('Books', {})
await AdminService.create ('Books', { title:'   ', author_ID:150 })
await AdminService.create ('Books', { title:'x' })
await cds.validate (Books.constraints, 201)
await cds.validate (Books.constraints)
```
