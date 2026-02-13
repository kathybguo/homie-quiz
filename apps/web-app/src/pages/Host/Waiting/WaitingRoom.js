import { useState } from "react";
import Button from "../../../components/Button/Button.jsx";
import styles from "./WaitingRoom.module.css";

export default function WaitingRoom({ code, playerNames, onStartGame }) {
  const numPlayers = playerNames.length;
  const labelText = "game code";
  const [numRounds, setNumRounds] = useState(10); // Default 10 rounds

  const incrementRounds = () => {
    if (numRounds < 20) {
      setNumRounds(numRounds + 1);
    }
  };

  const decrementRounds = () => {
    if (numRounds > 1) {
      setNumRounds(numRounds - 1);
    }
  };

  const handleStartGame = () => {
    onStartGame(numRounds);
  };

  return (
    <div className={styles.container}>
      <div className={styles.codeSection}>
        <div className={styles.codeLabel}>
          {labelText.split("").map((char, index) => (
            <span
              key={index}
              className={styles.labelChar}
              style={{ "--char-index": index }}
            >
              {char}
            </span>
          ))}
        </div>
        <div className={styles.code}>{code}</div>
      </div>

      <div className={styles.playersSection}>
        {numPlayers > 0 ? (
          <div className={styles.playerTags}>
            {playerNames.map((playerName, index) => (
              <div
                key={playerName}
                className={styles.playerTag}
                style={{
                  "--player-color": `var(--player-color-${(index % 6) + 1})`,
                }}
              >
                {playerName}
              </div>
            ))}
          </div>
        ) : (
          <p>Waiting for players to join...</p>
        )}
      </div>

      {/* Round Counter - Bottom Left */}
      <div className={styles.roundCounter}>
        <button
          className={styles.counterButton}
          onClick={decrementRounds}
          disabled={numRounds <= 1}
        >
          -
        </button>
        <div className={styles.counterDisplay}>
          <div className={styles.counterNumber}>{numRounds}</div>
          <div className={styles.counterLabel}>rounds</div>
        </div>
        <button
          className={styles.counterButton}
          onClick={incrementRounds}
          disabled={numRounds >= 20}
        >
          +
        </button>
      </div>

      {numPlayers >= 1 && (
        <div className={styles.startButton}>
          <Button variant="primary" size="m" onClick={handleStartGame}>
            go
          </Button>
        </div>
      )}
    </div>
  );
}
