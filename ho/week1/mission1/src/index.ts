type StudentName = string;
type MemberRole = "leader" | "member";
type MemberId = number;
type GitHubId = string;

interface StudyMember {
  name: StudentName;
  role: MemberRole;
  id: MemberId;
  gitHubId?: GitHubId;
}

const members: StudyMember[] = [
  {
    name: "광수",
    role: "leader",
    id: 1,
    gitHubId: "gwangsoo",
  },
  {
    name: "지수",
    role: "member",
    id: 2,
  },
];

function getMemberInfo(id: MemberId): string {
  const member = members.find((member) => member.id === id);

  if (!member) {
    return `ID가 ${id}인 회원을 찾을 수 없습니다.`;
  }

  const gitHubId = member.gitHubId ?? "없음";

  return `${member.name} / 역할: ${member.role} / GitHub: ${gitHubId}`;
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));
