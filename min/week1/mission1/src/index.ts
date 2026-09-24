type StudyMember = {
  id: number;
  name: string;
  role: "스터디장" | "스터디원";
  githubId?: string;
};

const members: StudyMember[] = [
  { id: 1, name: "광수", role: "스터디장", githubId: "gwangsoo" },
  { id: 2, name: "지수", role: "스터디원" },
];

const createMemberMessage = (memberId: number): string => {
  const foundMember = members.find((member) => member.id === memberId);

  if (!foundMember) {
    return `ID ${memberId}번 회원을 찾을 수 없습니다.`;
  }

  const githubMessage = foundMember.githubId
    ? `GitHub 아이디는 ${foundMember.githubId}입니다.`
    : "GitHub 아이디는 등록되지 않았습니다.";

  return `${foundMember.id}번 회원 ${foundMember.name}님은 ${foundMember.role}입니다. ${githubMessage}`;
};

console.log(createMemberMessage(1));
console.log(createMemberMessage(2));
console.log(createMemberMessage(999));
