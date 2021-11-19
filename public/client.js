"use strict";

const socket = io();
const chatDiv = document.getElementById("message-container");
const  form = document.getElementById("send-message");
const messageInput = document.getElementById("message-input");

let userName;

while (!userName) {
  userName = prompt("Enter your name");
}

socket.emit("new-user", userName);

socket.on('user-connected', (userName) => {

  userJoined(userName);
});

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
});

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})



function userJoined(name) {
  let newUser = document.createElement("div");
  newUser.textContent = name;
  newUser.setAttribute('class','new-user')
  chatDiv.appendChild(newUser);
}

// form.addEventListener('submit', e => {
//   e.preventDefault()
//   const message = messageInput.value
//   appendMessage(`You: ${message}`)
//   socket.emit('send-chat-message', message)
//   messageInput.value = ''
// })

// function appendMessage(message) {
//   const messageElement = document.createElement('div')
//   messageElement.innerText = message
//   chatDiv.append(messageElement)
// }




form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(userName,`You: ${message}`);
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

function appendMessage(name,message) {
  const messageDiv = document.createElement("div");
  const messageElement = document.createElement("div");
  const userElement = document.createElement("div");
  userElement.innerText = name[0];
  messageElement.innerText = message;
  messageDiv.setAttribute('class','new-msg');
  userElement.setAttribute('class','user');
  messageElement.setAttribute('class','msg');
  messageDiv.append(userElement);
  messageDiv.append(messageElement);
  chatDiv.append(messageDiv);
}