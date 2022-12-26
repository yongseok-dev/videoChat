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
  sockets.push(socket);
  console.log("소켓 연결 됨", socket);
  socket.on("close", () => {
    console.log("소켓 연결 종료 됨");
  });
  socket.on("message", (message) => {
    sockets.forEach((asocket) => {
      if (socket !== asocket) {
        asocket.send(`${message}`);
      }
    });
    console.log(`user>server >> ${message}`, message);
  });
});

server.listen(port, handleListen);
