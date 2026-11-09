type MemberRole = "leader" | "member";

interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

const members: StudyMember[] = [
  { id: 1, name: "재원", role: "leader", githubId: "jaewon" },
  { id: 2, name: "잰슨", role: "member" },
];

function introduceMember(memberId: number): string {
  const foundMember = members.find((member) => member.id === memberId);

  if (!foundMember) {
    return "존재하지 않는 회원";
  }

  const roleText = foundMember.role === "leader" ? "리더" : "멤버";
  const githubInfo = foundMember.githubId ?? "등록되지 않음";

  return foundMember.name + " 님은 " + roleText + "이고, GitHub: " + githubInfo ;
}

console.log(introduceMember(1));
console.log(introduceMember(2));
console.log(introduceMember(999));