type StudyMember = {
  name: string;
  id: number;
  role: string;
  githubid?: string;
};

const member: StudyMember = {
  name: "태형",
  id: 1,
  role: "normal",
  githubid: "remmanic"
};

const member2: StudyMember = {
    name: "광수",
    id: 2,
    role: "normal",
    githubid: "gwangsu"
}

const member3: StudyMember = {
    name: "민수",
    id: 3,
    role: "leader"
}

function findMemberById(members: StudyMember[], id: number) : StudyMember | undefined {
    return members.find(member => member.id === id);
}

console.log(findMemberById([member, member2, member3], 999));

const studyHour: number | undefined = 0
console.log(studyHour||"야르");