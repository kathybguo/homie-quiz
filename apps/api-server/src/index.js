import { Session } from "./Session.js";
import { createRequire } from "module";
import { GAME_STATES } from "utils";
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
    sessions[sessionCode] = new Session(sessionCode, socket.id);
    socket.join(sessionCode);
    socket.emit("session-created", sessionCode);
  });

  socket.on("join-session", ({ code, name }) => {
    if (code in sessions) {
      const session = sessions[code];
      session.addPlayer(socket.id, name);
      socket.join(code); // Join the socket.io room for this session
      socket.emit("join-success", { code });
      io.to(code).emit("player-joined", { name, players: session.playerNames });
    } else {
      socket.emit("join-failure", { message: "Session not found" });
    }
  });

  socket.on("start-game", ({ code }) => {
    if (code in sessions) {
      const session = sessions[code];
      session.start();
      io.to(code).emit("prompt-phase", { prompt: session.currentRound.prompt });
    } else {
      socket.emit("start-failure", { message: "Session not found" });
    }
  });

  socket.on("finished-prompting", ({ code }) => {
    if (code in sessions) {
      const session = sessions[code];
      session.state = GAME_STATES.LABELING;
      io.to(code).emit("labeling-phase", {
        roundAnswers: session.currentRound.answers,
      });
    }
  });

  socket.on("finished-labeling", ({ code }) => {
    if (code in sessions) {
      const session = sessions[code];
      session.state = GAME_STATES.REVEAL;
      io.to(code).emit("reveal-phase");
    }
  });

  socket.on("finished-reveal", ({ code }) => {
    if (code in sessions) {
      const session = sessions[code];
      session.state = GAME_STATES.SCORES;
      io.to(code).emit("scores-phase");
    }
  });

  socket.on("finished-scores", ({ code }) => {
    if (code in sessions) {
      const session = sessions[code];
      session.completeRound();
      if (session.state === GAME_STATES.OVER) {
        io.to(code).emit("game-over");
      } else {
        io.to(code).emit("prompt-phase", {
          prompt: session.currentRound.prompt,
        });
      }
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
