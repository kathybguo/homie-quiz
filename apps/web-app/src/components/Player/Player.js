import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../../socket.js";
import { useEffect, useState } from "react";
import { GAME_STATES } from "@hq/utils";
import LabelPhase from "./Label/LabelPhase.js";
import PromptPhase from "./Prompt/PromptPhase.js";
import RevealPhase from "./Reveal/RevealPhase.js";

export default function Player() {
  const { code, name } = useParams();
  const [gameState, setGameState] = useState(GAME_STATES.WAITING);
  const [allAnswers, setAllAnswers] = useState({}); // key: player's socketId, value: answer
  const [playerNames, setPlayerNames] = useState({}); // key: socketId value: player name
  const [allLabels, setAllLabels] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect running, code:", code, "name:", name);
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      // Optionally show an alert or message
      alert("Connection to server lost. Returning to home page.");
      navigate("/");
    });

    socket.on("prompt-phase", (response) => {
      console.log("received response:", response);
      setGameState(GAME_STATES.PROMPTING);
    });

    socket.on("labeling-phase", (response) => {
      setAllAnswers(response.answers);
      setPlayerNames(response.playerNames);
      setGameState(GAME_STATES.LABELING);
    });

    socket.on("reveal-phase", (response) => {
      setGameState(GAME_STATES.REVEAL);
      setAllLabels(response.guessedLabels);
    });

    socket.on("scores-phase", () => {
      setGameState(GAME_STATES.SCORES);
    });

    socket.on("game-over", () => {
      setGameState(GAME_STATES.GAME_OVER);
    });

    socket.on("rejoin-success", (response) => {
      console.log("Rejoined successfully:", response);

      setGameState(response.gameState);
      setAllAnswers(response.allAnswers);
      setPlayerNames(response.players);
      setAllLabels(response.allLabels);
    });

    if (code && name) {
      console.log("Emitting rejoin-session...");
      socket.emit("rejoin-session", { code, name });
    }

    return () => {
      socket.off("disconnect");
      socket.off("prompt-phase");
      socket.off("labeling-phase");
      socket.off("reveal-phase");
      socket.off("scores-phase");
      socket.off("game-over");
      socket.off("rejoin-success");
    };
  }, []);

  const handleSubmitComplete = () => {
    setGameState(GAME_STATES.WAITING);
  };

  if (gameState === GAME_STATES.PROMPTING) {
    return (
      <PromptPhase sessionCode={code} onSubmitComplete={handleSubmitComplete} />
    );
  } else if (gameState === GAME_STATES.LABELING) {
    return (
      <LabelPhase
        allAnswers={allAnswers}
        sessionCode={code}
        playerNames={playerNames}
        onSubmitComplete={handleSubmitComplete}
      ></LabelPhase>
    );
  } else if (gameState === GAME_STATES.REVEAL) {
    return (
      <RevealPhase
        allAnswers={allAnswers}
        allLabels={allLabels}
        playerNames={playerNames}
      ></RevealPhase>
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
