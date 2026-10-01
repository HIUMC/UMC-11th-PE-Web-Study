type StudentName = string;
type MemberRole = "leader" | "member";
type MemberId = number;
type GitHubId = string;

interface StudyMember {
  name: StudentName;
  role: MemberRole;
  id: MemberId;
  gitHubId?: GitHubId;
}

const members: StudyMember[] = [
  { id: 1, name: "김상엽", role: "member", gitHubId: "yeop1108" },
  { id: 2, name: "이하나", role: "leader" },
  { id: 3, name: "박운영", role: "member", gitHubId: "woonyoung2" },
];

function findMember(id: MemberId): StudyMember | undefined {
  return members.find((member) => member.id === id);
}

function getRoleMessage(role: MemberRole): string {
  switch (role) {
    case "leader":
      return "스터디를 이끌어요.";
    case "member":
      return "스터디에 참여해요.";
  }
}

function getGithubMessage(gitHubId?: GitHubId): string {
  return gitHubId ? `GitHub: @${gitHubId}` : "등록된 GitHub 아이디가 없습니다.";
}

function getMemberInfo(id: MemberId): string {
  const member = findMember(id);

  if (!member) {
    return `ID ${id}에 해당하는 회원을 찾을 수 없습니다.`;
  }

  return `${member.name}님은 ${member.role}입니다. ${getRoleMessage(member.role)} ${getGithubMessage(member.gitHubId)}`;
}

[1, 2, 999].forEach((id) => {
  console.log(getMemberInfo(id));
});

type MemberRecord = {
  name: StudentName;
  role: MemberRole;
  id: MemberId;
  gitHubId?: GitHubId;
};

const typeExample: MemberRecord = members[0]!;
console.log(typeExample);

const studyHour: number | undefined = 0;
console.log(`studyHour || 1 = ${studyHour || 1}`);
console.log(`studyHour ?? 1 = ${studyHour ?? 1}`);

function formatMemberId(input: unknown): string {
  if (typeof input === "number" && Number.isFinite(input)) {
    return `숫자 ID: ${input}`;
  }

  if (typeof input === "string" && input.trim().length > 0) {
    return `문자열 ID: ${input}`;
  }

  return "지원하지 않는 ID 형식입니다.";
}

[1, "2", null, undefined, {}, "  "].forEach((value) => {
  console.log(formatMemberId(value));
});
