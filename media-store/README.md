# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

| File or Folder | Purpose                              |
| -------------- | ------------------------------------ |
| `app/`         | Contains frontend app on react       |
| `db/`          | your domain models and data go here  |
| `srv/`         | your service models and code go here |
| `package.json` | project metadata and configuration   |
| `readme.md`    | this getting started guide           |

## Start development steps

- At first open a new terminal and run `npm run deploy`. It should create new sqlite source and fill initial data from `db/data`. You can browse database in any sqlite client
- Run `cds watch`. This will start cds service on 4004 port in watch mode
- Open `app` folder and run `npm run start`. This will start frontend dev server on 3000 port. It supports debug in chrome and hot reloading out of the box by create-react-app
- Now all things are done for development

## Deployment steps

- Make sure you already have hanatrial instance in your cockpit dashboard (SAP Cloud Platform).
  Or if you are using hana instance - change it in mta.yaml config file from hanatrial to hana
- Replace `"kind": "sql"` with `"kind": "hana"` in package.json require section
- Make sure that current folder does not contain any previous `*.mtar` build file and `gen` folder
  If exists - remove it
- Run `cf login` for Cloud Foundry authentication
- Open `app` folder and run `npm run build`. This will start create new production frontend bundles
- Run `mbt build -t ./`. This will create new build in `*.mtar` file
- Run `cf deploy <.mtar file>` # for example, media-store_1.0.0.mtar
- Now your services should be deployed with hanatrial instance and filled with initial data

## Learn More

Learn more at https://cap.cloud.sap/docs/get-started/.
