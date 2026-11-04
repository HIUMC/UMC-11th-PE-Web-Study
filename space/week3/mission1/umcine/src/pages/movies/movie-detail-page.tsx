import { Link, useParams } from "@tanstack/react-router";
import { initialMovies as movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return <main>영화를 찾을 수 없어요.</main>;
  }

  return (
    <main>
      <div className="w-auto h-96 relative inline-flex flex-col justify-center items-start overflow-hidden">
        <img
          src={movie.backdropPath}
          className="self-stretch flex-1 relative"
          alt=""
          aria-hidden="true"
        />
        <div className="w-auto h-96 px-20 py-6 left-0 top-0 absolute flex flex-col justify-between items-start">
          <Link to="/">
          <div className="size- inline-flex justify-start items-center gap-1">
            <div className="size-6 relative overflow-hidden">
              <img
                className="size-full brightness-0 invert"
                src="/icons/chevron-left.svg"
                alt="뒤로가기"
              />
            </div>

            <div className="text-center justify-center text-[#FFFFFF] text-xs font-bold font-['Pretendard']">
              영화 목록
            </div>
          </div>
          </Link>
          <div className="w-[800px] flex flex-col justify-start items-start gap-2">
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch text-[#FFFFFF] text-5xl font-bold font-['Pretendard'] leading-[49.68px]">
                {movie.title}
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch text-[#FFFFFF] text-sm font-normal font-['Pretendard']">
                {movie.originalTitle}
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="size- inline-flex flex-col justify-start items-start">
                <div className="self-stretch text-[#FFFFFF] text-xs font-bold font-['Pretendard']">
                  {movie.releaseDate}
                </div>
              </div>
              <div className="size- inline-flex flex-col justify-start items-start">
                <div className="self-stretch text-[#FFFFFF] text-xs font-bold font-['Pretendard']">
                  {movie.genres.join(" · ")}
                </div>
              </div>
              <div className="size- inline-flex flex-col justify-start items-start">
                <div className="self-stretch text-[#FFFFFF] text-xs font-bold font-['Pretendard']">
                  {movie.runtime}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="self-stretch px-20 py-6 inline-flex justify-start items-start gap-8">
          <div className="w-48 h-72 bg-bg-page rounded-[10px] shadow-[0px_12px_30px_0px_rgba(12,15,20,0.12)] inline-flex flex-col justify-center items-start overflow-hidden">
            <img
              className="self-stretch flex-1 relative"
              src={movie.posterPath}
            />
          </div>
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-3">
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-text-primary text-xl font-bold font-['Pretendard']">
                {movie.tagline}
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-text-secondary text-sm font-normal font-['Pretendard'] leading-6">
                {movie.overview}
              </div>
            </div>
            <div className="size- inline-flex justify-start items-start">
              <div className="h-10 px-4 bg-action-primary rounded-lg outline outline-1 outline-offset-[-1px] outline-bg-surface flex justify-center items-center gap-2">
                <div className="size-4 relative overflow-hidden">
                    <img src="/icons/bookmark.svg"></img>
                </div>
                <div className="text-center justify-center text-bg-surface text-sm font-extrabold font-['Pretendard']">
                  즐겨찾기
                </div>
              </div>
            </div>
          </div>
          <div className="w-96 pl-7 pb-10 border-l border-border-default inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-text-primary text-xl font-bold font-['Pretendard']">
                내 평점
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-text-tertiary text-xs font-normal font-['Pretendard']">
                별점은 필수, 후기는 선택이에요.
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-start gap-1">
              <div className="size-9 px-1.5 py-px bg-bg-surface rounded-lg outline outline-1 outline-offset-[-1px] outline-border-default inline-flex flex-col justify-center items-center">
                <div className="size-6 relative overflow-hidden">
                  <img className="size-5" src="/icons/star.svg" alt="" aria-hidden="true" />
                </div>
              </div>
              <div className="size-9 px-1.5 py-px bg-bg-surface rounded-lg outline outline-1 outline-offset-[-1px] outline-border-default inline-flex flex-col justify-center items-center">
                <div className="size-6 relative overflow-hidden">
                  <img className="size-5" src="/icons/star.svg" alt="" aria-hidden="true" />
                </div>
              </div>
              <div className="size-9 px-1.5 py-px bg-bg-surface rounded-lg outline outline-1 outline-offset-[-1px] outline-border-default inline-flex flex-col justify-center items-center">
                <div className="size-6 relative overflow-hidden">
                  <img className="size-5" src="/icons/star.svg" alt="" aria-hidden="true" />
                </div>
              </div>
              <div className="size-9 px-1.5 py-px bg-bg-surface rounded-lg outline outline-1 outline-offset-[-1px] outline-border-default inline-flex flex-col justify-center items-center">
                <div className="size-6 relative overflow-hidden">
                  <img className="size-5" src="/icons/star.svg" alt="" aria-hidden="true" />
                </div>
              </div>
              <div className="size-9 px-1.5 py-px bg-bg-surface rounded-lg outline outline-1 outline-offset-[-1px] outline-border-default inline-flex flex-col justify-center items-center">
                <div className="size-6 relative overflow-hidden">
                  <img className="size-5" src="/icons/star.svg" alt="" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="self-stretch h-24 px-3 py-4 bg-bg-surface rounded-lg outline outline-1 outline-offset-[-1px] outline-border-default inline-flex justify-center items-start overflow-hidden">
              <div className="flex-1 inline-flex flex-col justify-start items-start">
                <div className="self-stretch justify-center text-text-tertiary text-xs font-normal font-['Pretendard'] leading-5">
                  영화를 보고 느낀 점을 남겨보세요.
                </div>
              </div>
            </div>
            <div className="self-stretch h-10 px-4 bg-text-primary rounded-lg outline outline-1 outline-offset-[-1px] outline-bg-surface inline-flex justify-center items-center">
              <div className="text-center justify-center text-bg-surface text-sm font-extrabold font-['Pretendard']">
                평점 저장
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
