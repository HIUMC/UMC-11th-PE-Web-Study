import type { Movie } from '../types/movie'

// Figma 검색 결과 프레임의 추가 예시. 2주차 목록 10편은 movies.ts에 보존한다.
export const searchMovies: Movie[] = [
  { id: 11, title: '스파이더맨', originalTitle: 'Spider-Man', releaseDate: '2002.05.03', posterPath: '/figma/spider-man.png', overview: '방사능 거미에 물려 특별한 능력을 얻은 피터 파커는 벤 아저씨의 죽음을 계기로 그 힘을 악에 맞서는 데 쓰기로 한다.' },
  { id: 12, title: '스파이더맨: 홈커밍', originalTitle: 'Spider-Man: Homecoming', releaseDate: '2017.07.05', posterPath: '/figma/homecoming.png', overview: '평범한 고등학생과 히어로 사이를 오가는 피터는 스스로의 힘으로 새로운 빌런을 막으려 한다.' },
  { id: 13, title: '어메이징 스파이더맨', originalTitle: 'The Amazing Spider-Man', releaseDate: '2012.06.28', posterPath: '/figma/amazing-spider-man.png', overview: '부모의 실종을 추적하던 피터는 코너스 박사의 연구실에서 사고를 겪고 특별한 능력을 얻는다.' },
  { id: 14, title: '스파이더맨 3', originalTitle: 'Spider-Man 3', releaseDate: '2007.05.01', posterPath: '/figma/spider-man-3.png', overview: '심비오트에 감염된 피터는 강력해진 힘에 도취되고, 뉴 고블린과 샌드맨의 위협을 동시에 마주한다.' },
].map(movie => ({ ...movie, backdropPath: '', genres: [], runtime: '', tagline: movie.title, isBookmarked: false }))
