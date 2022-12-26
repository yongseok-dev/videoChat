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
    sockets.splice(sockets.indexOf(socket));
    sockets.forEach((user) => {
      user.send(JSON.stringify({ sender: socket.nick, type: "out" }));
    });
  });
  socket.on("message", (message) => {
    const messageObject = JSON.parse(message);
    if (messageObject.type === "message") {
      sockets.forEach((user) => {
        if (user && user.nick !== socket.nick) {
          user.send(
            JSON.stringify({
              sender: socket.nick,
              type: "message",
              value: messageObject.value,
            })
          );
        }
      });
      console.log(`${messageObject.sender} >> ${messageObject.value}`);
    } else if (messageObject.type === "nick") {
      let isUesd = false;
      sockets.forEach((user) => {
        if (user && user.nick === messageObject.sender) {
          isUesd = true;
        }
      });
      if (isUesd) {
        //중복
        socket.send(
          JSON.stringify({
            sender: socket.nick,
            type: "nick",
            value: "이미 등록된 닉네임으로 등록 및 변경이 불가합니다.",
          })
        );
        console.log(`${messageObject.value} >> 닉네임 중복`);
      } else if (!socket["nick"]) {
        //등록
        socket["nick"] = messageObject.value;
        sockets.push(socket);
        sockets.forEach((user) => {
          if (user && user.nick !== messageObject.sender) {
            user.send(
              JSON.stringify({ sender: messageObject.sender, type: "in" })
            );
          }
        });
        console.log(`${messageObject.value} >> 닉네임 등록`);
      } else {
        //변경
        let changeIndex;
        sockets.forEach((user) => {
          if (user && user.nick !== messageObject.sender) {
            user.send(
              JSON.stringify({
                sender: socket["nick"],
                type: "message",
                value: `${messageObject.value} 닉네임을 변경합니다.`,
              })
            );
          }
        });
        socket["nick"] = messageObject.value;
        console.log(`${messageObject.value} >> 닉네임 변경`);
      }
    }
  });
});

server.listen(port, handleListen);
