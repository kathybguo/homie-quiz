export class Round {
  constructor(prompt) {
    this.prompt = prompt;
    this.answers = {}; // key: socketId, value: prompt answer
    this.labels = {}; // key: player socket id of labels, value: object of their labels {originalAuthorId1: guessedAuthorId1, originalAuthorId2: guessedAuthorId2,...}
    this.numGuesses = 0;
  }

  calculateScores() {
    // Build map of correct answers
    const answerMap = {};
    this.answers.forEach((a) => {
      answerMap[a.answer] = a.playerId;
    });

    // Score each player's guesses
    const scores = {};
    this.guesses.forEach((guess) => {
      let correctCount = 0;
      guess.guesses.forEach((g) => {
        if (answerMap[g.answer] === g.guessedPlayerId) {
          correctCount++;
        }
      });
      scores[guess.guesserId] = correctCount * 10; // 10 points per correct
    });

    return scores;
  }

  isComplete() {
    return (
      this.answers.length > 0 && this.guesses.length === this.answers.length
    );
  }
}
