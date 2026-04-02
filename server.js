const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// WAJIB: serve public folder
app.use(express.static("public"));

// WAJIB: route root
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

let players = {};
let buzzed = null;
let buzzerOpen = false;

io.on("connection", (socket) => {
  socket.on("join", (name) => {
    players[socket.id] = { name, score: 0 };
    io.emit("updatePlayers", players);
  });

  socket.on("buzz", () => {
    if (!buzzerOpen || buzzed) return;

    buzzed = socket.id;
    io.emit("buzzResult", { winner: buzzed });
  });

  socket.on("startBuzz", () => {
    buzzed = null;
    buzzerOpen = true;
    io.emit("resetBuzz");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
