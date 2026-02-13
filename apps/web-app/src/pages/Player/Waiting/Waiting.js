import GradientBackground from "../../../components/GradientBackground/GradientBackground.jsx";
import styles from "./Waiting.module.css";

export default function Waiting({}) {
  return (
    <GradientBackground variant="player-waiting">
      <div className={styles.container}>
        <div>Waiting for other players</div>
        <div className={styles.dots}>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    </GradientBackground>
  );
}
