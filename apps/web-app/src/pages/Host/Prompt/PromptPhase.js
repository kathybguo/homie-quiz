import GradientBackground from "../../../components/GradientBackground/GradientBackground.jsx";
import styles from "./PromptPhase.module.css";

export default function PromptPhase({ prompt, responsesReceived, numPlayers }) {
  return (
    <GradientBackground variant="host-prompt">
      <div className={styles.prompt}>{prompt.toLowerCase()}</div>
      <p className={styles.progressCounter}>
        {responsesReceived}/{numPlayers}
      </p>
    </GradientBackground>
  );
}
