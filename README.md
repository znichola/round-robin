# Round-robin scrore sheet

A simple round-robin score sheet for the office chess tournament.

Built [expressjs](https://expressjs.com/) as a erver, string methods for templating, and a js object as a DB.

## Launch it

```bash
docker compose scibeta-chess npm i # install node depencancies
docker compose up -d # launch in detached mode
```

## Maintence

There are api routes that are not hooked up to buttons, you can use them with curl:

```bash
curl -X GET http://localhost:5555/api # gives a list of available routes, not all are tested for all cases
curl -X GET  http://localhost:5555/api/match
curl -X POST http://localhost:5555/api/match/save
curl -X POST http://localhost:5555/api/match/load
```

## TODO

- [x] decide on datastructure
- [x] render table from data
- [x] make endpoint to add a player to the match
- [x] make endpoint to add result to log
- [x] make endpoint to clear the match
- [x] styling
- [x] form actions to add player
- [x] form actions to add game
- [ ] admin pannel form actions, delete player/game create new match