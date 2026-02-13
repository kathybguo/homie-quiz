import GradientBackground from "../../../components/GradientBackground/GradientBackground.jsx";
import styles from "./RevealPhase.module.css";

export default function RevealPhase() {
  return (
    <GradientBackground variant="player-reveal">
      <div className={styles.text}>answers revealed</div>
    </GradientBackground>
  );
}
