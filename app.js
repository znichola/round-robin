import express from "express";
import path from "path";
import { Player, Game, Match } from "./models.js";

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

// tries matching call with any files present in the public folder
app.use(express.static(path.join(process.cwd(), "public")));

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

// Handle 404 errors (Page Not Found)
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

// listen with app on the port
app.listen(port, () => {
  console.log(`Running on localhost:${port}`);
});
