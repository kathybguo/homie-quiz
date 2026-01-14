import { useParams } from "react-router-dom";
import { socket } from "../../socket.js";
import { useEffect, useState } from "react";
import { GAME_STATES } from "@hq/utils";

export default function Host() {
  const { code } = useParams();
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATES.WAITING);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    socket.on("player-joined", (updatedPlayers) => {
      setPlayers((currPlayers) => [...currPlayers, updatedPlayers.name]);

      socket.on("prompt-phase", (response) => {
        console.log("received response:", response);
        setPrompt(response.prompt);
        setGameState(GAME_STATES.PROMPTING);
      });

      socket.on("labeling-phase", () => {
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
    });
    return () => {
      socket.off("player-joined");
      socket.off("prompt-phase");
      socket.off("labeling-phase");
      socket.off("reveal-phase");
      socket.off("scores-phase");
      socket.off("game-over");
    };
  }, []);

  const startGame = () => {
    socket.emit("start-game", { code: code });
  };

  const finishedPrompting = () => {
    socket.emit("finished-prompting", { code: code });
  };

  const finishedReveal = () => {
    console.log("finished reveal submitted");
    socket.emit("finished-reveal", { code: code });
  };

  const finishedScores = () => {
    socket.emit("finished-scores", { code: code });
  };

  if (gameState === GAME_STATES.WAITING) {
    return (
      <div>
        <h1>Lobby</h1>
        <h2>Join at www.friendquiz.com</h2>
        <h2>Session Code: {code}</h2>

        {players.length > 0 ? (
          <h2>Players:</h2>
        ) : (
          <p>waiting for players to join...</p>
        )}
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>

        {players.length >= 1 && <button onClick={startGame}>Start Game</button>}
      </div>
    );
  }

  if (gameState === GAME_STATES.PROMPTING) {
    return (
      <div>
        <h1>{prompt}</h1>
        <button onClick={finishedPrompting}>Done</button>
      </div>
    );
  }

  if (gameState === GAME_STATES.LABELING) {
    return (
      <div>
        <h1>Labeling Phase</h1>
      </div>
    );
  }

  if (gameState === GAME_STATES.REVEAL) {
    return (
      <div>
        <h1>Reveal Phase</h1>
        <button onClick={finishedReveal}>Done</button>
      </div>
    );
  }

  if (gameState === GAME_STATES.SCORES) {
    return (
      <div>
        <h1>Scores Phase</h1>
        <button onClick={finishedScores}>Done</button>
      </div>
    );
  }

  if (gameState === GAME_STATES.GAME_OVER) {
    return (
      <div>
        <h1>Game Over</h1>
        <button
          onClick={() => {
            socket.emit("play-again", { code: code });
          }}
        >
          play again?
        </button>
      </div>
    );
  }
}
