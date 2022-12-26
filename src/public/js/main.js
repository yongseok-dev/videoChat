const url = window.location.host;
const socket = new WebSocket(`ws://${url}`);

const messageList = document.querySelector("ul");
const nickForm = document.getElementById("nick");
const messageForm = document.getElementById("message");
const sendNicknameInput = document.getElementById("nickname");
const sendMessageInput = document.getElementById("send");

const handle = {
  open() {
    console.log("소켓 연결 됨");
  },
  close() {
    console.log("소켓 연결 해제 됨");
  },
  message(message) {
    const messageObject = JSON.parse(message.data);
    messageList.innerHTML +=
      messageObject.type === "in"
        ? `<li>${messageObject.sender} 님이 입장하였습니다.</li>`
        : `<li>${messageObject.sender} >> ${messageObject.value}</li>`;
  },
  sendMessage() {
    messageList.innerHTML += `<li>나 >> ${sendMessageInput.value}</li>`;
    socket.send(
      JSON.stringify({
        sender: sendNicknameInput.value,
        type: "message",
        value: sendMessageInput.value,
      })
    );
  },
  sendNickname() {
    messageList.innerHTML += `<li>나의 닉네임을 ${sendNicknameInput.value}로 설정하였습니다.</li>`;
    socket.send(
      JSON.stringify({
        sender: sendNicknameInput.value,
        type: "nick",
        value: sendNicknameInput.value,
      })
    );
  },
};

socket.addEventListener("open", handle.open);
socket.addEventListener("message", handle.message);
socket.addEventListener("close", handle.close);

function handleMessageSubmit(e) {
  e.preventDefault();
  handle.sendMessage();
  sendMessageInput.value = "";
}
function handleNickSubmit(e) {
  e.preventDefault();
  handle.sendNickname();
  sendNicknameInput.disabled = true;
}

messageForm.addEventListener("submit", handleMessageSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
