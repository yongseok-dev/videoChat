import http from "http";
import webSocket from "ws";
import express from "express";

const app = express();
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res, next) => {
  res.render("main");
});
app.get("/*", (req, res, next) => {
  res.redirect("/");
});

const port = 3000;
const handleListen = () => console.log(`SERVER: http:${port}`);
// app.listen(port, handleListen);

const server = http.createServer(app);

const wss = new webSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  console.log("소켓 연결 됨");
  socket.on("close", () => {
    console.log("소켓 연결 종료 됨");
  });
  socket.on("message", (message) => {
    const messageObject = JSON.parse(message);
    if (messageObject.type === "nick") {
      console.log(`${messageObject.value}>server >> 닉네임 등록`);
      sockets.push({ nick: messageObject.value, socket });
      sockets.forEach((user) => {
        if (user.nick !== messageObject.sender) {
          user.socket.send(
            JSON.stringify({ sender: messageObject.sender, type: "in" })
          );
        }
      });
    }
    if (messageObject.type === "message") {
      sockets.forEach((user) => {
        if (user.nick !== messageObject.sender) {
          user.socket.send(JSON.stringify(messageObject));
        }
      });
      console.log(`${messageObject.sender}>server >> ${messageObject.value}`);
    }
  });
});

server.listen(port, handleListen);
