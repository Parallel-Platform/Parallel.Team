# Parallel.team API

_Warning: The API is not for external use. We should either internalise most of functions or use some authentication tokens to prevent outside use._

The API for Parallel is available via the `/api/` URI, with each endpoint being appended thereafter. For example, to search the game database you call the `/game/search` endpoint:

```shell
curl "http://parallel.team/api/game/search?search=mario"
```

## Root

### GET `/`

The root endpoint only responds with a simple text string, meaning it can be used to check if the system is alive.

```shell
curl "http://parallel.team/api/"
```

Authentication of user accounts.

### GET `/verify?uid={user_id}`

Verifies the user's email based on the user ID.

Returns `200` if successful.

### GET `/confirm/{token}`

Confirms the user's email based on the token passed.

Returns an HTML page showing a verification page or an error page, where appropriate.

## Email

Sending emails.

### POST `/email/comment?requestid={request_id}&commenter={commenter}&creator={creator}&gametitle={game_title}&system={system}`

Send an email notifying the creator of a request that a comment has been made on their request.

Returns `200` if successful.

### POST `/email/invite?requestid={request_id}&invitee={invitee}&gametitle={game_title}&system={system}`

Sends a message to the creator of a request that someone wants to join the request.

Returns `200` if successful.

## Steam

Authenticating with Steam accounts.

### GET `/steam/authenticate`

Authentication endpoint used when authenticating with steam accounts.

### GET `/steam/authenticate/verify`

Authentication endpoint used when authenticating with steam accounts.

## Game

Searching for games.

### GET `/game/search?search={search_term}&limit={limit}`

Searches the game database (currently using Giant Bomb) for a game based on the search term.

Returns `200` with JSON data if successful.
