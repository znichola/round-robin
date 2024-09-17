# Round-robin scrore sheet

A simple round-robin score sheet for the office chess tournament.

Built [expressjs](https://expressjs.com/) as a erver, string methods for templating, and a js object as a DB.

## Launch it

```bash
docker compose scibeta-chess npm i # install node depencancies
docker compose up -d # launch in detached mode
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