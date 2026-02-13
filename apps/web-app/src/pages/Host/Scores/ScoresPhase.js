import GradientBackground from "../../../components/GradientBackground/GradientBackground.jsx";
import styles from "./ScoresPhase.module.css";
import Button from "../../../components/Button/Button.jsx";

export default function ScoresPhase({
  playerScores,
  onComplete,
  currRound,
  totalRound,
}) {
  // Convert to array and sort by score descending
  const sortedPlayers = Object.entries(playerScores)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Take top 5

  // Assign ranks with tie logic
  const playersWithRanks = [];

  for (let i = 0; i < sortedPlayers.length; i++) {
    const player = sortedPlayers[i];

    if (i === 0) {
      // First player is always rank 1
      playersWithRanks.push({ ...player, rank: 1 });
    } else {
      // Check if tied with previous player
      const prevPlayer = playersWithRanks[i - 1];
      if (player.score === sortedPlayers[i - 1].score) {
        // Tied - use same rank
        playersWithRanks.push({ ...player, rank: prevPlayer.rank });
      } else {
        // Not tied - rank is actual position + 1
        playersWithRanks.push({ ...player, rank: i + 1 });
      }
    }
  }

  return (
    <GradientBackground variant="host-scores">
      <div className={styles.container}>
        <div className={styles.scoresTitle}>Scoreboard</div>

        <div className={styles.leaderboard}>
          {playersWithRanks.map((player) => (
            <div key={player.name} className={styles.leaderboardRow}>
              <div className={styles.rankNumber}>{player.rank}</div>
              <div className={styles.playerName}>{player.name}</div>
              <div className={styles.playerScore}>{player.score}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.roundCounter}>
        {currRound}/{totalRound}
      </div>

      <div className={styles.nextButton}>
        <Button variant="just-text" size="xl" onClick={onComplete}>
          {">"}
        </Button>
      </div>
    </GradientBackground>
  );
}
