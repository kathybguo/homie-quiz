import GradientBackground from "../../../components/GradientBackground/GradientBackground.jsx";
import styles from "./Scores.module.css";

export default function Scores({ score, rank }) {
  const getRankSuffix = (rank) => {
    if (rank === 1) return "st";
    if (rank === 2) return "nd";
    if (rank === 3) return "rd";
    return "th";
  };

  if (score === null || rank === null) {
    return <div className={styles.loading}>Loading scores...</div>;
  }

  return (
    <GradientBackground variant="player-scores">
      <div className={styles.container}>
        <div className={styles.score}>{score}</div>
        <div className={styles.rank}>
          {rank}
          {getRankSuffix(rank)} place
        </div>
      </div>
    </GradientBackground>
  );
}
