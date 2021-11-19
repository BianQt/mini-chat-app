"use strict";
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const io = require("socket.io")(server);
const users = {};
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("new-user", (userName) => {
    users[socket.id] = userName;
    console.log(userName);
    socket.broadcast.emit("user-connected", userName);
    io.emit("users-list", users);

  });

  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
    io.emit("users-list", users);
  });
});

server.listen(port, () => {
  console.log("Server is running on port 8000");
});
