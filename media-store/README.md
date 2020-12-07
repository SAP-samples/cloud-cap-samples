# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

| File or Folder | Purpose                              |
| -------------- | ------------------------------------ |
| `app/`         | will contain compiled front bundles  |
| `app-src/`     | contains frontend app on react       |
| `deployers/`   | contains deployment staff            |
| `db/`          | your domain models and data go here  |
| `srv/`         | your service models and code go here |
| `test/`        | your services tests                  |
| `package.json` | project metadata and configuration   |
| `mta.yaml`     | deployment config                    |
| `readme.md`    | this getting started guide           |
| `server.js`    | initial server set up                |

## Development

- At first open a new terminal and run below command. It should create new sqlite source and fill initial data from `db/data`. You can browse database in any sqlite client

```json
npm run deploy
```

- Next, start cds service on 4004 port in watch mode:

```json
cds watch
```

- Open `app-src` folder and run next commands. This will install dependencies and run frontend src files watcher. When you will change src files your bundles in app directory will re-compiled. Now you can enjoy development:

```json
npm install
npm run watch
```

> For better frontend development experience use below command instead of watcher. This will start frontend dev server on 3000 port. Now your bundles will be hot reloaded, this means you do not need reload the page to see changes:
>
> ```json
> npm run start
> ```

## Deployment

- Make sure you already have hanatrial instance in your cockpit dashboard (SAP Cloud Platform).
  Or if you are using hana instance - change it in mta.yaml config file from hanatrial to hana
- Change package.json db section

```json
  "db": {
    "kind": "hana"
  }
```

- Authenticate in the Cloud Foundry:

```json
cf login
```

- Open `app-src` folder and run the following commands. This will create frontend production bundles in app subfolder:

```json
npm install
npm run build
```

- Clean up deployers/html5Deployer/resources folder from the previous frontend build

- From root directory run:

```json
mbt build -t ./
cf deploy media-store_1.0.0.mtar
```

- Now your services should be deployed with hanatrial instance and filled with initial data

## Learn More

- [Learn more about CAP](https://cap.cloud.sap/docs/get-started/)
- [Deploying to Cloud Foundry](https://cap.cloud.sap/docs/advanced/deploy-to-cloud)
