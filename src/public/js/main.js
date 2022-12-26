const url = window.location.host;
const socket = new WebSocket(`ws://${url}`);

const handle = {
  open() {
    console.log("소켓 연결 됨");
  },
  close() {
    console.log("소켓 연결 해제 됨");
  },
  message(message) {
    console.log(`server>user >> ${message.data}`, message);
  },
  send(message) {
    console.log(`user>server >> ${message}`);
    socket.send(message);
  },
};

socket.addEventListener("open", handle.open);
socket.addEventListener("message", handle.message);
socket.addEventListener("close", handle.close);

function sendMessage() {
  const sendMessageInput = document.getElementById("send");
  handle.send(sendMessageInput.value);
  sendMessageInput.value = "";
}
