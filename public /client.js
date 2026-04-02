const socket = io();

let myId = null;

function join() {
  const name = document.getElementById("name").value;

  socket.emit("join", name);

  document.getElementById("login").classList.add("hidden");
  document.getElementById("buzzer").classList.remove("hidden");

  document.getElementById("playerName").innerText = name;
}

document.getElementById("buzzer").addEventListener("click", () => {
  socket.emit("buzz");
});

socket.on("buzzResult", ({ winner, players }) => {
  const buzzer = document.getElementById("buzzer");

  if (winner === socket.id) {
    buzzer.style.background = "green";
  } else {
    buzzer.style.background = "red";
  }
});

socket.on("resetBuzz", () => {
  document.getElementById("buzzer").style.background = "gray";
});

socket.on("updatePlayers", (players) => {
  if (players[socket.id]) {
    document.getElementById("score").innerText =
      players[socket.id].score;
  }
});
