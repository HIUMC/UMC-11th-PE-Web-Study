"use strict";
const member1 = {
    id: 1,
    name: "서영",
    role: "leader",
    githubId: "youngyoom",
};
const member2 = {
    id: 2,
    name: "원영",
    role: "member",
};
const members = [member1, member2];
function introduceMember(id) {
    const found = members.find((m) => m.id === id);
    if (!found) {
        return `ID ${id} 회원을 찾을 수 없음`;
    }
    const roleText = found.role === "leader" ? "리더" : "팀원";
    const githubText = found.githubId ?? "등록되지 않음";
    return `${found.name} : 역할 : ${roleText}, GitHub: ${githubText}`;
}
console.log(introduceMember(1));
console.log(introduceMember(2));
console.log(introduceMember(99));
