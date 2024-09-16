import express from "express";
import path from "path";
import { Player, Game, Match } from "./models.js";
import { getTable, loadMatch, saveMatch } from "./functions.js";
import { readFileSync, writeFileSync, writeSync } from "fs";

const app = express();
const port = 5555;
const saveFile = "save.json";

let match = loadMatch(saveFile);
console.log("Loading match data from:". saveFile);
const homeHTML = readFileSync("public/index.html", 'utf8');

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

app.get("/api/table", (req, res) => {
  res.send(getTable(match));
});

app.post("/api/save", (req, res) => {
  saveMatch("save.json", match);
  res.json({ message: `Saved to ./${saveFile}` });
});

app.post("/api/load", (req, res) => {
  res.json({ message: "Success, file loaded", match: loadMatch(saveFile) });
});

app.get("/", (req, res) => {
  if (match === undefined) {
    res.status(500).json({ message: "Match data is undefined." });
    return;
  }
  const html = homeHTML.replace("<!-- TABLE -->", getTable(match));
  res.send(html);
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
