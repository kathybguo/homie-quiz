import { socket } from "../../web-app/src/socket.js";
import { Round } from "./Round.js";
import { PROMPTS } from "./prompts.js";
import { GAME_STATES } from "@hq/utils";

export class Session {
  constructor(code, hostSocketId) {
    this.sessionCode = code;
    this.playerScores = {}; // key: player name, value: player score
    this.playerNames = [];
    this.state = GAME_STATES.WAITING;
    this.hostSocketId = hostSocketId;
    this.round = 1;
    this.currentRound = null;
    this.availablePrompts = [...PROMPTS]; // Copy the array
    this.usedPrompts = [];
    this.rounds = [];
    this.numPlayers = 0;
    this.totalRounds = 0;
  }

  addPlayer(name) {
    this.playerScores[name] = 0;
    this.playerNames.push(name);
    this.numPlayers += 1;
  }

  removePlayer(socketId) {
    this.players = this.players.filter((p) => p.id !== socketId);
  }

  getPlayer(socketId) {
    return this.players.find((p) => p.id === socketId);
  }

  start(numRounds) {
    this.state = GAME_STATES.PROMPTING;
    this.totalRounds = numRounds;
    this.startNewRound();
  }

  startNewRound() {
    // if not the first round, save the previous round data
    if (this.currentRound) {
      this.rounds.push(this.currentRound);
    }
    const prompt = this.getRandomPrompt();
    this.currentRound = new Round(prompt);
  }

  updateScoresFromRound() {
    const roundScores = this.currentRound.calculateScores();
    for (const [playerName, points] of Object.entries(roundScores)) {
      this.playerScores[playerName] += points;
    }
    return roundScores;
  }

  completeRound() {
    if (this.round == this.totalRounds) {
      this.rounds.push(this.currentRound);
      this.state = GAME_STATES.OVER;
    } else {
      this.round += 1;
      this.state = GAME_STATES.PROMPTING;
      this.startNewRound();
    }
  }

  reset() {
    Object.keys(this.playerScores).forEach((key) => {
      this.playerScores[key] = 0;
    });
    this.state = GAME_STATES.WAITING;
    this.round = 1;
    this.currentRound = null;
    this.availablePrompts = [...PROMPTS]; // Copy the array
    this.usedPrompts = [];
    this.rounds = [];
  }

  getRandomPrompt() {
    const index = Math.floor(Math.random() * this.availablePrompts.length);
    const prompt = this.availablePrompts.splice(index, 1)[0]; // Remove and return
    this.usedPrompts.push(prompt);
    return prompt;
  }
}
