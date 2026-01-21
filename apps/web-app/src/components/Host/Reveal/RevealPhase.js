import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import "./RevealPhase.css";

export default function RevealPhase({
  allAnswers,
  allLabels,
  playerNames,
  onComplete,
}) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState(new Set());

  const answerIds = Object.keys(allAnswers);
  const currentAnswerId = answerIds[currentCardIndex];
  const currentAnswer = allAnswers[currentAnswerId];
  const actualAuthorName = playerNames[currentAnswerId];
  const isRevealed = revealedAnswers.has(currentAnswerId);

  // Get all guesses for this answer, including the actual author
  const guessesForThisAnswer = Object.entries(allLabels).map(
    ([guesserSocketId, theirGuesses]) => {
      const isActualAuthor = guesserSocketId === currentAnswerId;

      return {
        guesserName: playerNames[guesserSocketId],
        guessedAuthorId: theirGuesses[currentAnswerId],
        guessedAuthorName: playerNames[theirGuesses[currentAnswerId]],
        isCorrect: theirGuesses[currentAnswerId] === currentAnswerId,
        isActualAuthor: isActualAuthor,
      };
    },
  );

  const handleNext = () => {
    if (isRevealed) {
      setCurrentCardIndex((currentCardIndex + 1) % answerIds.length);
    }
  };

  const handlePrevious = () => {
    if (isRevealed) {
      setCurrentCardIndex(
        (currentCardIndex - 1 + answerIds.length) % answerIds.length,
      );
    }
  };

  const handleReveal = () => {
    setRevealedAnswers(new Set([...revealedAnswers, currentAnswerId]));
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrevious(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className="reveal-container" {...handlers}>
      <div className="reveal-header">
        <h1>Who Wrote This?</h1>
      </div>

      {/* Big answer display */}
      <div className="answer-display">
        <h2>{currentAnswer}</h2>
      </div>

      {/* Sticky note style guesses */}
      <div className="guesses-container">
        {guessesForThisAnswer.map((guess, index) => (
          <div
            key={index}
            className={`sticky-note ${isRevealed && guess.isActualAuthor ? "author-note" : ""}`}
          >
            <div>
              <div className="guesser-name">{guess.guesserName}</div>
              {(!isRevealed || !guess.isActualAuthor) && (
                <div className="guessed-author">
                  by {guess.guessedAuthorName}
                </div>
              )}
              {isRevealed && guess.isActualAuthor && (
                <div className="author-label">✍️ THE AUTHOR</div>
              )}
            </div>
            {isRevealed && !guess.isActualAuthor && (
              <div
                className={`result-indicator ${guess.isCorrect ? "correct" : "incorrect"}`}
              >
                {guess.isCorrect ? "✓" : "✗"}
              </div>
            )}
          </div>
        ))}
      </div>

      {!isRevealed && (
        <button className="reveal-button" onClick={handleReveal}>
          Reveal Answer
        </button>
      )}

      {isRevealed && (
        <div className="actual-author">
          <h3>Actually written by: {actualAuthorName}</h3>
        </div>
      )}

      <div className="navigation">
        <button onClick={handlePrevious} disabled={!isRevealed}>
          ← Previous
        </button>
        <span>
          {currentCardIndex + 1} / {answerIds.length}
        </span>
        <button onClick={handleNext} disabled={!isRevealed}>
          Next →
        </button>
      </div>

      {revealedAnswers.size === answerIds.length && (
        <button className="complete-button" onClick={onComplete}>
          Scores
        </button>
      )}
    </div>
  );
}
