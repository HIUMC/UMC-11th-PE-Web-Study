const message = document.querySelector("#message");
const cheerButton = document.querySelector("#cheer-button");

cheerButton.addEventListener("click", function () {
  message.textContent = "화이팅입니다에요. 🚀";
});