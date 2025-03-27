# Micro Services with CAP

Assumed we want to create a composite application consisting of two or more micro services, each living in a separate GitHub repository, for example:

- https://github.com/capire/bookstore
- https://github.com/capire/reviews
- https://github.com/capire/orders

With some additional repos, used as dependencies in the above, like:

- https://github.com/capire/common
- https://github.com/capire/bookshop

This guide describes a way to manage development and deployment via *[monorepos](https://en.wikipedia.org/wiki/Monorepo)* using *[npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces)* and *[git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)* techniques...

## Create a Solution Monorepo 

1. Create a new monorepo root directory using `npm` workspaces:

   ```sh
   mkdir capire
   cd capire
   echo {\"workspaces\":[\"*\"]} > package.json
   ```

2. Add the above projects as `git` submodules:

   ```sh
   git init
   git submodule add https://github.com/capire/bookstore 
   git submodule add https://github.com/capire/reviews
   git submodule add https://github.com/capire/orders
   git submodule add https://github.com/capire/common
   git submodule add https://github.com/capire/bookshop
   git submodule update --init
   ```
   > The outcome of this looks and behaves exactly as the monorepo layout in *[cap/samples](cap/samples)*,  so we can exercise the subsequent steps in there...

3. Test-drive locally as usual 
   ```sh
   npm install
   ```

   ```sh
   cds w bookshop
   ```

   ```sh
   cds w bookstore
   ```

   

## Using a Shared DB

In the following steps we'll create an additional project to easily collect the relevant models from these projects, and act as a vehicle to deploy these to HANA in a controlled way. 

### Add a project for shared db

1. Add a another `cds` project to collect the models from these:

   ```sh
   cds init shared-db --add hana
   cd shared-db
   ```

   ```sh
   npm add @capire/bookstore
   npm add @capire/reviews
   npm add @capire/orders
   ```

   > Note how *npm workspaces* allows us to use the package names of the projects, and nicely creates according symlinks in *node_modules*.

2. Add a `db/schema.cds` file as a mashup to actually collect the models:

   ```sh
   code db/schema.cds
   ```

   ```cds
   using from '@capire/bookstore';
   using from '@capire/reviews';
   using from '@capire/orders';
   ```

   > Note: the `using` directives above refer to `index.cds` files existing in the target packages. Your projects may have different entry points. 



### Handle as usual...

With that we're basically done with the setup of the collector project. At the end of the day, it's just another CAP project with some cds models in it, which we can handle as usual. We can test whether it all works as expected, for example, we can test-compile and test-deploy it to sqlite and hana, build it, and deploy it to the cloud as usual:

```sh
cds db -2 sql
```
```sh
cds db -2 hana
```

```sh
cds deploy -2 sqlite
```
```sh
cds build --for hana
```

> Note: As we can see in the output for `cds deploy` and `cds build`, it also correctly collects and adds all initial data from enclosed `.csv` files. 



### Binding to shared db

The only thing left to care about is to ensure all 3+1 projects will be bound and connected to the same dbs at deployment, subscription, and runtime. Do so as follows...

- TODO



### Subsequent updates

- TODO... 
- Whenever one of the project has changes affecting the database that would trigger a new deployment of the shared-db project
- Git submodules gives you control which versions to pull, e.g. by git branches or tags 
- Ensure to first deploy shared-db before deploying the others



## All-in-one Deployment

- Here we'd go on with our guide how to deploy all 3+1 projects at once with a common `mta.yaml`

### Add a top-level `.deploy` folder ...

### Add a top-level `mta.yaml` in there

### Add an `app-router` module in there 

### ...

