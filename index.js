const express = require("express");
const socket = require("socket.io");
const bodyParser = require("body-parser");

// const io = require("./utils/socket")(io);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.json());

app.use(express.static("public"));
app.set("view engine", "ejs");

var port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/room", (req, res) => {
  roomname = req.body.roomname;
  username = req.body.username;
  red = `/room?username=${username}&roomname=${roomname}`;
  res.redirect(red);
});

//rooms
app.get("/room", (req, res) => {
  res.render("room.ejs");
});

const server = app.listen(port, () => {
  console.log(`Listening on port : ${port}`);
});

const io = socket(server);
require("./utils/socket")(io);
