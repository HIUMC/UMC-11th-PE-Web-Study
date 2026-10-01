// ---------- 1. 회원 타입 정의와 회원 목록 작성 ----------
type MemberRole = "leader" | "member";

interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

const members: StudyMember[] = [
  { id: 1, name: "광수", role: "leader", githubId: "gwangsoo" },
  { id: 2, name: "지수", role: "member" },
];

// ---------- 2. ID로 회원을 찾아 안내 문구 만들기 ----------
function introduceMember(memberId: number) {
  const foundMember = members.find((member) => member.id === memberId);

  if (!foundMember) {
    return "존재하지 않는 회원이에요.";
  }

  const displayGithubId = foundMember.githubId ?? "등록되지 않음";

  return (
    foundMember.name +
    " 님 (" +
    foundMember.role +
    "), GitHub: " +
    displayGithubId
  );
}

// ---------- 3. 회원 ID 1, 2, 999를 전달한 결과 확인 ----------
console.log(introduceMember(1));
console.log(introduceMember(2));
console.log(introduceMember(999));
