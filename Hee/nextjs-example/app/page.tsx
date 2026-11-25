import MovieCard from "@/components/movie-card";
import Pagination from "@/components/pagination";
import { getMovies } from "@/lib/movies";

export default async function Home({searchParams}:PageProps<"/">) {
  const value=(await searchParams).page; const parsed=Number(Array.isArray(value)?value[0]:value); const page=Number.isInteger(parsed)&&parsed>0?parsed:1;
  const data=await getMovies(page);
  return <main className="min-h-[calc(100vh-64px)] bg-[#f7f8fa]"><div className="mx-auto max-w-[1100px] px-5 py-9">
    <div className="mb-7"><h1 className="text-3xl font-bold tracking-tight">인기 영화</h1><p className="mt-2 text-sm text-gray-500">지금 가장 많은 관심을 받는 영화를 만나보세요.</p></div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">{data.results.map(movie=><MovieCard key={movie.id} movie={movie}/>)}</div>
    <Pagination current={page} total={data.totalPages}/>
  </div></main>;
}
