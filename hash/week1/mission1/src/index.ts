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
    name: "해시",
    role: "leader",
    githubId: "ww123ok",
  },
  {
    id: 2,
    name: "민",
    role: "member",
  },
];

function createRoleMessage(role: MemberRole): string {
  if (role === "leader") {
    return "스터디를 이끌어요.";
  }

  return "스터디에 참여해요.";
}

function createMemberGuide(memberId: number): string {
  const foundMember = members.find((member) => member.id === memberId);

  if (!foundMember) {
    return `${memberId}번 회원을 찾지 못했어요.`;
  }

  const githubId = foundMember.githubId ?? "등록되지 않음";
  const roleMessage = createRoleMessage(foundMember.role);

  return [
    `[${foundMember.id}] ${foundMember.name}`,
    `역할: ${foundMember.role}`,
    `GitHub: ${githubId}`,
    roleMessage,
  ].join(" | ");
}

console.log("=== 필수 미션 결과 ===");
console.log(createMemberGuide(1));
console.log(createMemberGuide(2));
console.log(createMemberGuide(999));

/*
 * 선택 미션 1
 * interface와 같은 객체 모양을 type으로 표현하기
 */
type StudyMemberType = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

const typeMember: StudyMemberType = {
  id: 3,
  name: "스페이스",
  role: "member",
  githubId: "space",
};

console.log("\n=== 선택 미션 1 ===");
console.log(typeMember);
console.log("type과 interface 모두 객체의 모양을 표현할 수 있습니다.");
console.log("type은 유니언 등 객체 이외의 타입도 표현할 수 있습니다.");
console.log("interface는 extends와 선언 병합을 이용해 확장할 수 있습니다.");

/*
 * 선택 미션 2
 * ||와 ??의 차이 확인하기
 */
const studyHour: number | undefined = 0;

console.log("\n=== 선택 미션 2 ===");
console.log("studyHour || 1:", studyHour || 1);
console.log("studyHour ?? 1:", studyHour ?? 1);

/*
 * 선택 미션 3
 * unknown 값을 안전하게 구분하기
 */
function formatMemberId(input: unknown): string {
  if (typeof input === "number") {
    return `MEMBER-${input}`;
  }

  if (typeof input === "string") {
    return input.trim().toUpperCase();
  }

  return "올바르지 않은 회원 ID";
}

console.log("\n=== 선택 미션 3 ===");
console.log(formatMemberId(10));
console.log(formatMemberId(" member-20 "));
console.log(formatMemberId(true));