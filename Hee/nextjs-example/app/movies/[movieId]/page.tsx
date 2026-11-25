import Image from "next/image";
import { notFound } from "next/navigation";
import BookmarkButton from "@/components/bookmark-button";
import { getMovie } from "@/lib/movies";

export default async function MovieDetail({params}:PageProps<"/movies/[movieId]">){
  const {movieId}=await params; const id=Number(movieId); if(!Number.isInteger(id)||id<1)notFound(); const movie=await getMovie(id); if(!movie)notFound();
  return <main className="min-h-[calc(100vh-64px)] bg-[#f7f8fa]">
    <section className="relative min-h-[380px] overflow-hidden bg-gray-900 text-white">{movie.backdropPath&&<Image src={movie.backdropPath} alt="" fill priority sizes="100vw" className="object-cover opacity-35"/>}<div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent"/>
      <div className="relative mx-auto flex max-w-[1000px] gap-7 px-5 py-14"><div className="relative hidden aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-xl sm:block">{movie.posterPath&&<Image src={movie.posterPath} alt={`${movie.title} 포스터`} fill sizes="192px" className="object-cover"/>}</div>
        <div className="self-end"><p className="text-sm text-gray-300">{movie.originalTitle}</p><h1 className="mt-1 text-4xl font-bold">{movie.title}</h1><p className="mt-3 text-sm text-gray-200">{[movie.releaseDate,movie.genres.join(" · "),movie.runtime].filter(Boolean).join(" · ")}</p><p className="mt-5 max-w-2xl leading-7 text-gray-100">{movie.overview}</p><div className="mt-6"><BookmarkButton movieId={movie.id}/></div></div>
      </div>
    </section>{movie.tagline&&<section className="mx-auto max-w-[1000px] px-5 py-10"><h2 className="text-xl font-bold">한 줄 소개</h2><p className="mt-3 text-gray-600">{movie.tagline}</p></section>}
  </main>;
}
