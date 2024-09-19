import { Player, Game, Match } from "./models.js";
import { readFileSync, writeFileSync } from "fs";

/**
 * Generate a html table of scores from the list of players
 * @param {Match} match - Match object
 * @returns {string} - html table
 */
export function genScoreTable(match) {
  let ret = `<table><thead><tr><th></th>`;
  for (const player of match.players) {
    ret += `<th class="rotate">${player.name}</th>`;
  }
  ret += `<th class="total">wins</th></tr></thead> <tbody>`;
  for (const playerRow of match.players) {
    ret += `<tr><th>${playerRow.name}</th>`;
    let playerWins = 0;
    let playerTotal = 0;
    for (const playerColum of match.players) {
      let data = "";
      if (playerRow.id === playerColum.id) {
        data = "x";
      } else {
        const game = match.getGame(playerRow.id, playerColum.id);
        if (game !== undefined) {
          data = game.p1.id === playerRow.id ? game.p1Score : game.p2Score;
          playerWins += Number(data);
          playerTotal += 1;
        } else {
          data = " ";
        }
      }
      ret += `<td>${data}</td>`
    }
    ret += `<td class="total">${playerWins}/${playerTotal}</td>`;

    ret += `<td>${calcPerfRank(Array(playerTotal).fill(1000), playerWins)}</td> </tr>`
  }
  ret += "</tbody></table>";
  return ret;
}

/**
 * Generate A list of selection options from a list of player.
 * @param {Match} match - Match object
 * @returns {string} - List of players as option for form
 */
export function genPlayersOptions(match) {
  let ret = "";
  for (const player of match.players) {
    ret += `<option value="${player.id}">${player.name}</option>`;
  }
  return ret;
}

/**
 * Generate a list of games played from the general game List.
 * @param {Match} match - Match object
 * @returns {string} - List of games played
 */
export function genGameList(match) {
  let ret = '<table class="gamelist"><thead><tr><th>White</th><th>Black</th><th>Score</th><th>Date played</th></tr></thead><tbody>';
  for (const game of match.games) {
    ret += `<tr><td>${game.p1.name}</td><td>${game.p2.name}</td><td>${game.p1Score}-${game.p2Score}<td></td></td>`
  }
  ret += `</tbody></table>`;
  return ret;
}

/**
 * 
 * @param {number[]} opponentRatings - List of opponents ranking
 * @param {number} playerScore - Score
 * @returns {number} - Performance ranking for the player
 */
export function calcPerfRank(opponentRatings, playerScore) {

  if (opponentRatings.length == 0) {
    return NaN;
  }

  if (playerScore === 0) {
    opponentRatings.push(1000);
    playerScore = 0;
  } else if (playerScore === opponentRatings.length) {
    opponentRatings.push(1000);
  }

  /**
   * 
   * @param {number[]} ors - Opponent rating
   * @param {number} own - own rating
   * @returns - Expected final score
   */
  function expected_score(ors, own) {
    return ors.reduce((prev, op, _1) => prev + (1 / (1 + Math.pow(10, (op - own) / 400))), 0);
  } 

  let lo = 0;
  let hi = 4000;
  let mid = 0;
  while (hi - lo > 0.1) {
    mid = (lo + hi) / 2;
    if (expected_score(opponentRatings, mid) < playerScore) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return Math.round(mid);
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