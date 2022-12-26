const url = window.location.host;
const socket = new WebSocket(`ws://${url}`);

const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

const handle = {
  open() {
    console.log("소켓 연결 됨");
  },
  close() {
    console.log("소켓 연결 해제 됨");
  },
  message(message) {
    messageList.innerHTML += `<li>익명 >> ${message.data}</li>`;
  },
  send(message) {
    messageList.innerHTML += `<li>나 >> ${message}</li>`;
    socket.send(message);
  },
};

socket.addEventListener("open", handle.open);
socket.addEventListener("message", handle.message);
socket.addEventListener("close", handle.close);

function handleSubmit(e) {
  e.preventDefault();
  const sendMessageInput = document.getElementById("send");
  handle.send(sendMessageInput.value);
  sendMessageInput.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
