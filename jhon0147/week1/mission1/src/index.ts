type MemberRole = "leader" | "member";

interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

const members: StudyMember[] = [
  {
    id: 1,
    name: "준환",
    role: "leader",
    githubId: "jhon0147",
  },
  {
    id: 2,
    name: "지수",
    role: "member",
  },
];

function createMemberMessage(memberId: number) {
  const member = members.find((member) => member.id === memberId);

  if (!member) {
    return `ID ${memberId} 회원을 찾지 못했습니다.`;
  }

  const githubId = member.githubId ?? "GitHub 아이디 없음";

  return `${member.name} (${member.role}) / GitHub: ${githubId}`;
}

console.log(createMemberMessage(1));
console.log(createMemberMessage(2));
console.log(createMemberMessage(999));


// 선택 미션 1: type과 interface 비교

type StudyMemberType = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

const typeMember: StudyMemberType = {
  id: 3,
  name: "태형",
  role: "member",
};


// 선택 미션 2: ||와 ?? 비교

const studyHour: number | undefined = 0;

console.log(studyHour || 1);
console.log(studyHour ?? 1);


// 선택 미션 3: unknown 안전하게 구분

function formatMemberId(input: unknown) {
  if (typeof input === "number") {
    return `숫자 회원 ID: ${input}`;
  }

  if (typeof input === "string") {
    return `문자열 회원 ID: ${input}`;
  }

  return "회원 ID로 사용할 수 없는 값입니다.";
}

console.log(formatMemberId(1));
console.log(formatMemberId("member1"));
console.log(formatMemberId(true));