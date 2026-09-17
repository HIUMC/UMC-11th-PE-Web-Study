type MemberRole = "leader" | "member";

interface StudyMember {
    id: number;
    name: string;
    role: MemberRole;
    githubId?: string;
}

const members: StudyMember[] = [
    { id: 1, name: "준", role: "leader", githubId: "nx006" },
    { id: 2, name: "민수", role: "member" },
];

function findById<T extends { id: number }>(
    items: readonly T[],
    id: number,
): T | undefined {
    return items.find((item) => item.id === id);
}

function createMemberMessage(id: number): string {
    const member = findById(members, id);

    if (member === undefined) {
        return `ID ${id}: 등록된 회원이 없습니다.`;
    }

    const roleLabel = member.role === "leader" ? "리더" : "일반 회원";
    const githubLabel = member.githubId ?? "등록되지 않음";

    return `ID ${member.id}: ${member.name} / ${roleLabel} / GitHub: ${githubLabel}`;
}

for (const id of [1, 2, 999]) {
    console.log(createMemberMessage(id));
}