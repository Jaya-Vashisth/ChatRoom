const { getUsers, users } = require("./getUser");

//socket connection

function socket(io) {
  io.on("connection", (socket) => {
    socket.on("joined-user", (data) => {
      //store users connected in a room in memory
      var user = {};
      user[socket.id] = data.username;

      if (users[data.roomname]) users[data.roomname].push(user);
      else users[data.roomname] = [user];

      //joining the socket room
      socket.join(data.roomname);

      //emit new username to clients
      io.to(data.roomname).emit("joined-user", { username: data.username });

      //sending online users array
      io.to(data.roomname).emit("online-users", getUsers(users[data.roomname]));
    });

    //emmititng message to clients
    socket.on("chat", (data) => {
      io.to(data.roomname).emit("chat", {
        username: data.username,
        message: data.message,
      });
    });

    //broadcasting the user who is typing
    socket.on("typing", (data) => {
      socket.broadcast.to(data.roomname).emit("typing", data.username);
    });

    //remove user from memory when they disconnet
    socket.on("disconnecting", () => {
      var rooms = object.keys(socket.rooms);
      var socketid = rooms[0];
      var roomname = rooms[1];
      users[roomname].forEach((user, index) => {
        if (user[socketid]) users[roomname].splice(index, 1);
      });

      //send online user array
      io.to(data.roomname).emit("online-users", getUsers(user[roomname]));
    });
  });
}

module.exports = socket;
