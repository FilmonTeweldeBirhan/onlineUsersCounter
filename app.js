const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serving my static file
app.use(express.static(`${__dirname}/public`));

const onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log("A user has connected!.");

  // Add the user to the unique set
  onlineUsers.add(socket.id);

  // Broadcast the updated users list to All
  io.emit("updateOnlineUsers", Array.from(onlineUsers), onlineUsers.size);

  // Update users when they disconnect too!
  socket.on("disconnect", () => {
    console.log("User has disconnected...what a shame!");

    // Then update accordingly by removing the user from the onlineUsers set
    onlineUsers.delete(socket.id);

    // Then again broadcast the updated users list to All
    io.emit("updateOnlineUsers", Array.from(onlineUsers), onlineUsers.size);
  });
});

server.listen(3000, () => {
  console.log("Listening port on http://127.0.0.1:3000...");
});
