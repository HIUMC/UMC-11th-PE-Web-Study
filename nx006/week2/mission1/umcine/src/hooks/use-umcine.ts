import { useState } from 'react'
import { movies as initialMovies } from '../data/movies'
import { searchMovies } from '../data/search-movies'
import { navigate } from './use-route'
import type { Movie } from '../types/movie'
import type { Profile, Review } from '../types/profile'

interface DemoAccount { profile: Profile; password: string }
interface Library { bookmarks: number[]; reviews: Record<number, Review> }
const demoAccount: DemoAccount = { profile: { nickname: 'gs0428', email: 'gwangsoo@cinemalab.kr' }, password: 'Demo123!' }

export function useUmcine() {
  // 2주차: 공통 부모가 상태를 소유하고 props와 콜백으로 전달한다.
  const [movies, setMovies] = useState<Movie[]>([...initialMovies, ...searchMovies])
  const [currentPage, setCurrentPage] = useState(1)
  // 서버가 없는 수업용 데모. 계정/비밀번호/이미지를 디스크나 외부 서버에 저장하지 않는다.
  const [accounts, setAccounts] = useState<DemoAccount[]>([demoAccount])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [reviews, setReviews] = useState<Record<number, Review>>({})
  const [libraries, setLibraries] = useState<Record<string, Library>>({
    'gwangsoo@cinemalab.kr': { bookmarks: [1, 2, 5], reviews: {} },
  })
  function handleToggleBookmark(movieId: number) {
    setMovies(currentMovies => currentMovies.map(movie => movie.id === movieId ? { ...movie, isBookmarked: !movie.isBookmarked } : movie))
  }
  function available(field: 'email' | 'nickname', value: string) {
    return !accounts.some(account => account.profile[field].toLowerCase() === value.trim().toLowerCase())
  }
  function changeProfile(nextProfile: Profile | null, discardCurrent = false) {
    if (nextProfile?.email === profile?.email) return
    const currentKey = profile?.email ?? 'guest'
    const nextKey = nextProfile?.email ?? 'guest'
    const nextLibrary = libraries[nextKey] ?? {
      bookmarks: nextProfile ? [] : initialMovies.filter(movie => movie.isBookmarked).map(movie => movie.id),
      reviews: {},
    }
    setLibraries(current => {
      const updated = { ...current }
      if (discardCurrent) delete updated[currentKey]
      else updated[currentKey] = { bookmarks: movies.filter(movie => movie.isBookmarked).map(movie => movie.id), reviews }
      return updated
    })
    setMovies(current => current.map(movie => ({ ...movie, isBookmarked: nextLibrary.bookmarks.includes(movie.id) })))
    setReviews(nextLibrary.reviews)
    setProfile(nextProfile)
  }
  function authenticate(user: Profile, password: string, signup: boolean) {
    if (signup) {
      if (user.nickname.length < 2 || user.nickname.length > 12) return '닉네임은 2–12자로 입력해 주세요.'
      if (!available('email', user.email) || !available('nickname', user.nickname)) return '이미 사용 중인 이메일 또는 닉네임이에요.'
      setAccounts(current => [...current, { profile: user, password }])
      changeProfile(user)
    } else {
      const account = accounts.find(item => item.profile.email.toLowerCase() === user.email.trim().toLowerCase() && item.password === password)
      if (!account) return '이메일 또는 비밀번호를 확인해 주세요.'
      changeProfile(account.profile)
    }
    navigate('/profile')
    return undefined
  }
  function saveProfile(updated: Profile) {
    if (!profile) return '로그인이 필요해요.'
    if (updated.nickname.length < 2 || updated.nickname.length > 12) return '닉네임은 2–12자로 입력해 주세요.'
    if (updated.nickname !== profile.nickname && !available('nickname', updated.nickname)) return '이미 사용 중인 닉네임이에요.'
    setAccounts(current => current.map(account => account.profile.email === profile.email ? { ...account, profile: updated } : account))
    setProfile(updated)
    navigate('/profile')
    return undefined
  }
  function logout() { changeProfile(null); navigate('/') }
  function deleteAccount() {
    if (!profile) return
    setAccounts(current => current.filter(account => account.profile.email !== profile.email))
    changeProfile(null, true)
    navigate('/')
  }
  function saveReview(movieId: number, review: Review) {
    setReviews(current => ({ ...current, [movieId]: review }))
  }
  return { movies, currentPage, setCurrentPage, profile, reviews, available,
    toggleBookmark: handleToggleBookmark, authenticate, saveProfile, logout, deleteAccount, saveReview }
}
