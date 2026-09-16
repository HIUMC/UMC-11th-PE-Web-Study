//script.js

const input = document.querySelector(".guest-input");
const button = document.querySelector(".submit-btn");

button.addEventListener("click", function () {
  if (input.value.trim() === "") {
    return;
  }

  const message = document.createElement("p");
  message.textContent = input.value;
  document.body.appendChild(message);

  input.value = "";
});
