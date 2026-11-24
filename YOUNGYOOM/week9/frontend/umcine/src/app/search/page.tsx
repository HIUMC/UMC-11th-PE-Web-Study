import { SearchPage } from "@/features/movies/search-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string | string[] }>;
}) {
  const { query } = await searchParams;
  return <SearchPage query={typeof query === "string" ? query : ""} />;
}
