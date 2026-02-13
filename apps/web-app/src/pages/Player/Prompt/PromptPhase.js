import { useState } from "react";
import { socket } from "../../../socket.js";
import styles from "./PromptPhase.module.css";
import InputField from "../../../components/InputField/InputField.jsx";
import Button from "../../../components/Button/Button.jsx";
import GradientBackground from "../../../components/GradientBackground/GradientBackground.jsx";

export default function PromptPhase({ sessionCode, onSubmitComplete, name }) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim() === "") {
      setError("Answer cannot be empty");
      return;
    }
    socket.emit("submit-answer", {
      code: sessionCode,
      answer: answer,
      name: name,
    });
    setError("");
    onSubmitComplete();
  };

  return (
    <GradientBackground variant="player-waiting">
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <InputField
            variant="glass"
            placeholder="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            error={error}
          ></InputField>
          {error && <span className="error">{error}</span>}
          <Button variant="glass" size="s" type="submit">
            Submit
          </Button>
        </form>
      </div>
    </GradientBackground>
  );
}
