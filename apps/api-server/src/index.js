import { Session } from "./Session.js";
import { createRequire } from "module";
import { GAME_STATES } from "@hq/utils";
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
    for (const [code, session] of Object.entries(sessions)) {
      if (session.hostSocketId === socket.id) {
        console.log(`Host disconnected from session ${code}`);
        session.hostSocketId = null;
      }
    }
  });

  socket.on("rejoin-host", ({ code }) => {
    console.log(`${code} host rejoin attempt`);
    if (code in sessions) {
      const session = sessions[code];

      // only allow rejoin if no host is currently connected
      if (session.hostSocketId !== null) {
        console.log(" host is already connected to this session");
        socket.emit("womp-womp", { message: "host already connected" });
        return;
      }
      let numResponses = 0;

      if (session.state == GAME_STATES.PROMPTING) {
        numResponses = session.currentRound?.answers
          ? Object.keys(session.currentRound.answers).length
          : 0;
      } else if (session.state == GAME_STATES.LABELING) {
        numResponses = session.currentRound?.labels
          ? Object.keys(session.currentRound.labels).length
          : 0;
      }

      // no host connected, this socket becomes the new host
      session.hostSocketId = socket.id;
      socket.join(code);
      console.log(` host rejoin success`);
      console.log(` current round responses ${numResponses}`);
      socket.emit("rejoin-host-success", {
        gameState: session.state,
        playerNames: session.playerNames,
        allAnswers: session.currentRound?.answers ?? {},
        allLabels: session.currentRound?.labels ?? {},
        playerScores: session.playerScores,
        round: session.currentRound ?? null,
        numResponses: numResponses,
      });
    } else {
      console.log(`Host rejoin failure session ${code} not found`);
    }
  });

  socket.on("create-session", () => {
    const sessionCode = generateUniqueCode();
    sessions[sessionCode] = new Session(sessionCode, socket.id);
    socket.join(sessionCode);
    socket.emit("session-created", sessionCode);
    console.log(`+ created game ${sessionCode}`);
  });

  socket.on("join-session", ({ code, name }) => {
    if (code in sessions) {
      const session = sessions[code];
      if (Object.values(session.playerNames).includes(name)) {
        socket.emit("join-failure", {
          message: `name ${name} already taken in this session`,
        });
        return;
      }
      session.addPlayer(socket.id, name);
      socket.join(code); // Join the socket.io room for this session
      socket.emit("join-success", { code });
      io.to(code).emit("player-joined", { players: session.playerNames });
      console.log(`+ ${name} joined game ${code} with socketid ${socket.id}`);
    } else {
      socket.emit("join-failure", { message: "Session not found" });
    }
  });

  socket.on("rejoin-session", ({ code, name }) => {
    console.log(
      `${code} session rejoin for ${name} with socketid ${socket.id}`,
    );
    if (code in sessions) {
      const session = sessions[code];
      console.log(` game ${code} is in ${session.state} state`);
      if (Object.values(session.playerNames).includes(name)) {
        if (!session.state || session.state === GAME_STATES.WAITING) {
          console.log(" ignored rejoin due to first navigate");
          return; // ignore rejoin trigger on first navigate
        }
        console.log(`${name} rejoining game ${code}`);
        socket.join(code);
        // check if player already answered for label or answer
        const gameState = session.state;
        if (
          (session.state == GAME_STATES.PROMPTING &&
            name in session.currentRound.answers) ||
          (session.state == GAME_STATES.LABELING &&
            name in session.currentRound.labels)
        ) {
          gameState = GAME_STATES.WAITING;
        }

        socket.emit("rejoin-success", {
          code: code,
          gameState: gameState,
          players: session.playerNames ?? {},
          allAnswers: session.currentRound?.answers ?? {},
          allLabels: session.currentRound?.labels ?? {},
        });
      } else {
        console.log("rejoin failed, invalid player name");
      }
    } else {
      console.log("rejoin failed, invalid session code");
    }
  });

  socket.on("start-game", ({ code }) => {
    if (code in sessions) {
      const session = sessions[code];
      session.start();
      io.to(code).emit("prompt-phase", { prompt: session.currentRound.prompt });
    } else {
      socket.emit("start-failure", { message: "Session not found" });
      console.log(`urm FAKE CODE ALERT wtf is ${code}`);
    }
  });

  socket.on("submit-answer", ({ code, answer }) => {
    if (code in sessions) {
      const session = sessions[code];
      const round = session.currentRound;
      if (socket.id in round.answers) {
        console.log("shoould be impossible case???");
        return;
      }
      round.answers[socket.id] = answer;
      io.to(session.hostSocketId).emit("responses-received", {
        numResponses: Object.keys(round.answers).length,
      });
      if (session.numPlayers == Object.keys(round.answers).length) {
        // all players have submitted answers
        session.state = GAME_STATES.LABELING;
        io.to(code).emit("labeling-phase", {
          answers: round.answers,
          playerNames: session.playerNames,
        });
      }
    }
  });

  socket.on("submit-labels", ({ code, assignments }) => {
    if (code in sessions) {
      const session = sessions[code];
      const round = session.currentRound;
      round.labels[socket.id] = assignments;
      io.to(session.hostSocketId).emit("responses-received", {
        numResponses: Object.keys(round.labels).length,
      });
      if (session.numPlayers == Object.keys(round.labels).length) {
        // Generate fake guesses for actual authors
        for (const answerAuthorId of Object.keys(round.answers)) {
          const otherPlayerIds = Object.keys(session.playerNames).filter(
            (id) => id !== answerAuthorId,
          );
          const randomPlayerId =
            otherPlayerIds[Math.floor(Math.random() * otherPlayerIds.length)];
          round.labels[answerAuthorId][answerAuthorId] = randomPlayerId;
        }
        session.state = GAME_STATES.REVEAL;
        io.to(code).emit("reveal-phase", {
          guessedLabels: round.labels,
        });
      }
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
    console.log(`going to scores for game ${code}`);
    if (code in sessions) {
      const session = sessions[code];
      session.state = GAME_STATES.SCORES;
      session.updateScoresFromRound();
      console.log("calculated scores");
      io.to(code).emit("scores-phase", {
        playerScores: session.playerScores,
      });
      console.log("emitted scores-phase");
    } else {
      console.log("finished-reveal session not found for code:", code);
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

  socket.on("play-again", ({ code }) => {
    if (code in sessions) {
      const session = sessions[code];
      session.reset();
    } else {
      socket.emit("play-again-failure", { message: "Session not found" });
      console.log("session not found for play again, should be impossible");
    }
  });

  socket.on("testing", () => {
    console.log("hailoooooo test worked!! you've reached our server");
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
