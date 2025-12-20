import { Session } from "./Session.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://localhost:3000"],
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 2000;

const sessions = {};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("create-session", () => {
    const sessionCode = generateUniqueCode();
    sessions[sessionCode] = new Session(sessionCode);
    socket.join(sessionCode);
    console.log(`Session created with code: ${sessionCode}`);
    socket.emit("session-created", sessionCode);
    console.log(sessions);
  });

  socket.on("join-session", ({ code, name }) => {
    console.log(`Attempt to join session with code: ${code} and name: ${name}`);
    if (code in sessions) {
      const session = sessions[code];
      session.addPlayer(socket.id, name);
      socket.join(code); // Join the socket.io room for this session
      console.log(`${name} joined session ${code}`);
      socket.emit("join-success", { code });
      io.to(code).emit("player-joined", { name, players: session.playerNames });
    } else {
      console.log(`Session with code ${code} not found`);
      console.log(sessions);
      socket.emit("join-failure", { message: "Session not found" });
    }
  });

  socket.on("start-game", ({ code }) => {
    if (code in sessions) {
      const session = sessions[code];
      session.start();
      io.to(code).emit("game-started", { message: "Game has started!" });
      console.log(`Game started for session ${code}`);
    } else {
      console.log(`Session with code ${code} not found`);
      socket.emit("start-failure", { message: "Session not found" });
    }
  });

  socket.on("end-game", ({ code }) => {
    delete games[code];
  });
});

function generateUniqueCode() {
  let code;
  do {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
  } while (sessions[code]); // Keep generating until we find one that doesn't exist

  return code;
}

server.listen(PORT, () => {
  console.log(`server listening on *:${PORT}`);
});
