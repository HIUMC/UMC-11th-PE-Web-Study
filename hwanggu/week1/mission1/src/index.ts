// 1주차 필수 미션: 스터디 회원 관리 프로그램
// - 회원 타입(ID, 이름, 역할, 선택 값 GitHub 아이디)을 정의해요.
// - 회원 ID로 정보를 찾아 안내 문구를 만들어요.
// - GitHub 아이디가 없는 회원과 존재하지 않는 회원도 오류 없이 처리해요.

// 회원 역할은 정해진 값만 사용하도록 리터럴 유니언 타입으로 표현해요.
type MemberRole = "leader" | "member";

// 회원 객체의 모양을 interface로 표현해요. githubId는 옵셔널 프로퍼티예요.
interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

// 서로 다른 정보를 가진 회원들. 2번 회원은 githubId가 없어요.
const members: StudyMember[] = [
  { id: 1, name: "황구", role: "leader", githubId: "hwanggu" },
  { id: 2, name: "광수", role: "member" },
];

// 회원 ID로 회원을 찾아 안내 문구를 만드는 함수.
// 반환 타입은 return 값을 보고 string으로 추론되지만, 약속을 고정하려고 명시했어요.
function createMemberInfo(memberId: number): string {
  // find는 조건에 맞는 회원이 없으면 undefined를 반환해요.
  const foundMember = members.find((member) => member.id === memberId);

  // 존재하지 않는 회원도 오류 없이 처리해요. (타입 좁히기)
  if (!foundMember) {
    return `${memberId}번 회원을 찾을 수 없어요.`;
  }

  // 역할에 따라 문구를 다르게 만들어요.
  const roleText =
    foundMember.role === "leader" ? "스터디를 이끌어요." : "스터디에 참여해요.";

  // githubId가 없으면(null/undefined) 기본 문구를 사용해요. (널 병합 연산자 ??)
  const githubText = foundMember.githubId ?? "등록되지 않음";

  return `${foundMember.name} 님 (${foundMember.role}) — ${roleText} GitHub: ${githubText}`;
}

// 회원 ID 1, 2, 999를 전달한 결과를 확인해요.
console.log(createMemberInfo(1)); // githubId 있는 리더
console.log(createMemberInfo(2)); // githubId 없는 멤버
console.log(createMemberInfo(999)); // 존재하지 않는 회원
