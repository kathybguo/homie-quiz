import { useParams } from "react-router-dom";
import { socket } from "../../socket.js";
import { useEffect, useState } from "react";
import { GAME_STATES } from "@hq/utils";
import LabelPhase from "./Label/LabelPhase.js";
import PromptPhase from "./Prompt/PromptPhase.js";

export default function Player() {
  const { code } = useParams();
  const [gameState, setGameState] = useState(GAME_STATES.WAITING);
  const [answer, setAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState({}); // key: player's socketId, value: answer
  const [playerNames, setPlayerNames] = useState({}); // key: socketId value: player name
  const [error, setError] = useState("");

  useEffect(() => {
    socket.on("prompt-phase", (response) => {
      console.log("received response:", response);
      setGameState(GAME_STATES.PROMPTING);
    });

    socket.on("labeling-phase", (response) => {
      // filter out own answer
      const filteredAnswers = Object.fromEntries(
        Object.entries(response.answers).filter(
          ([key, value]) => key !== socket.id
        )
      );
      console.log("all", response.answers);
      console.log(filteredAnswers);

      const filteredNames = Object.fromEntries(
        Object.entries(response.playerNames).filter(
          ([key, vavlue]) => key !== socket.id
        )
      );

      setAllAnswers(filteredAnswers);
      setPlayerNames(filteredNames);
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
        playerNames={Object.values(playerNames)}
        onSubmitComplete={handleSubmitComplete}
      ></LabelPhase>
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
