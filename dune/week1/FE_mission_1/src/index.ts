type MemberRole = "leader" | "member";

type StudyMember = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

const members: StudyMember[] = [
  {
    id: 1,
    name: "광수",
    role: "leader",
    githubId: "kwangsoo",
  },
  {
    id: 2,
    name: "철수",
    role: "member",
  },
];

function getMemberMessage(id: number): string {
  const member = members.find((member) => member.id === id);

  if (!member) {
    return `ID ${id}: 존재하지 않는 회원입니다.`;
  }

  const roleMessage =
    member.role === "leader"
      ? "스터디를 이끌어요."
      : "스터디에 참여해요.";

  const githubId = member.githubId ?? "등록되지 않음";

  return `${member.name}: ${roleMessage} GitHub: ${githubId}`;
}

console.log(getMemberMessage(1));
console.log(getMemberMessage(2));
console.log(getMemberMessage(999));