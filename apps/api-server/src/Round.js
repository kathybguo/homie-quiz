export class Round {
  constructor(prompt) {
    this.prompt = prompt;
    this.answers = {}; // key: socketId, value: prompt answer
    this.labels = {}; // key: player socket id of labels, value: object of their labels {originalAuthorId1: guessedAuthorId1, originalAuthorId2: guessedAuthorId2,...}
    this.numGuesses = 0;
  }

  calculateScores() {
    const scores = {};
    for (const [playerId, theirGuesses] of Object.entries(this.labels)) {
      let correctCount = 0;
      for (const [authorId, guessedAuthorId] of Object.entries(theirGuesses)) {
        if (authorId === guessedAuthorId) {
          correctCount++;
        }
      }
      scores[playerId] = correctCount * 100;
    }
    return scores;
  }
}
