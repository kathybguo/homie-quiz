import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import styles from "./RevealPhase.module.css";
import Button from "../../../components/Button/Button.jsx";

export default function RevealPhase({ allAnswers, allLabels, onComplete }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState(new Set());

  const answerIds = Object.keys(allAnswers);
  const currentAnswerId = answerIds[currentCardIndex];
  const currentAnswer = allAnswers[currentAnswerId];
  const isRevealed = revealedAnswers.has(currentAnswerId);

  const guessesForThisAnswer = Object.entries(allLabels).map(
    ([guesserName, theirGuesses]) => {
      const isActualAuthor = guesserName === currentAnswerId;

      return {
        guesserName,
        guessedAuthorName: theirGuesses[currentAnswerId],
        isCorrect: theirGuesses[currentAnswerId] === currentAnswerId,
        isActualAuthor,
      };
    },
  );

  const handleNext = () => {
    setCurrentCardIndex((prev) => (prev + 1) % answerIds.length);
  };

  const handlePrevious = () => {
    setCurrentCardIndex(
      (prev) => (prev - 1 + answerIds.length) % answerIds.length,
    );
  };

  const handleReveal = () => {
    setRevealedAnswers(new Set([...revealedAnswers, currentAnswerId]));
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className={styles.container} {...handlers}>
      <div className={styles.answerWrapper}>
        <button className={styles.navArrow} onClick={handlePrevious}>
          {"<"}
        </button>

        <div className={styles.answerCard}>
          <h2>“{currentAnswer}”</h2>
        </div>

        <button className={styles.navArrow} onClick={handleNext}>
          {">"}
        </button>
      </div>

      {/* Guess Cards */}
      <div className={styles.guessRow}>
        {guessesForThisAnswer.map((guess, index) => (
          <div
            key={index}
            className={`${styles.guessCard} ${
              isRevealed && guess.isActualAuthor ? styles.authorCard : ""
            }`}
          >
            <div className={styles.cardDot}></div>

            {!isRevealed && (
              <>
                <div className={styles.guessedAuthor}>
                  {guess.guessedAuthorName}
                </div>
                <div className={styles.guesserName}>- {guess.guesserName}</div>
              </>
            )}
            {isRevealed && guess.isActualAuthor && (
              <>
                <div className={styles.guessedAuthor}>{guess.guesserName}</div>
                <div className={styles.authorLabel}>said this</div>
              </>
            )}
            {isRevealed && !guess.isActualAuthor && (
              <>
                <div className={styles.guessedAuthor}>
                  {guess.guessedAuthorName}
                </div>
                <div className={styles.guesserName}>- {guess.guesserName}</div>

                <div
                  className={`${styles.resultIndicator} ${
                    guess.isCorrect ? styles.correct : styles.incorrect
                  }`}
                >
                  {guess.isCorrect ? "✓" : "✗"}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {!isRevealed && (
        <Button variant="primary" size="m" onClick={handleReveal}>
          reveal
        </Button>
      )}

      {revealedAnswers.size === answerIds.length && (
        <Button variant="primary" size="m" onClick={onComplete}>
          scores
        </Button>
      )}
    </div>
  );
}
