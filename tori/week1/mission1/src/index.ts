type Member = {
  id: number;
  name: string;
  role: string;
  github?: string;
};

const members: Member[] = [
  {
    id: 1,
    name: "이병헌",
    role: "스터디장",
    github: "chulsoo123",
  },
  {
    id: 2,
    name: "최민식",
    role: "스터디원",
  },
];

function getMemberInfo(id: number): string {
  const member = members.find((member) => member.id === id);

  if (!member) {
    return `ID ${id}에 해당하는 회원이 없습니다.`;
  }

  const githubInfo = member.github
    ? `GitHub: ${member.github}`
    : "GitHub 아이디가 없습니다.";

  return `ID: ${member.id}, 이름: ${member.name}, 역할: ${member.role}, ${githubInfo}`;
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));