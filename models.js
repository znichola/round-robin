/**
 * Represents a player in the round-robin tournament.
 * @class
 */
export class Player {
  /** @type {number} */
  static idCounter = 1; // Initialize the static counter

  /**
   * @param {string} name - The name of the player.
   * @param {number} id - Optional, if given id will be this
   */
  constructor(name, id) {
    /** @type {number} */
    this.id = id || Player.idCounter++;

    if (id) {
      Player.idCounter = id + 1;
    }

    /** @type {string} */
    this.name = name;
  }
}

/**
 * Represents a match between two players with scores.
 * @class
 */
export class Game {
  /**
   * @param {Player} p1 - The first player.
   * @param {Player} p2 - The second player.
   * @param {number} p1Score - The score of the first player.
   * @param {number} p2Score - The score of the second player.
   */
  constructor(p1, p2, p1Score, p2Score) {
    /** @type {Player} */
    this.p1 = p1;

    /** @type {Player} */
    this.p2 = p2;

    /** @type {number} */
    this.p1Score = p1Score;

    /** @type {number} */
    this.p2Score = p2Score;
  }
}

/**
 * Represents a round-robin tournament, holding players and games.
 * @class
 */
export class Match {
  /**
   * @param {Player[]} players - The list of players participating in the tournament.
   * @param {Game[]} games - Optional, a list of games played.
   */
  constructor(players, games) {
    /** @type {Player[]} */
    this.players = players;

    /** @type {Game[]} */
    this.games = games || [];
  }

  /**
   * Adds a new player to the tournament.
   * @param {string} playerName - The name of the new player.
   * @returns {Player} - the new player created
   */
  addPlayer(playerName) {
    const newPlayer = new Player(playerName);
    this.players.push(newPlayer);
    return newPlayer;
  }

  /**
   * Get a list of all player objects
   * @returns {Player[]} - list of all player objects
   */
  getPlayers() {
    return this.players;
  }

  /**
   *
   * @param {number} id - Player ID to look for
   * @returns {Player} - Player object, will throw if not found.
   */
  getPlayerById(id) {
    const player = this.players.find((player) => player.id === id);
    if (player === undefined) {
      throw new Error(`Player with ID ${id} not found`);
    }
    return player;
  }

  /**
   * Remove a player from the list
   * @param {number} playerId - Id of player to remove
   * Removes the player from the list, does not modify played games.
   */
  removePlayer(playerId) {
    const index = this.players.findIndex((player) => player.id == playerId);
    if (index === -1) {
      throw new Error(`Player with ID ${playerId} not found`);
    }
    this.players.splice(index, 1);
  }

  /**
   * Adds a game result between two players. Overrights any existing game.
   * @param {number} p1Id - The first player ID.
   * @param {number} p2Id - The second player ID.
   * @param {number} p1Score - The score of the first player.
   * @param {number} p2Score - The score of the second player.
   * @returns {Game} - The created game
   */
  addGame(p1Id, p2Id, p1Score, p2Score) {
    const p1 = this.getPlayerById(Number(p1Id));
    const p2 = this.getPlayerById(Number(p2Id));
    const existingGame = this.games.findIndex(
      (game) => game.p1.id === p1Id || game.p2.id === p2Id
    );
    if (existingGame != -1) {
      this.games.splice(existingGame, 1);
    }
    const game = new Game(p1, p2, p1Score, p2Score);
    this.games.push(game);
    return game;
  }

  /**
   * 
   * @param {p1Id} p1Id - Player 1 Id
   * @param {p2Id} p2Id - Player 3 Id
   * @returns {Game | undefined} - Game between players or undefined.
   */
  getGame(p1Id, p2Id) {
    const game = this.games.find(
      (game) => (game.p1.id === p1Id && game.p2.id === p2Id) || (game.p1.id === p2Id && game.p2.id === p1Id)
    );
    // if (game === undefined) {
    //   throw Error(`Game between ${p1Id} and ${p2Id} not found`);
    // }
    return game;
  }

  /**
   * Get all games of a player.
   * @param {Player} player - The player whose games to retrieve.
   * @returns {Game[]} The games of the given player.
   */
  getPlayerGames(player) {
    return this.games.filter(
      (game) => game.p1 === player || game.p2 === player
    );
  }

  /**
   * Get the score of a specific game.
   * @param {Game} game - The game to retrieve the score for.
   * @returns {string} The score in "Player1: Score - Player2: Score" format.
   */
  getGameScore(game) {
    return `${game.p1.name}: ${game.p1Score} - ${game.p2.name}: ${game.p2Score}`;
  }
}
