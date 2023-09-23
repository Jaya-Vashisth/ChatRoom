//get html element
const output = document.getElementById("output");
const message = document.getElementById("message");
const send = document.getElementById("send");
const feedback = document.getElementById("feedback");
const roomMessage = document.querySelector(".room-message");
const users = document.querySelector(".users");

//socket url
const socket = io.connect("http://localhost:3001");

console.log(socket);

//fetch URL params from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const username = urlParams.get("username");
const roomname = urlParams.get("roomname");
console.log(username, roomname);

//display the roomname the user is connected to
roomMessage.innerHTML = `you are in room ${roomname}`;

//emitting username and roomname to newly joined user to server
socket.emit("joined-user", {
  username: username,
  roomname: roomname,
});

//sending data when user click send
send.addEventListener("click", () => {
  console.log("send event");
  socket.emit("chat", {
    username: username,
    message: message.value,
    roomname: roomname,
  });

  message.value = "";
});

//sending username if user is typing
message.addEventListener("keypress", () => {
  socket.emit("typing", { username: username, roomname: roomname });
});

//display if new user has joined the room
socket.on("joined-user", (data) => {
  output.innerHTML +=
    "<p>--> <strong><em>" +
    data.username +
    " </strong>has Joined the Room</em></p>";
});

//display the message sent from user
socket.on("chat", (data) => {
  output.innerHTML +=
    "<p><strong>" + data.username + " </strong>" + data.message + "</p>";

  (feedback.innerHTML = ""),
    (document.querySelector(".chat-message").scrollTop =
      document.querySelector(".chat-message"));
});

//Displaying if a user is typing
socket.on("typing", (user) => {
  feedback.innerHTML = "<p><em>" + user + " is typing...</em></p>";
});

//displaying online users
socket.on("online-users", (data) => {
  users.innerHTML = "";
  data.forEach((user) => {
    users.innerHTML += `<p>${user}</p>`;
  });
});
