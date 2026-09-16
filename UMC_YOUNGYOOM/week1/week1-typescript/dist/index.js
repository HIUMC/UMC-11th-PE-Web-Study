"use strict";
//인터페이스는 같은 이름으로 여러번 선언하면 자동으로 합쳐지지만, type은 교차타입을 사용해야함
//타입은 = 을 사용해야함
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
const studyHour = 0;
console.log(studyHour || 1); // 1
console.log(studyHour ?? 1); // 0
// || 은 왼쪽이 거짓처럼 취급된다면(falsy) -> 무조건 오른쪽 값을 반환함 (or 연산자) -> 거짓으로 취급되는 값 : 0, "", null, undefined, false, Nan
// ?? 은 왼쪽값이 null/undefined 일때만 오른쪽 값을 반환함 -> 은 명확한 값이기 때문에 이 출력됨
function formatMemberId(input) {
    if (typeof input === "number") {
        return `입력값 : ${input}`;
    }
    else if (typeof input === "string") {
        return `입력값 : ${input}`;
    }
    else {
        return "유효하지 않은 입력값";
    }
}
//unknown 은 타입 좁하기를 하지않으면 변수에 접근 자체가 불가능함
console.log(formatMemberId(1));
console.log(formatMemberId("a"));
console.log(formatMemberId(true));
console.log(formatMemberId(null));
