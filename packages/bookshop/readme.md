# Bookshop Sample App

Sample application showcasing different services serving the same set of data entities from a sqlite database. The services match different use cases visualized in corresponding Fiori apps.


## Preliminaries

* get [_Node.js_](https://nodejs.org/en/) v8 or higher
* get [_sqlite_](https://www.sqlite.org/download.html) (Windows only; pre-installed on Mac/Linux)
* _npm set @sap:registry_ to the latest _nexus snapshots_:

```sh
npm set @sap:registry=http://nexus.wdf.sap.corp:8081/nexus/content/groups/build.snapshots.npm
```

## Setup

Copy & paste this to your command line:

```sh
git clone https://github.wdf.sap.corp/capire/bookshop.git
cd bookshop
npm install
```

## Run
```sh
npm start
```

## Test

Open these links in your browser:

* <http://localhost:4004/fiori.html> &ndash; Fiori Launchpad sandbox
* <http://localhost:4004/> &ndash; generic index page


## Debug

In [VS Code](https://code.visualstudio.com) switch to _Debug_ view and launch the prepared _cds run_ configuration.

Set breakpoints in one of the javascript files, e.g. [srv/handlers/cat-service.js](srv/handlers/cat-service.js).


## Develop

Edit the provided `.cds` or `.js` sources and restart the server (i.e. Ctrl-C, `npm start`) to see the effects.

## Issues?
→ [cap/issues](https://github.wdf.sap.corp/cap/issues/issues)

