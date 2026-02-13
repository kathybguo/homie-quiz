import { useState } from "react";
import { socket } from "../../../socket.js";

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
    <div>
      <h1>Answer the Prompt</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          {error && <span className="error">{error}</span>}
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
