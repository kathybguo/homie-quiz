export class Round {
  constructor(prompt) {
    this.prompt = prompt;
    this.answers = {}; // key: playerName, value: prompt answer
    this.labels = {}; // key: playerName of labels, value: object of their labels {originalAuthorId1: guessedAuthorId1, originalAuthorId2: guessedAuthorId2,...}
    this.numGuesses = 0;
  }

  calculateScores() {
    const scores = {};
    for (const [playerName, theirGuesses] of Object.entries(this.labels)) {
      let correctCount = 0;
      for (const [authorName, guessedAuthorName] of Object.entries(
        theirGuesses,
      )) {
        if (authorName === guessedAuthorName) {
          correctCount++;
        }
      }
      scores[playerName] = correctCount * 100;
    }
    return scores;
  }
}
