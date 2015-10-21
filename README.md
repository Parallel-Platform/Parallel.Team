# Parallel.Team

[Parallel.Team](http://www.parallel.team/) is a web app for finding people to play games with.

## Requirements

* [NodeJS](https://nodejs.org/)

## Installation

Install the node dependencies.

```shell
npm install
```

Install the bower components.

```shell
cd public/components
bower install
cd -
```

Copy `config-example.js` to `config.js` and make the appropriate changes.

```shell
cp config-example.js config.js
```

Copy `app-config-example.js` to `app-config.js` and make the appropriate changes.

```shell
cp public/assets/app/js/config-example.js public/assets/app/js/config.js
```

## Running

The application is built to run on an [Azure](https://azure.microsoft.com/en-us/) stack while storing the data in [Firebase](https://www.firebase.com/). However, you can run a local instance of it with the `local.js` script. This will start a local server which listens on [localhost:3000](http://localhost:3000).

```shell
node local.js
```
