import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../../socket.js";
import { useEffect, useState } from "react";
import { GAME_STATES } from "@hq/utils";
import LabelPhase from "./Label/LabelPhase.js";
import PromptPhase from "./Prompt/PromptPhase.js";
import RevealPhase from "./Reveal/RevealPhase.js";
import Waiting from "./Waiting/Waiting.js";
import Scores from "./Scores/Scores.js";

export default function Player() {
  const { code, name } = useParams();
  const [gameState, setGameState] = useState(GAME_STATES.WAITING);
  const [allAnswers, setAllAnswers] = useState({});
  const [playerNames, setPlayerNames] = useState({});
  const [allLabels, setAllLabels] = useState({});
  const [playerScore, setPlayerScore] = useState(null);
  const [playerRank, setPlayerRank] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect running, code:", code, "name:", name);
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
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
      // Request scores when entering scores phase
      socket.emit("get-player-score", { code, name });
    });

    socket.on("game-over", () => {
      setGameState(GAME_STATES.GAME_OVER);
      // Request final score and rank
      socket.emit("get-player-score", { code, name });
    });

    socket.on("player-score", (response) => {
      console.log("Received player score:", response);
      setPlayerScore(response.score);
      setPlayerRank(response.rank);
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
      socket.off("player-score");
    };
  }, [code, name, navigate]);

  const handleSubmitComplete = () => {
    setGameState(GAME_STATES.WAITING);
  };

  if (gameState === GAME_STATES.PROMPTING) {
    return (
      <PromptPhase
        sessionCode={code}
        onSubmitComplete={handleSubmitComplete}
        name={name}
      />
    );
  } else if (gameState === GAME_STATES.LABELING) {
    return (
      <LabelPhase
        allAnswers={allAnswers}
        sessionCode={code}
        playerNames={playerNames}
        onSubmitComplete={handleSubmitComplete}
        name={name}
      />
    );
  } else if (gameState === GAME_STATES.REVEAL) {
    return (
      <RevealPhase
        allAnswers={allAnswers}
        allLabels={allLabels}
        playerNames={playerNames}
      />
    );
  } else if (
    gameState === GAME_STATES.SCORES ||
    gameState === GAME_STATES.GAME_OVER
  ) {
    return <Scores score={playerScore} rank={playerRank} />;
  }
  return <Waiting />;
}
