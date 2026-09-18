type StudyMember = {
    memberID: number;
    name: string;
    role: "leader" | "member";
    githubID?: string;  // 선택 값
};
const members: StudyMember[] = [
    {memberID: 1, name: "광수", role: "leader", githubID: "gwangsoo"},
    {memberID: 2, name: "지수", role: "member"}
]

function printMemberInfo(member: StudyMember | undefined) {
    if (!member) {      // undefined인 경우, 회원정보가 존재하지 않는 경우
        return "존재하지 않는 회원입니다.";
    }
    const isGit = member.githubID;
    if (isGit) {    // 깃허브 아이디가 있는 경우 깃허브 아이디까지 출력
        return "이름: " + member.name + ", 역할: " + member.role + ", GitHub: " + isGit;
    }
    return "이름: " + member.name + ", 역할: " + member.role;
}

// 회원 ID로 회원 객체 반환
function findMember(id: number) {
    return members.find((member) => member.memberID === id);
}

console.log(printMemberInfo(findMember(1)));
console.log(printMemberInfo(findMember(2)));
console.log(printMemberInfo(findMember(999)));
