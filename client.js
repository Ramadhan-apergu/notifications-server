const { io } = require("socket.io-client");

const socket = io("http://localhost:8000/dashboard");

socket.on('notification:dashboard', (data) => {
  console.log(data);
});

socket.on("disconnect", () => {
  console.log("Terputus dari server");
});
