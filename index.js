const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const uuidv1 = require('uuid');


//cors
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // User connected
  console.log(`user connected : ${socket.id}`);

  // Add user to the chat queue
  addToChatQueue(socket.id);

  // Handle join room event
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  // Handle send message event
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });


  // Handle peer id
  socket.on("peerid", (data) => {
    socket.to(data.room).emit("peer_reciver", data);
  });

  // function HandleUserRoom(data1,data2) {
  //  io.to(socketId).emit(/* ... */);
  // }
});

server.listen(3001, () => {
  console.log("Server is running");
});

const chatQueue = [];

function addToChatQueue(user) {
  chatQueue.push(user);

  if (chatQueue.length >= 2) {
    const user1 = chatQueue.shift();
    const user2 = chatQueue.shift();
    //uiid
     const newUUID = uuidv1.v4();

    // Match user1 and user2
    console.log(`Matching ${user1} with ${user2}`);
    // HandleUserRoom(user1 , user2);
    io.to(user1).emit("sendUserRoom", newUUID);
    io.to(user2).emit("sendUserRoom", newUUID);
  }
}


