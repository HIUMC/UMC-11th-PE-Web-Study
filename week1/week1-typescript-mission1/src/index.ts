type MemberRole = "admin" | "member" | "guest";

type Member = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

const members: Member[] = [
  {
    id: 1,
    name: "김소희",
    role: "admin",
    githubId: "sohee-dev",
  },
  {
    id: 2,
    name: "이민준",
    role: "member",
  },
];

function createMemberMessage(memberId: number): string {
  const member = members.find(({ id }) => id === memberId);

  if (!member) {
    return `ID ${memberId}번 회원을 찾을 수 없습니다.`;
  }

  const githubInfo = member.githubId
    ? `GitHub 아이디는 ${member.githubId}입니다.`
    : "GitHub 아이디는 등록되어 있지 않습니다.";

  return `ID ${member.id}번 회원은 ${member.name}님이고, 역할은 ${member.role}입니다. ${githubInfo}`;
}

const memberIdsToCheck = [1, 2, 999];

memberIdsToCheck.forEach((memberId) => {
  console.log(createMemberMessage(memberId));
});
