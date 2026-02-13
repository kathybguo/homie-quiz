import { useState, useEffect } from "react";
import styles from "./LabelPhase.module.css";

export default function LabelPhase({
  allAnswers,
  responsesReceived,
  numPlayers,
}) {
  const answers = Object.values(allAnswers);
  const totalAnswers = answers.length;

  // Determine grid layout
  const getGridColumns = () => {
    if (totalAnswers <= 4) return 2; // 2x2
    if (totalAnswers <= 6) return 3; // 2x3
    if (totalAnswers <= 8) return 4; // 2x4
    return 4; // For scrolling carousel
  };

  const shouldScroll = totalAnswers > 8;
  const columns = getGridColumns();

  // Carousel scrolling logic
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCards = 8; // Always show 8 cards in carousel mode

  useEffect(() => {
    if (!shouldScroll) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalAnswers);
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval);
  }, [shouldScroll, totalAnswers]);

  // Get visible answers for carousel
  const getVisibleAnswers = () => {
    if (!shouldScroll) return answers;

    const visible = [];
    for (let i = 0; i < visibleCards; i++) {
      const index = (currentIndex + i) % totalAnswers;
      visible.push(answers[index]);
    }
    return visible;
  };

  const visibleAnswers = getVisibleAnswers();

  return (
    <div className={styles.container}>
      <div className={styles.answersGrid} style={{ "--grid-columns": columns }}>
        {visibleAnswers.map((answer, index) => {
          const originalIndex = shouldScroll
            ? (currentIndex + index) % totalAnswers
            : index;

          return (
            <div
              key={shouldScroll ? `${answer}-${index}` : index}
              className={styles.answerCard}
              style={{
                "--card-color": `var(--player-color-${(originalIndex % 6) + 1})`,
              }}
            >
              <div className={styles.cardHole}></div>
              <div className={styles.answerText}>{answer}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.progressCounter}>
        {responsesReceived}/{numPlayers}
      </div>
    </div>
  );
}
