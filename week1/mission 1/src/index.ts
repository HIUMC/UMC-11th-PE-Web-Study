type Member = {
  id: number;
  name: string;
  role: string;
  githubId?: string;
};

const members: Member[] = [
  {
    id: 1,
    name: "연서",
    role: "Leader",
    githubId: "someday24",
  },
  {
    id: 2,
    name: "케빈",
    role: "Member",
  },
];

function getMemberInfo(id: number): string {
  const member = members.find((member) => member.id === id);

  if (!member) {
    return `ID ${id}번 회원은 존재하지 않습니다.`;
  }

  const githubMessage = member.githubId
    ? `GitHub ID: ${member.githubId}`
    : "GitHub ID가 등록되어 있지 않습니다.";

  return `${member.name}님은 ${member.role} 역할입니다. ${githubMessage}`;
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));