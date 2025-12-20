import { socket } from "../../web-app/src/socket.js";
import { prompts } from "./prompts.js";

export class Session {
  constructor(code) {
    this.sessionCode = code;
    this.playerScores = {}; // key: player name, value: player score
    this.playerNames = {}; // key: socket id, value: player name
    this.state = "waiting"; // possible states: waiting, answering, labeling, reveal, scores, over
    this.round = 0;
    this.currentRound = null;
    this.availablePrompts = [...prompts]; // Copy the array
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
    this.state = "answering";
    startNewRound();
  }

  startNewRound() {
    const question = this.getRandomPrompt();
    this.currentRound = new Round(question);
    socket.emit("new-round", {
      roundData: this.currentRound,
    });
  }

  completeRound() {
    if (this.round == 10) {
      this.state = "over";
    } else {
      this.round += 1;
      this.state = "answering";
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
