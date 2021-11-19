"use strict";

const socket = io();
const chatDiv = document.getElementById("message-container");
const sideBar = document.getElementById("all-users");
const form = document.getElementById("send-message");
const messageInput = document.getElementById("message-input");

let userName;

while (!userName) {
  userName = prompt("Enter your name");
}

socket.emit("new-user", userName);

socket.on("user-connected", (userName) => {
  userJoined(userName);
});

socket.on("users-list", (users) => {
  usersList(users);
});

socket.on("chat-message", (data) => {
  appendMessageRight(data.name,data.message);
});

socket.on("user-disconnected", (name) => {
  userLeft(name);
});

function userJoined(name) {
  let newUserDiv = document.createElement("div");
  newUserDiv.innerHTML = `<h3>${name} has joined</h3>`
  newUserDiv.setAttribute("class", "new-user");
  chatDiv.appendChild(newUserDiv);
}

function userLeft(name) {
  let newUserDiv = document.createElement("div");
  newUserDiv.innerHTML = `<h3>${name} has left</h3>`
  newUserDiv.setAttribute("class", "new-user");
  chatDiv.appendChild(newUserDiv);
}

function usersList(users) {
  let usersArr = Object.values(users);
  sideBar.textContent ='';
  sideBar.innerHTML='<h2>People</h2>'
  usersArr.forEach((user) => {
    let userElement = document.createElement("p");
    userElement.textContent = user;
    sideBar.appendChild(userElement);
  });
  let userNum = document.createElement("h3");
  userNum.textContent= usersArr.length;
  sideBar.appendChild(userNum);

}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessageLeft(userName, message);
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

function appendMessageLeft(name, message) {
  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = `<p><b>${name}</b><br/>${message}</p>`;
  messageDiv.setAttribute("class", "new-msg-left");
  chatDiv.append(messageDiv);
}

function appendMessageRight(name, message) {
  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = `<p><b>${name}</b><br/>${message}</p>`;
  messageDiv.setAttribute("class", "new-msg-right");
  chatDiv.append(messageDiv);
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
