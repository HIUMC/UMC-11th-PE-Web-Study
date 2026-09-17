/*
- 스터디 회원 관리 프로그램 완성하기
    - 회원의 ID, 이름, 역할과 선택 값인 GitHub 아이디를 타입으로 표현하고, 서로 다른 정보를 가진 회원 두 명 이상을 작성해요.
    - 회원 ID로 정보를 찾아 안내 문구를 만들고, GitHub 아이디가 없는 회원과 존재하지 않는 회원도 오류 없이 처리해요.
    - 회원 ID `1`, `2`, `999`를 전달한 결과를 확인하고 `pnpm exec tsc --noEmit`, 컴파일과 실행을 모두 완료해요.
*/

type member = 
{
    id: number;
    name: string;
    role: string;
    githubId?: string;
}

const members: member[] = [
    { id: 1, name: "Alice", role: "Developer", githubId: "aliceGH" },
    { id: 2, name: "Bob", role: "Designer" }
];

function getMemberInfo(id: number): string {
    const member = members.find(x => x.id === id);
    if (!member) {
        return "회원을 찾을 수 없습니다.";
    }
    
    const githubId = member.githubId ?? "GitHub 아이디가 없습니다.";
    return `${member.name} (${member.role}) - GitHub 아이디: ${githubId}`;
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));