import { Player, Game, Match } from "./models.js";
import { readFileSync, writeFileSync } from "fs";

/**
 * 
 * @param {Match} match - Match object
 * @returns {string} - html table
 */
export function getTable(match) {
  let ret = `<table><thead><tr><th></th>`;
  for (const player of match.players) {
    ret += `<th class="rotate">${player.name}</th>`;
  }
  ret += "</tr></thead> <tbody>";
  for (const playerRow of match.players) {
    ret += `<tr><th>${playerRow.name}</th>`;
    for (const playerColum of match.players) {
      let data = "";
      if (playerRow.id === playerColum.id) {
        data = "x";
      } else {
        const game = match.getGame(playerRow.id, playerColum.id);
        if (game !== undefined) {
          data = game.p1.id === playerRow.id ? game.p1Score : game.p2Score;
          // data = `${game.p1.name} ${game.p1Score} - ${game.p2Score} ${game.p2.name}`;
        } else {
          data = " ";
        }
      }
      ret += `<td>${data}</td>`
    }
    ret += `</tr>`;
  }
  ret += "</tbody></table>";
  return ret;
}

/**
 * 
 * @param {Match} match - Match object
 * @returns {string} - List of players as option for form
 */
export function getPlayers(match) {
  let ret = "";
  for (const player of match.players) {
    ret += `<option value="${player.id}">${player.name}</option>`;
  }
  return ret;
}

/**
 * 
 * @param {string} file - File path
 * @returns {Match} - Match object
 */
export function loadMatch(file) {
    // Load JSON file and parse it
    const matchData = JSON.parse(readFileSync(file, 'utf8'));

    // Reconstruct players
    const players = matchData.players.map(playerData => new Player(playerData.name, playerData.id));
    // Reconstruct games
    const games = matchData.games.map(gameData => {
      const p1 = players.find(player => player.id === gameData.p1.id);
      const p2 = players.find(player => player.id === gameData.p2.id);
      return new Game(p1, p2, gameData.p1Score, gameData.p2Score);
    });
  
    // Reconstruct the match
    const match = new Match(players);
    match.games = games;
    return match;
}

/**
 * 
 * @param {string} file - File path to save to
 * @param {Match} match - Object to save 
 */
export function saveMatch(file, match) {
  writeFileSync(file, JSON.stringify(match));
}