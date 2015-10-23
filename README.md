# Parallel.Team

[Parallel.Team](http://www.parallel.team/) is a web app for finding people to play games with.

## Requirements

* [NodeJS](https://nodejs.org/)
* [Firebase Account] (https://www.firebase.com/)
* [Giantbomb API Account Key] (http://www.giantbomb.com/api/)

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

Copy `config-example.js` to `config.js` and make the appropriate changes to the GiantBomb API key, Firebase url/secret and anything else you intend to use.

```shell
cp config-example.js config.js
```

Copy `public/assets/app/js/app-config-example.js` to `public/assets/app/js/app-config.js` and make the appropriate changes.

```shell
cp public/assets/app/js/app-config-example.js public/assets/app/js/app-config.js
```

## Development

The application is built to run on an [Azure](https://azure.microsoft.com/en-us/) stack. However, you can run a local instance of it with the `npm start` command. This will start a local server which listens on [localhost:3000](http://localhost:3000).

```shell
npm start
```

All authentication is done via Firebase, so you will need to set it up to authenticate with Google/Facebook/Twitter or any other auth service you want to use.

### Testing

Testing is run via the `npm test` command, but you need to be sure that you've installed the `devDependencies` (see the [npm Documentation](https://docs.npmjs.com/cli/install) for more information).

```shell
npm test
```
