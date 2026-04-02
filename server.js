const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};
let buzzed = null;
let buzzerOpen = false;
let history = [];

io.on("connection", (socket) => {

  socket.on("join", (name) => {
    players[socket.id] = { name, score: 0 };
    io.emit("updatePlayers", players);
  });

  socket.on("buzz", () => {
    if (!buzzerOpen || buzzed) return;

    buzzed = socket.id;
    io.emit("buzzResult", {
      winner: buzzed,
      players
    });
  });

  socket.on("startBuzz", () => {
    buzzed = null;
    buzzerOpen = true;
    io.emit("resetBuzz");
  });

  socket.on("stopBuzz", () => {
    buzzerOpen = false;
  });

  socket.on("score", ({ id, value }) => {
    if (!players[id]) return;

    history.push(JSON.stringify(players));

    players[id].score += value;
    io.emit("updatePlayers", players);

    io.emit("scoreFlash", { id, value });
  });

  socket.on("undo", () => {
    if (history.length > 0) {
      players = JSON.parse(history.pop());
      io.emit("updatePlayers", players);
    }
  });

  socket.on("resetScore", () => {
    Object.keys(players).forEach(id => {
      players[id].score = 0;
    });
    io.emit("updatePlayers", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
