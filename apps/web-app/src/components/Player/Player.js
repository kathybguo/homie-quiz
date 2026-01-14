import { useParams } from "react-router-dom";
import { socket } from "../../socket.js";
import { useEffect, useState } from "react";
import { GAME_STATES } from "@hq/utils";

export default function Player() {
  const { code } = useParams();
  const [gameState, setGameState] = useState(GAME_STATES.WAITING);
  const [answer, setAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState({}); // key: player's socketId, value: object with playerName and answer
  const [unusedLabels, setUnusedLabels] = useState([]); // player name labels the player can still use
  const [labelAssignments, setLabelAssignments] = useState({}); // key: answer's acutal author's socketId, value: guessed author's socketId
  const [error, setError] = useState("");
  const currentSocketId = socket.id;

  useEffect(() => {
    socket.on("prompt-phase", (response) => {
      console.log("received response:", response);
      setGameState(GAME_STATES.PROMPTING);
    });

    socket.on("labeling-phase", (response) => {
      setAllAnswers(response.answers);
      setUnusedLabels(
        Object.values(response.answers).map((obj) => obj.playerName)
      ); // extract player names from allAnswers
      setGameState(GAME_STATES.LABELING);
    });

    socket.on("reveal-phase", () => {
      setGameState(GAME_STATES.REVEAL);
    });

    socket.on("scores-phase", () => {
      setGameState(GAME_STATES.SCORES);
    });

    socket.on("game-over", () => {
      setGameState(GAME_STATES.GAME_OVER);
    });

    return () => {
      socket.off("prompt-phase");
      socket.off("labeling-phase");
      socket.off("reveal-phase");
      socket.off("scores-phase");
      socket.off("game-over");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim() === "") {
      setError("Answer cannot be empty");
      return;
    }
    socket.emit("submit-answer", { code: code, answer: answer });
    setGameState(GAME_STATES.WAITING);
    setError("");
  };

  const handleLabel = (e) => {
    // remove label from unusedLabels
    const label = e.target.innerText;
    setUnusedLabels(unusedLabels.filter((l) => l !== label));
    // store this label somewhere and render the answer as labeled
  };

  const handleLabelSubmit = (e) => {
    e.preventDefault();
    // check that all answers have been labeled
    // if (unusedLabels.length > 0) {
    //   setError("Please label all answers before submitting");
    //   return;
    // }
    socket.emit("submit-labels", { code: code });
    // setError("");
    setGameState(GAME_STATES.WAITING);
  };

  if (gameState === GAME_STATES.PROMPTING) {
    return (
      <div>
        Player Prompting Phase
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="answer..."
              onChange={(e) => setAnswer(e.target.value)}
            />
            {error && <span className="error">{error}</span>}
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
  } else if (gameState === GAME_STATES.LABELING) {
    return (
      <div>
        {/*
        render all the answers to label as buttons 
        so in label state need
        to have server emit all the answers
        once selected, show more buttons underneath to guess the author
        only allow one selection per answer
        submit button only enabled once all answers have been labeled 
        */}
        <h1>Label the Answers</h1>
        {Object.entries(allAnswers).map(([socketId, answerObj]) => (
          <div key={socketId}>
            <button>
              <h3>{answerObj.answer}</h3>
            </button>
          </div>
        ))}

        {unusedLabels.map((label, index) => (
          <button key={index} onClick={handleLabel}>
            {label}
          </button>
        ))}
        <form onSubmit={handleLabelSubmit}>
          {error && <span className="error">{error}</span>}
          <button type="submit">Submit Labels</button>
        </form>
      </div>
    );
  } else if (gameState === GAME_STATES.REVEAL) {
    return (
      <div>
        <h1>Reveal Phase</h1>
        {/* show all answers next to authors and labelers below */}

      </div>
    );
  } else if (gameState === GAME_STATES.SCORES) {
    return (
      <div>
        <h1>Player Scores Phase</h1>
        {/* show just your own ranking and score
        maybe with an emoji/meme depending on where in the ranks you stand */}
      </div>
    );
  } else if (gameState === GAME_STATES.GAME_OVER) {
    return (
      <div>
        <h1>Game Over</h1>
        <h3>You placed _th with score _</h3>
      </div>
    );
  }
  return <div>Waiting for other players...</div>;
}
