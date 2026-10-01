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
    githubId: "gwangsoo",
  },
  {
    id: 2,
    name: "범수",
    role: "member",
  },
  {
    id: 3,
    name: "희",
    role: "member",
    githubId: "Hee"
  },
];

const studyHour: number | undefined = 0

function findMemberById(id: number) {
  const member = members.find((member) => member.id === id);

  if (!member) {
    return `회원 ID ${id}: 존재하지 않는 회원입니다.`;
  }

  if (!member.githubId) {
    return `${member.name}님은 GitHub 아이디가 없습니다.`;
  }

  return `${member.name}님의 GitHub 아이디는 ${member.githubId}입니다.`;
}

console.log(findMemberById(1));
console.log(findMemberById(2));
console.log(findMemberById(999));

console.log(studyHour || 1); // 1
console.log(studyHour ?? 1); // 0

function formatMemberId(input: unknown) {
  if (typeof input === "number") {
    return `숫자 ID: ${input}`;
  }

  if (typeof input === "string") {
    return `문자열 ID: ${input}`;
  }

  return "올바르지 않은 ID입니다.";
}

console.log(formatMemberId(123));
console.log(formatMemberId("gwangsoo"));
console.log(formatMemberId(true));