const student = {
  name: "해시",
  skills: ["HTML", "CSS", "JavaScript", "React"],
};

function printSkills(skills) {
  for (const skill of skills) {
    if (skill === "JavaScript") {
      console.log(`${skill}: 웹 페이지에 동작을 추가합니다.`);
    } else {
      console.log(skill);
    }
  }
}

console.log(`${student.name}의 0주차 학습을 시작합니다.`);
printSkills(student.skills);

const message = document.querySelector("#message");
const cheerButton = document.querySelector("#cheer-button");

const messages = [
  "백엔드 경험을 바탕으로 프론트엔드도 차근차근 배우고 있습니다.",
  "좋아요! 작은 코드부터 직접 바꾸며 성장해 봅시다. 🚀",
];

let messageIndex = 0;

cheerButton.addEventListener("click", function () {
  messageIndex = messageIndex === 0 ? 1 : 0;
  message.textContent = messages[messageIndex];

  if (messageIndex === 0) {
    cheerButton.textContent = "응원 메시지 보기";
  } else {
    cheerButton.textContent = "원래 소개 보기";
  }
});