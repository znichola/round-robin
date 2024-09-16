import express from "express";
import path from "path";
import { Player, Game, Match } from "./models.js";
import { readFileSync, writeFileSync, writeSync } from "fs";

const app = express();
const port = 5555;

let match = new Match([]);

app.use(express.json());

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.hostname} ${req.method} ${req.url}`
  );
  next();
});

// test route
app.get("/hello", (req, res) => {
  res.send("Hello");
});

app.get("/api", (req, res) => {
  res.json({ message: "Round Robin api, it's simples." });
});

app.get("/api/newgame", (req, res) => {
  match = new Match([]);
  res.json({ message: "Sucess, old game removed, new match initialised" });
});

app.get("/api/player", (req, res) => {
  res.json({
    message: "Sucess, a list of players",
    players: match.getPlayers(),
  });
});

app.post("/api/player", (req, res) => {
  res.json({
    message: "Sucess, player added",
    player: match.addPlayer(req.query.name),
  });
});

app.delete("/api/player/:id", (req, res) => {
  try {
    match.removePlayer(req.params.id);
    res.json({ message: "Sucess, player removed" });
  } catch (error) {
    res.status(404).json({ message: "Error, player not found" });
  }
});

app.get("/api/game", (req, res) => {
  res.json({ message: "Sucess, a list of games", games: match.games });
});

app.post("/api/game", (req, res) => {
  try {
    res.json({
      message: "Sucess, game added",
      game: match.addGame(
        req.query.p1Id,
        req.query.p2Id,
        req.query.p1Score,
        req.query.p2Score
      ),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

function getTable() {
  let ret = "<table><tr><th> </th>";
  for (const player of match.players) {
    ret += `<th>${player.name}</th>`;
  }
  ret += "</tr>";
  for (const playerRow of match.players) {
    ret += `<tr><th>${playerRow.name}</th>`;
    for (const playerColum of match.players) {
      let data = "";
      if (playerRow.id === playerColum.id){
        data = "x";
      } else {
        const game = match.getGame(playerRow.id, playerColum.id);
        if (game !== undefined) {
          data = game.p1.id === playerRow.id ? game.p1Score : game.p2Score;
          // data = `${game.p1.name} ${game.p1Score} - ${game.p2Score} ${game.p2.name}`;
          console.log(playerRow.name, game);
        } else {
          data = " ";
        }
      }
      ret += `<td>${data}</td>`
    }
    ret += `</tr>`;
  }
  ret += "</table>";
  return ret;
}

app.get("/api/table", (req, res) => {

  res.send(getTable());
});

app.get("/", (req, res) => {
  let html = readFileSync("public/index.html", 'utf8');
  html = html.replace("<!-- TABLE -->", getTable());
  console.log('loading index', html);
  res.send(html);
});

app.post("/api/save", (req, res) => {
  console.log("Trying to have to file");
  writeFileSync("save.json", JSON.stringify(match), )
  res.json({message: "Saved to /save.json"});
});

app.post("/api/load", (req, res) => {
  // Load JSON file and parse it
  const matchData = JSON.parse(readFileSync("save.json", 'utf8'));

  // Reconstruct players
  const players = matchData.players.map(playerData => new Player(playerData.name));

  // Reconstruct games
  const games = matchData.games.map(gameData => {
    const p1 = players.find(player => player.id === gameData.p1.id);
    const p2 = players.find(player => player.id === gameData.p2.id);
    return new Game(p1, p2, gameData.p1Score, gameData.p2Score);
  });

  // Reconstruct the match
  match = new Match(players);
  match.games = games; // Set the games

  res.json({ message: "Success, file loaded", match: match });
});

// tries matching call with any files present in the public folder
app.use(express.static(path.join(process.cwd(), "public")));

// Handle 404 errors (Page Not Found)
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

// listen with app on the port
app.listen(port, () => {
  console.log(`Running on localhost:${port}`);
});
