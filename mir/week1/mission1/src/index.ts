// 1. 회원의 역할을 리터럴 타입과 유니언 타입으로 제한합니다.
type MemberRole = "leader" | "member";

// 2. 객체 타입을 정의하여 회원의 형태를 만듭니다. (GitHub ID는 옵셔널 프로퍼티)
interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string; 
}

// 3. 서로 다른 정보를 가진 회원 배열을 생성합니다.
const members: StudyMember[] = [
  { id: 1, name: "광수", role: "leader", githubId: "gwangsoo" },
  { id: 2, name: "지수", role: "member" } // githubId를 생략해도 타입 오류가 없습니다.
];

// 4. 회원 ID로 정보를 찾아 안내 문구를 반환하는 함수
function getMemberInfo(memberId: number): string {
  // find() 메서드는 조건에 맞는 회원이 없으면 undefined를 반환합니다.
  const foundMember = members.find((member) => member.id === memberId);

  // truthy/falsy를 이용해 undefined인 경우를 안전하게 타입 좁히기 합니다.
  if (!foundMember) {
    return "회원을 찾지 못했어요.";
  }

  // ?. (옵셔널 체이닝)과 ?? (널 병합 연산자)를 사용해 값이 없을 때의 기본값을 정합니다.
  const displayGithubId = foundMember?.githubId ?? "등록되지 않은 상태";

  return foundMember.name + " 님의 역할은 " + foundMember.role + "이며, GitHub ID는 " + displayGithubId + "입니다.";
}

// 5. 컴파일 및 런타임 실행 결과 확인용 출력
console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));

// 선택 미션 1: StudyMember를 type으로 작성해보기
type StudyMemberType = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

// 선택 미션 2: || 와 ?? 연산자 비교
const studyHour: number | undefined = 0;

// || (논리 OR)는 0을 falsy 값으로 취급하여 무시하고 1을 반환합니다.
console.log("|| 연산자 결과:", studyHour || 1); 

// ?? (널 병합)는 null이나 undefined일 때만 기본값을 사용하므로, 유효한 값인 0을 유지합니다.
console.log("?? 연산자 결과:", studyHour ?? 1);


// 선택 미션 3: unknown 다루기
function formatMemberId(input: unknown): string {
  // 1) typeof를 이용해 input이 숫자인지 확인 (타입 좁히기)
  if (typeof input === "number") {
    return "ID 번호: " + input;
  }
  
  // 2) typeof를 이용해 input이 문자열인지 확인 (타입 좁히기)
  if (typeof input === "string") {
    return "ID 문자열: " + input.toUpperCase();
  }
  
  // 3) 숫자도 문자열도 아닌 그 밖의 값인 경우
  return "알 수 없는 ID 형식입니다.";
}

// 결과 테스트
console.log(formatMemberId(123));       // 출력: ID 번호: 123
console.log(formatMemberId("abc"));     // 출력: ID 문자열: ABC
console.log(formatMemberId(true));      // 출력: 알 수 없는 ID 형식입니다.