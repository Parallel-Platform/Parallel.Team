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

## API

The API for Parallel is available via the `/api/` URI, with each endpoint being appended thereafter. For example, to search the game database you call the `/game/search` endpoint:

```shell
curl "http://parallel.team/api/game/search?search=mario"
```

### Root

#### GET `/`

The root endpoint only responds with a simple text string, meaning it can be used to check if the system is alive.

```shell
curl "http://parallel.team/api/"
```

Authentication of user accounts.

#### GET `/verify?uid={user_id}`

Verifies the user's email based on the user ID.

Returns `200` if successful.

#### GET `/confirm/{token}`

Confirms the user's email based on the token passed.

Returns an HTML page showing a verification page or an error page, where appropriate.

### Email

Sending emails.

#### POST `/email/comment?requestid={request_id}&commenter={commenter}&creator={creator}&gametitle={game_title}&system={system}`

Send an email notifying the creator of a request that a comment has been made on their request.

Returns `200` if successful.

#### POST `/email/invite?requestid={request_id}&invitee={invitee}&gametitle={game_title}&system={system}`

Sends a message to the creator of a request that someone wants to join the request.

Returns `200` if successful.

### Steam

Authenticating with Steam accounts.

#### GET `/steam/authenticate`

Authentication endpoint used when authenticating with steam accounts.

#### GET `/steam/authenticate/verify`

Authentication endpoint used when authenticating with steam accounts.

### Game

Searching for games.

#### GET `/game/search?search={search_term}&limit={limit}`

Searches the game database (currently using Giant Bomb) for a game based on the search term.

Returns `200` with JSON data if successful.

