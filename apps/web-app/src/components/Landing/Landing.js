import React from "react";
import { socket } from "../../socket.js";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const createSession = () => {
    console.log("Creating session...");
    socket.emit("create-session");

    socket.once("session-created", (code) => {
      navigate(`/${code}`);
    });
  };

  return (
    <div>
      <h1>The Realest</h1>
      <button onClick={createSession}>Host a Game</button>
      <button onClick={() => navigate("/join")}>Join a Game</button>
    </div>
  );
}
