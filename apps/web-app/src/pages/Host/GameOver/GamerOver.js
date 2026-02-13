import Button from "../../../components/Button/Button.jsx";
import GradientBackground from "../../../components/GradientBackground/GradientBackground.jsx";
import styles from "./GameOver.module.css";

export default function GameOver({ playerScores, playAgain, endGame }) {
  // Get top 3 players
  const sortedPlayers = Object.entries(playerScores)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Assign ranks with tie logic using a for loop
  const playersWithRanks = [];

  for (let i = 0; i < sortedPlayers.length; i++) {
    const player = sortedPlayers[i];

    if (i === 0) {
      playersWithRanks.push({ ...player, rank: 1 });
    } else {
      const prevPlayer = playersWithRanks[i - 1];
      if (player.score === sortedPlayers[i - 1].score) {
        playersWithRanks.push({ ...player, rank: prevPlayer.rank });
      } else {
        playersWithRanks.push({ ...player, rank: i + 1 });
      }
    }
  }

  // Arrange for podium: [2nd, 1st, 3rd]
  const getPlayerForPosition = (targetRank) => {
    return playersWithRanks.find((p) => p.rank === targetRank) || null;
  };

  const podiumOrder = [
    getPlayerForPosition(2), // 2nd place (left)
    getPlayerForPosition(1), // 1st place (center)
    getPlayerForPosition(3), // 3rd place (right)
  ];

  return (
    <GradientBackground variant="host-scores">
      <div className={styles.container}>
        <h1 className={styles.title}>game over</h1>

        {/* <div className={styles.podium}>
          {podiumOrder.map((player, index) => {
            if (!player)
              return <div key={index} className={styles.emptyPodium} />;

            const displayRank = player.rank;

            return (
              <div
                key={`${player.name}-${index}`}
                className={`${styles.podiumPlace} ${styles[`place${displayRank}`]}`}
              >
                <div className={styles.rankBadge}>{displayRank}</div>
                <div className={styles.playerName}>{player.name}</div>
                <div className={styles.playerScore}>{player.score}</div>
              </div>
            );
          })}
        </div> */}
        {/* 
        <div className={styles.buttons}> */}
        <Button variant="glass" size="m" onClick={playAgain}>
          play again
        </Button>
        <Button variant="glass" size="m" onClick={endGame}>
          home
        </Button>
        {/* </div> */}
      </div>
    </GradientBackground>
  );
}
