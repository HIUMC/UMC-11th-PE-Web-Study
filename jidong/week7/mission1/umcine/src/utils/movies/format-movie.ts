// TMDB 개봉일은 2026-07-29 형태라서 디자인에 맞게 2026.07.29로 바꿈
export function formatReleaseDate(releaseDate: string) {
  return releaseDate ? releaseDate.replaceAll("-", ".") : "개봉일 정보 없음";
}

// 145 → "2시간 25분", null → 안내 문구
export function formatRuntime(runtime: number | null) {
  if (runtime === null || runtime <= 0) {
    return "상영 시간 정보가 없어요.";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}
