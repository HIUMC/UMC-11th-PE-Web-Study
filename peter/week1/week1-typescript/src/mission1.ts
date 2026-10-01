type MemberRole = "leader" | "member";

type StudyMember = {
  memberID: number; 
  name: string;
  role: MemberRole;
  githubId?: string;
};

const members: StudyMember[] = [
  { memberID: 1, name: "도현", role: "leader", githubId: "yeonhx03" },
  { memberID: 2, name: "도이" ,role: "member"},
];

//안내 문구 출력 함수
function getRoleMessage(role: MemberRole): string {
    if (role === "leader") {
        return "스터디를 이끌어요.";
    }

    return "스터디에 참여해요.";
}

//회원 ID로 정보 찾기
function getMemberInfo(id: number): string {
    const member = members.find((member) => member.memberID === id);

    if (!member) {
        return "존재하지 않는 회원입니다.";
    }

    const github = member.githubId ?? "GitHub 아이디 없음";

    return `${member.name}: ${getRoleMessage(member.role)} GitHub: ${github}`;
}


let selectedMember: StudyMember | null = null;
const foundMember = members.find((member) => member.name === "현우");

// 결과 확인
console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));