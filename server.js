const PORT = process.env.PORT || 4100;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./config/db");
const app = express();
const http = require("http");
const socketio = require("socket.io");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./controller/chat-room");
const router = require("./routes/chat-room");
const auth = require("./routes/auth");
app.use("/auth", auth);

app.listen(PORT, function () {
  console.log("App started");
});
app.get("/", (req, res) => {
  res.json("welcome!!");
});
//chat-room
const server = http.createServer(app);
const io = socketio(server);

io.on("connect", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}.`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});
server.listen(5000, () => console.log(`Server has started.`));

// video-meet
const socket = require("./lib/socket");
app.use("/", express.static(`${__dirname}/../client/dist`));

// server.listen(6000, () => {
//   socket(server);
//   console.log("Server is listening at port 6000");
// });
