import type { Movie } from "../types/movie";

const movieRows = [
  [1, "스파이더맨: 브랜드 뉴 데이", "Spider-Man: Brand New Day", "2026.07.29", "spider-man-brand-new-day", ["SF", "액션", "모험"], "2시간 25분", "스파이더맨의 새로운 여정을 확인하라!", "모두의 기억에서 사라진 피터 파커가 새로운 위협과 자신의 정체를 마주하는 이야기를 그립니다.", false],
  [2, "오디세이", "The Odyssey", "2026.08.05", "odyssey", ["모험", "드라마"], "2시간 30분", "집으로 돌아가기 위한 가장 긴 여정", "긴 전쟁을 마친 영웅이 수많은 시련을 지나 고향으로 돌아가는 여정을 그린 작품입니다.", true],
  [3, "스파이더맨: 노 웨이 홈", "Spider-Man: No Way Home", "2021.12.15", "spider-man-no-way-home", ["액션", "모험", "SF"], "2시간 28분", "모든 세계의 위협이 하나로 이어진다", "정체가 드러난 피터 파커가 위기를 해결하려는 과정에서 여러 세계의 문이 열립니다.", false],
  [4, "라스트 하우스", "The Last House", "2026.08.07", "last-house", ["스릴러", "미스터리"], "1시간 42분", "마지막 문을 열면 진실이 드러난다", "외딴 별장에 모인 사람들에게 감춰진 사건의 흔적이 하나씩 발견됩니다.", false],
  [5, "미니언즈 & 몬스터즈", "Minions & Monsters", "2026.07.15", "minions-monsters", ["애니메이션", "코미디", "모험"], "1시간 35분", "작은 영웅들의 거대한 소동", "미니언들이 새로운 친구를 만나며 예측할 수 없는 모험을 시작합니다.", false],
  [6, "군체", "Colony", "2026.05.21", "colony", ["SF", "스릴러"], "1시간 48분", "하나의 신호가 모두를 바꾼다", "고립된 극지 기지의 구성원들이 정체를 알 수 없는 신호와 마주합니다.", false],
  [7, "토이 스토리 5", "Toy Story 5", "2026.06.17", "toy-story-5", ["애니메이션", "모험", "가족"], "1시간 45분", "장난감들의 새로운 모험이 시작된다", "우디와 친구들이 새로운 주인을 만나며 장난감의 의미를 다시 찾아갑니다.", true],
  [8, "로빈 후드의 죽음", "The Death of Robin Hood", "2026.06.18", "death-of-robin-hood", ["액션", "모험", "드라마"], "2시간 10분", "전설의 마지막 여정", "오랜 전쟁을 마친 로빈 후드가 자신의 마지막 선택과 마주합니다.", false],
  [9, "집착", "Obsession", "2026.09.02", "obsession", ["스릴러", "드라마"], "1시간 50분", "완벽한 믿음은 집착으로 변한다", "한 사람을 향한 믿음이 점차 위험한 집착으로 바뀌기 시작합니다.", false],
  [10, "이블 데드 번", "Evil Dead Burn", "2026.07.07", "evil-dead-burn", ["공포", "스릴러"], "1시간 40분", "끝없는 불길 속에서 악이 깨어난다", "버려진 마을을 찾은 사람들이 오래 잠들어 있던 악을 깨웁니다.", false],
] as const;

export const movies: Movie[] = movieRows.map(([id, title, originalTitle, releaseDate, slug, genres, runtime, tagline, overview, isBookmarked]) => ({
  id, title, originalTitle, releaseDate, posterPath: `/images/movies/${slug}.jpg`, backdropPath: `/images/movies/${slug}-backdrop.jpg`, genres: [...genres], runtime, tagline, overview, isBookmarked,
}));
