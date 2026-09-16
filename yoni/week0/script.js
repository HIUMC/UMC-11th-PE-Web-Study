const message = document.querySelector("#message");
const cheerButton = document.querySelector("#cheer-button");

cheerButton.addEventListener("click", function(){
    message.textContent = "좋아요! 굿굿";
});