require('dotenv').config()
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const PORT = 5000;

// Initialise express
const app = express();

// To fix cors related issues
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // Socket listening for join room command
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  // Socket listening for send message command
  socket.on("send_message", (data) => {
    // Socket emiting receive message command
    socket.to(data.room).emit("receive_message", data);
  });

  // Socket listening for disconnect command
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT || PORT, () => {
  console.log("Server running on port", PORT);
});
