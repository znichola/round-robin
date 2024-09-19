import express from "express";
import path from "path";
import { Player, Game, Match } from "./models.js";
import { genPlayersOptions, genScoreTable, genGameList, loadMatch, saveMatch, calcPerfRank } from "./functions.js";
import { readFileSync } from "fs";

const app = express();
const port = 5555;
const saveFile = "save.json";
const homeTemplate = "public/index.html";

console.log("Loading match data from:", saveFile);
let match = loadMatch(saveFile);

console.log("Loaidng home template from:", homeTemplate);
const homeHTML = readFileSync(homeTemplate, 'utf8');

// To parse application/x-www-form-urlencoded form data
app.use(express.urlencoded({ extended: true }));

// And handle JSON data too:
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
  const routes = app._router.stack.filter(r => r.route).map(r => `${r.route.stack[0].method} ${r.route.path}`)
  res.json({ message: "Round Robin api:", routes: routes });
});

app.get("/api/player", (req, res) => {
  res.json({
    message: "Sucess, a list of players",
    players: match.getPlayers(),
  });
});

app.post("/api/player", (req, res) => {
  // Check for form data in req.body or query data in req.query
  const playerName = req.body.name || req.query.name;

  if (!playerName) {
    return res.status(400).json({ message: "Player name is required" });
  }
  const player = match.addPlayer(playerName);

  saveMatch("save.json", match);
  // Sucess redirect to the original page, so it's frefreshed automatically
  res.redirect('back');
});

app.delete("/api/player/:id", (req, res) => {
  try {
    match.removePlayer(req.params.id);
    saveMatch("save.json", match);
    res.json({ message: "Sucess, player removed" });
  } catch (error) {
    res.status(404).json({ message: "Error, player not found" });
  }
});

app.get("/api/game", (req, res) => {
  res.json({ message: "Sucess, a list of games", games: match.games });
});

app.post("/api/game", (req, res) => {
  // Check for form data in req.body or query data in req.query
  const p1Id = req.body.p1Id || req.query.p1Id;
  const p2Id = req.body.p2Id || req.query.p2Id;
  const outcome = req.body.outcome || req.query.outcome;
  let p1Score = req.body.p1Score || req.query.p1Score;
  let p2Score = req.body.p2Score || req.query.p2Score;

  if (outcome === "draw") {
    p1Score = "0.5";
    p2Score = "0.5";
  } else if (outcome === "p1win") {
    p1Score = "1";
    p2Score = "0";
  } else if (outcome === "p2win") {
    p1Score = "0";
    p2Score = "1";
  }

  if (!p1Id || !p2Id || !p1Score || !p2Score ) {
    return res.status(400).json({ message: `Missing information p1Id=${p1Id} p2Id=${p2Id} (p1Score=${p1Score} & p2Score=${p2Score} or outcome=${outcome})`});
  }

  try {
    match.addGame(p1Id, p2Id, p1Score, p2Score);
    saveMatch("save.json", match);
    res.redirect("back");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.get("/api/table", (req, res) => {
  res.send(genScoreTable(match));
});

app.get("/api/match", (req, res) => {
  res.json({ message: "Success, match retrieved", match: match });
})

app.post("/api/match/new", (req, res) => {
  match = new Match([]);
  res.json({ message: "Success, old game removed, new match initialised" });
});

app.post("/api/match/save", (req, res) => {
  saveMatch("save.json", match);
  res.json({ message: `Saved to ./${saveFile}` });
});

app.post("/api/match/load", (req, res) => {
  match = loadMatch(saveFile)
  res.json({ message: "Success, file loaded", match: match });
});

app.get("/", (req, res) => {
  if (match === undefined) {
    res.status(500).json({ message: "Match data is undefined." });
    return;
  }
  const homeHTML = readFileSync(homeTemplate, 'utf8'); // added only for testing
  let html = homeHTML.replace("<!-- TABLE -->", genScoreTable(match));
  html = html.replaceAll("<!-- PLAYERS -->", genPlayersOptions(match));
  // html = html.replace("<!-- GAMELIST -->", genGameList(match));
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
  console.log(`\nRunning on http://localhost:${port}`);
});
