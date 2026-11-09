type Member = {
  id: number;
  name: string;
  role: string;
  githubId?: string;
};

const members: Member[] = [
  { id: 1, name: "김철수", role: "스터디장", githubId: "chulsoo" },
  { id: 2, name: "남현준", role: "스터디원" },
];

function getMemberInfo(id: number): string {
  const member = members.find((item) => item.id === id);

  if (!member) {
    return `ID ${id}인 회원을 찾을 수 없습니다.`;
  }

  const githubInfo = member.githubId
    ? `GitHub: ${member.githubId}`
    : "GitHub 아이디가 없습니다.";

  return `${member.name}님은 ${member.role}입니다. ${githubInfo}`;
}

[1, 2, 999].forEach((id) => console.log(getMemberInfo(id)));
