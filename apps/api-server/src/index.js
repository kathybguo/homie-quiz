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

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });

  socket.on("create-session", () => {
    const sessionCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    console.log(`Session created with code: ${sessionCode}`);
    socket.emit("session-created", sessionCode);
  });
});

server.listen(PORT, () => {
  console.log(`server listening on *:${PORT}`);
});
