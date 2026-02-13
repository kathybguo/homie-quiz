import { socket } from "../../socket.js";
import { useNavigate } from "react-router-dom";
import GradientBackground from "../../components/GradientBackground/GradientBackground.jsx";
import styles from "./Landing.module.css";

export default function Landing() {
  const navigate = useNavigate();

  const createSession = () => {
    console.log("Creating session...");
    socket.emit("create-session");

    socket.once("session-created", (code) => {
      navigate(`/${code}`);
    });
  };

  const joinSession = () => {
    navigate("/join");
  };

  return (
    <GradientBackground variant="host-landing">
      <div className={styles.splitContainer}>
        <button
          className={`${styles.halfButton} ${styles.left}`}
          onClick={createSession}
        >
          <span className={styles.buttonText}>Host</span>
        </button>

        <button
          className={`${styles.halfButton} ${styles.right}`}
          onClick={joinSession}
        >
          <span className={styles.buttonText}>Join</span>
        </button>
      </div>
    </GradientBackground>
  );
}
