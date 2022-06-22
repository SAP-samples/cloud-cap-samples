# ReCAP Keynote 2022

## Streamlined MTX - Multitenancy

Showcased in `bookshop` sample...

#### 1. Run bookshop as usual 

```sh
cds w bookshop
```

#### 2. Switch on multitenancy 

in your [`package.json`](./bookshop/package.json):

```json
  "cds": {
    "requires": {
      "multitenancy": true
    }
  }
```

#### 3. Subscribe tenants 

- e.g. from [test/multitenancy.http](./bookshop/test/multitenancy.http)
- tenants: `t1`, `t2` 

#### 4. Test drive, e.g. ...

1. Open http://localhost:4004/vue in two separate prive browser windows
2. Login as user `me` in the first one, then order 3 from _Wuthering Heights_
3. Login as user `u2` in the second one, then order 5 from _Wuthering Heights_
4. Note the differences in stocks


### w/ MTX Services in Sidecar


#### 1. Add sidecar project in subfolder `mtx/sidecar` 

This minimal plain CAP Node.js, with only a [`package.json`](bookshop/mtx/sidecar/package.json) in it:

```jsonc
{
  "cds": {
    "requires": {
      "deployment-service": "in-sidecar",
      "model-provider": "in-sidecar",
      //...
    }
  }
}
```

... with `db` configured to use shared database from main app:

```json
{
  "cds": {
    "requires": {
      // ...
      "db": {
        "kind": "sqlite", "credentials": {
          "url": "../../sqlite.db"
        }
      }
    }
  }
}
```


#### 2. Configure to use sidecar in [bookshop/package.json](./bookshop/package.json)

```json
  "cds": {
    "requires": {
      "multitenancy": true,
      "model-provider": "from-sidecar",
      "db": "sqlite"
    }
  }
```

#### 3. Run sidecar

```js
cds w bookshop/mtx/sidecar --port 4005
```

#### 4. Run main app

```sh
cds w bookshop --profile with-sidecar
```

5. Redo execises in UI


### Simulate Production

1. Build deployable 
```js
cds build bookshop
```

2. Run sidecar
```js
cds w bookshop/gen/mtx/sidecar --port 4005 --profile prod
```

3. Run main app
```js
cds w bookshop --profile mtx,sidecar
```

4. Redo execises in UI



## Feature Toggles 

1. Start app (before state)
```js
cds w fiori
```

2. Add fts/isbn + fts/reviews → using our new ... operator to extend @UI.LineItems arrays 

3. Switch on Feature Toggles 
* in [fiori/package.json](./fiori/package.json)

4. Login with me / u2

### w/ Model Provider in Sidecar (as for Java) 

1. Add sidecar project -> plain CAP Node.js

2. Configure to use sidecar
* in [fiori/package.json](./fiori/package.json)

3. Run sidecar
```js
cds w fiori/mtx/sidecar --profile prod --port 4005
```

4. Run main app
```js
cds w fiori --profile mtx,sidecar
```

CDS Aspects → Toggled Features → Verticalization → Composition → Customisation 



## CQL Protocol Adapter
