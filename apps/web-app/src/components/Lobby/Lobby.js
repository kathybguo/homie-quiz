import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import { useEffect, useState } from "react";

export default function Lobby() {
  const { code } = useParams();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on("player-joined", (updatedPlayers) => {
      setPlayers((currPlayers) => [...currPlayers, updatedPlayers.name]);
      console.log("Players in lobby from backedn", updatedPlayers);
      console.log("Current players state:", players);
    });
    return () => {
      socket.off("player-joined");
    };
  }, []);

  const startGame = () => {
    socket.emit("start-game", { code: code });
  };
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

      {players.length >= 3 && <button onClick={startGame}>Start Game</button>}
    </div>
  );
}
