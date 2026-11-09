type MemberRole = "leader" | "member";

interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

const members: StudyMember [] = [
  {
    id: 1,
    name: "광수",
    role: "leader",
    githubId: "gwangsoo",
  },
  {
    id: 2,
    name: "지수",
    role: "member",
  },
];

function getRoleMessage(role: MemberRole) {
  if (role === "leader") {
    return "스터디를 이끌어요.";
  }

  return "스터디에 참여해요.";
}

function createMemberMessage(memberId: number) {
  const member = members.find(
    (member) => member.id === memberId
  );

  if (!member) {
    return "회원을 찾을 수 없습니다.";
  }

  const githubId = member.githubId ?? "등록되지 않음";

  const roleMessage = getRoleMessage(member.role);

  return (
    member.name + " / GitHub: " + githubId + " / " + roleMessage
  );
}

console.log(createMemberMessage(1));
console.log(createMemberMessage(2));
console.log(createMemberMessage(999));