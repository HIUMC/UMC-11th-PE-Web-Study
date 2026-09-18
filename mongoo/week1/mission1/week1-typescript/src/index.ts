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
    name: "성현",
    role: "leader",
    githubId: "221bbb",
  },
  {
    id: 2,
    name: "광수",
    role: "member",
  },
];

function findMember(id: number) {
  return members.find((member) => member.id === id);
}

function getMemberMessage(id: number): string {
  const member = findMember(id);

  if (!member) {
    return "존재하지 않는 회원입니다.";
  }

  const roleMessage =
    member.role === "leader"
      ? "스터디를 이끌어요."
      : "스터디에 참여해요.";

  const githubMessage =
    member.githubId ?? "등록되지 않음";

  return `${member.name}님은 ${roleMessage} GitHub: ${githubMessage}`;
}

console.log(getMemberMessage(1));
console.log(getMemberMessage(2));
console.log(getMemberMessage(999));