import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../../socket.js";
import { useEffect, useState } from "react";
import { GAME_STATES } from "@hq/utils";
import RevealPhase from "./Reveal/RevealPhase.js";
import ScoresPhase from "./Scores/ScoresPhase.js";

export default function Host() {
  const { code } = useParams();
  const [playerNames, setPlayerNames] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATES.WAITING);
  const [prompt, setPrompt] = useState("");
  const [responsesReceived, setResponsesReceived] = useState(0);
  const [allAnswers, setAllAnswers] = useState({}); // prompt answers
  const [allLabels, setAllLabels] = useState({});
  const [playerScores, setPlayerScores] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      alert("Connection to server lost. Returning to home page.");
      navigate("/");
    });

    socket.on("player-joined", (response) => {
      setPlayerNames(response.players);
    });

    socket.on("prompt-phase", (response) => {
      setPrompt(response.prompt);
      setGameState(GAME_STATES.PROMPTING);
    });

    socket.on("labeling-phase", (response) => {
      setGameState(GAME_STATES.LABELING);
      setResponsesReceived(0);
      setAllAnswers(response.answers);
    });

    socket.on("reveal-phase", (response) => {
      setGameState(GAME_STATES.REVEAL);
      setResponsesReceived(0);
      setAllLabels(response.guessedLabels);
    });

    socket.on("scores-phase", (response) => {
      setGameState(GAME_STATES.SCORES);
      setPlayerScores(response.playerScores);
    });

    socket.on("game-over", () => {
      setGameState(GAME_STATES.GAME_OVER);
    });

    socket.on("responses-received", (response) => {
      setResponsesReceived(response.numResponses);
    });

    if (code) {
      console.log("Emitting host-rejoin-session...");
      socket.emit("rejoin-host", { code });
    }

    socket.on("rejoin-host-success", (response) => {
      console.log("Host successfully rejoined");
      setGameState(response.gameState);
      setPlayerNames(response.playerNames);
      setAllAnswers(response.allAnswers);
      setAllLabels(response.allLabels);
      setPlayerScores(response.playerScores);
      setPrompt(response.round?.prompt);
      setResponsesReceived(response.numResponses);
    });

    socket.on("new-game", (response) => {
      setGameState(response.gameState);
      setPlayerNames(response.playerNames);
    });

    return () => {
      socket.off("disconnect");
      socket.off("player-joined");
      socket.off("prompt-phase");
      socket.off("labeling-phase");
      socket.off("reveal-phase");
      socket.off("scores-phase");
      socket.off("game-over");
      socket.off("responses-received");
      socket.off("rejoin-host-success");
      socket.off("play-again");
    };
  }, [code, navigate]);

  const startGame = () => {
    socket.emit("start-game", { code: code });
  };

  const finishedReveal = () => {
    socket.emit("finished-reveal", { code: code });
  };

  const finishedScores = () => {
    socket.emit("finished-scores", { code: code });
  };

  const playAgain = () => {
    socket.emit("play-again", { code: code });
  };

  const endGame = () => {
    socket.emit("end-game", { code: code });
    navigate("/");
  };
  const numPlayers = playerNames.length;

  if (gameState === GAME_STATES.WAITING) {
    return (
      <div>
        <h1>Lobby</h1>
        <h2>Join at www.friendquiz.com</h2>
        <h2>Session Code: {code}</h2>

        {numPlayers > 0 ? (
          <h2>Players:</h2>
        ) : (
          <p>waiting for players to join...</p>
        )}
        <ul>
          {playerNames.map((playerName) => (
            <li key={playerName}>{playerName}</li>
          ))}
        </ul>

        {numPlayers >= 1 && <button onClick={startGame}>Start Game</button>}
      </div>
    );
  }

  if (gameState === GAME_STATES.PROMPTING) {
    return (
      <div>
        <h1>{prompt}</h1>
        <h3>
          {responsesReceived}/{numPlayers} responses
        </h3>
      </div>
    );
  }

  if (gameState === GAME_STATES.LABELING) {
    return (
      <div>
        <h1>Labeling Phase</h1>
        {Object.values(allAnswers).map((answer, index) => (
          <div key={index}>
            <p>{answer}</p>
          </div>
        ))}
        <h3>
          {responsesReceived}/{numPlayers} responses
        </h3>
      </div>
    );
  }

  if (gameState === GAME_STATES.REVEAL) {
    return (
      <RevealPhase
        allAnswers={allAnswers}
        allLabels={allLabels}
        onComplete={finishedReveal}
      />
    );
  }

  if (gameState === GAME_STATES.SCORES) {
    return (
      <ScoresPhase
        playerScores={playerScores}
        onComplete={finishedScores}
      ></ScoresPhase>
    );
  }

  if (gameState === GAME_STATES.GAME_OVER) {
    return (
      <div>
        <h1>Game Over</h1>
        <button onClick={playAgain}>play again?</button>
        <button onClick={endGame}>finished</button>
      </div>
    );
  } else {
    console.log(`clearly game state is ${gameState}`);
    return <h1>urmmmm</h1>;
  }
}
