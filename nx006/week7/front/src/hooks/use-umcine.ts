import { useState } from 'react'
import type { Review } from '../types/profile'

export function useUmcine() {
  // 영화 조회는 Query, 북마크/화면 설정은 Zustand, 후기 실습만 메모리 상태다.
  // 7주차 가입을 가짜 로그인으로 연결하지 않는다. 인증은 8주차 범위다.
  const [reviews, setReviews] = useState<Record<number, Review>>({})
  function saveReview(movieId: number, review: Review) {
    setReviews(current => ({ ...current, [movieId]: review }))
  }
  return { reviews, saveReview }
}
