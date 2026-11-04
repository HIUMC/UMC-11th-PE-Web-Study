export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto flex min-h-23 w-[min(1280px,calc(100%-48px))] flex-col items-center justify-center gap-2 py-5 text-center text-[11px] text-slate-400 sm:flex-row sm:gap-4">
        <img
          className="w-19"
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
        />
        <p>
          본 서비스는 학습 목적으로 제작되었으며, 영화 정보는 TMDB를
          참고했습니다.
        </p>
      </div>
    </footer>
  );
}
