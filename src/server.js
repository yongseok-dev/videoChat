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

const port = 3000;
const handleListen = () => console.log(`SERVER: http:${port}`);
// app.listen(port, handleListen);

const server = http.createServer(app);

const wss = new webSocket.Server({ server });

server.listen(port, handleListen);
