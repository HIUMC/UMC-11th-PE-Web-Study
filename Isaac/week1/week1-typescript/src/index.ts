type Role = "leader" | "member";

interface StudyMember {
  id: number;
  name: string;
  role: Role;
  githubId?: string;
}

const members: StudyMember[] = [
  {
    id: 1,
    name: "정헌",
    role: "leader",
    githubId: "jeongheon",
  },
  {
    id: 2,
    name: "민수",
    role: "member",
  },
];

function getMemberInfo(id: number): string {
  const member = members.find((member) => member.id === id);

  if (!member) {
    return `ID ${id}인 회원을 찾을 수 없습니다.`;
  }

  const github = member.githubId ?? "GitHub 아이디 없음";

  return `${member.name} (${member.role}) - GitHub: ${github}`;
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));