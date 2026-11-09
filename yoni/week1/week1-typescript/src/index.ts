type memberRole = "leader" | "member";
type studyMember = {
    id: number;
    name: string;
    role: memberRole;
    githubID?: string;
}

const members: studyMember[] = [
    {
        id: 1,
        name: "yw",
        role: "leader",
        githubID: "cyw4878"
    },
    {
        id: 2,
        name: "ys",
        role: "member",
    },
];

function createMemberMessage(memberID: number){
    const foundMember = members.find((member)=>member.id===memberID);

    if(!foundMember){
        return "not found";
    }

    const githubID = foundMember.githubID ?? "not register";

    return (
        foundMember.name + " / role: " + 
        foundMember.role + " / GitHub: "+
        githubID
    );
}

console.log(createMemberMessage(1));
console.log(createMemberMessage(2));
console.log(createMemberMessage(999));