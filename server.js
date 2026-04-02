const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// ROOT FIX
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

let players = {};

io.on("connection", (socket) => {
  socket.on("join", (name) => {
    players[socket.id] = { name, score: 0 };
    io.emit("updatePlayers", players);
  });
});

// 🔑 PORT FIX
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
