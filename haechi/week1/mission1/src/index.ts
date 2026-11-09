// 1. 회원 역할을 리터럴 타입으로 (오타 방지)
type MemberRole = "leader" | "member";

// 회원 정보를 타입으로 표현 (githubId는 선택 값이라 ?)
interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

// 서로 다른 정보를 가진 회원들 (한 명은 githubId 없음)
const members: StudyMember[] = [
  { id: 1, name: "해찬", role: "member", githubId: "hchnnn" },
  { id: 2, name: "황구", role: "leader" }, // githubId 없음
];

// 2. 회원 ID로 정보를 찾아 안내 문구 만들기
function createMemberIntro(memberId: number): string {
  const foundMember = members.find((member) => member.id === memberId);

  // 존재하지 않는 회원 처리 (find가 undefined 반환)
  if (!foundMember) {
    return memberId + "번 회원을 찾을 수 없어요.";
  }

  // 역할에 따른 문구 (타입 좁히기)
  const roleMessage =
    foundMember.role === "leader" ? "스터디를 이끌어요." : "스터디에 참여해요.";

  // githubId가 없는 회원도 오류 없이 처리 (??)
  const githubId = foundMember.githubId ?? "등록되지 않음";

  return (
    foundMember.name +
    " 님 (GitHub: " +
    githubId +
    ") — " +
    roleMessage
  );
}

// 3. 회원 ID 1, 2, 999 결과 확인
console.log(createMemberIntro(1));   // 해찬, 깃허브 있음, 멤버
console.log(createMemberIntro(2));   // 황구, 깃허브 없음, 리더
console.log(createMemberIntro(999)); // 존재하지 않는 회원