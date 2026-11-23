export const ratingKeys = {
  all: ["ratings"] as const,
  byMember: (memberId: number) => [...ratingKeys.all, "member", memberId] as const,
};
