import { socket } from "../../web-app/src/socket.js";
import { PROMPTS } from "./prompts.js";
import { GAME_STATES } from "utils";

export class Session {
  constructor(code, hostSocketId) {
    this.sessionCode = code;
    this.playerScores = {}; // key: player name, value: player score
    this.playerNames = {}; // key: socket id, value: player name
    this.state = GAME_STATES.WAITING;
    this.hostSocketId = hostSocketId;
    this.round = 0;
    this.currentRound = null;
    this.availablePrompts = [...PROMPTS]; // Copy the array
    this.usedPrompts = [];
    this.rounds = [];
  }

  addPlayer(socketId, name) {
    this.playerScores[name] = 0;
    this.playerNames[socketId] = name;
    console.log("Current players:", this.playerNames);
  }

  removePlayer(socketId) {
    this.players = this.players.filter((p) => p.id !== socketId);
  }

  getPlayer(socketId) {
    return this.players.find((p) => p.id === socketId);
  }

  start() {
    this.state = GAME_STATES.PROMPTING;
    startNewRound();
  }

  startNewRound() {
    // if not the first round, save the previous round data
    if (this.currentRound) {
      this.rounds.push(this.currentRound);
    }
    const prompt = this.getRandomPrompt();
    this.currentRound = new Round(prompt);
  }

  completeRound() {
    if (this.round == 2) {
      this.state = GAME_STATES.OVER;
    } else {
      this.round += 1;
      this.state = GAME_STATES.PROMPTING;
      this.startNewRound();
    }
  }

  getRandomPrompt() {
    const index = Math.floor(Math.random() * this.availablePrompts.length);
    const prompt = this.availablePrompts.splice(index, 1)[0]; // Remove and return
    this.usedPrompts.push(prompt);
    return prompt;
  }
}
