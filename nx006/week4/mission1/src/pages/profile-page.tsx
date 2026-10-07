import { useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { FormField } from '../components/form-field'
import { Icon } from '../components/icon'
import { MovieGrid } from '../components/movies/movie-grid'
import { Pagination } from '../components/movies/pagination'
import type { Movie } from '../types/movie'
import type { Profile } from '../types/profile'
import { useBookmarkStore } from '../stores/bookmark-store'

interface Props { profile: Profile; movies: Movie[]; editing: boolean; onSave: (profile: Profile) => string | undefined; onDelete: () => void; onLogout: () => void; checkNickname: (value: string) => boolean }

export function ProfilePage({ profile, movies, editing, onSave, onDelete, onLogout, checkNickname }: Props) {
  const [nickname, setNickname] = useState(profile.nickname)
  const [avatar, setAvatar] = useState(profile.avatar)
  const [message, setMessage] = useState('')
  const [page, setPage] = useState(1)
  const fileInput = useRef<HTMLInputElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const bookmarkedIds = useBookmarkStore(state => state.bookmarkedMovieIds)
  const bookmarked = movies.filter(movie => bookmarkedIds.includes(movie.id))
  const totalPages = Math.max(1, Math.ceil(bookmarked.length / 5))
  const safePage = Math.min(page, totalPages)
  const avatarView = <span className="grid size-[82px] shrink-0 place-items-center overflow-hidden rounded-full bg-[#e3e6eb]">{avatar ? <img className="size-full object-cover" src={avatar} alt="프로필 이미지" /> : <Icon name="person" />}</span>
  if (!editing) return <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-6 md:px-8 xl:px-20" id="main-content" tabIndex={-1}>
    <div className="flex items-center justify-between gap-4"><h1 className="text-[26px] leading-[34px] font-bold tracking-[-1.35px] min-[701px]:text-[30px] min-[701px]:leading-10">내 정보</h1><Link className="inline-flex h-[42px] items-center justify-center rounded-lg bg-[#2563eb] px-3 text-xs font-extrabold text-white min-[421px]:px-4 min-[421px]:text-sm" to="/profile/edit">정보 수정</Link></div>
    <section className="mt-7 border-y border-[#e3e6eb] py-3"><h2 className="mb-4 text-lg font-bold">기본 정보</h2><div className="flex items-center gap-7">{avatarView}<dl className="grid w-full max-w-[760px] grid-cols-1 gap-4 min-[701px]:grid-cols-2 min-[701px]:gap-7"><div><dt className="mb-1.5 text-[11px] text-[#969da8]">닉네임</dt><dd className="break-all text-sm font-bold">{profile.nickname}</dd></div><div><dt className="mb-1.5 text-[11px] text-[#969da8]">이메일</dt><dd className="break-all text-sm font-bold">{profile.email}</dd></div></dl></div></section>
    <section className="mt-7"><h2 className="mb-4 text-lg font-bold">내 즐겨찾기</h2>{bookmarked.length ? <><MovieGrid movies={bookmarked.slice((safePage - 1) * 5, safePage * 5)} showBookmark={false} /><Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} /></> : <p className="py-[60px] text-center leading-relaxed text-[#606774]">아직 즐겨찾기한 영화가 없어요. 영화 목록에서 북마크를 눌러 보세요.</p>}</section>
    <button className="mt-7 text-xs font-extrabold text-[#606774]" type="button" onClick={onLogout}>로그아웃</button>
  </main>
  return <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 py-6 md:px-8 xl:px-20" id="main-content" tabIndex={-1}>
    <div className="flex items-start justify-between gap-4 min-[701px]:items-center"><div><h1 className="text-[26px] leading-[34px] font-bold tracking-[-1.35px] min-[701px]:text-[30px]">내 정보 수정</h1><p className="mt-[9px] text-xs leading-[18px] text-[#606774] min-[701px]:text-sm">닉네임과 프로필 이미지만 변경할 수 있어요.</p></div><button className="inline-flex h-[42px] shrink-0 items-center justify-center rounded-lg bg-[#2563eb] px-2.5 text-xs font-extrabold text-white min-[421px]:px-4 min-[421px]:text-sm" type="submit" form="profile-form">변경사항 저장</button></div>
    <form id="profile-form" className="mt-8 grid grid-cols-1 gap-6 min-[701px]:grid-cols-2" onSubmit={event => { event.preventDefault(); setMessage(onSave({ ...profile, nickname: nickname.trim(), avatar }) ?? '') }}>
      <div className="flex h-[151px] flex-col items-center justify-center gap-1 text-sm"><button type="button" className="relative" aria-label="프로필 이미지 선택" onClick={() => fileInput.current?.click()}>{avatarView}<span className="absolute right-0 bottom-0 grid size-6 place-items-center rounded-full border-2 border-[#17191e] bg-[#f6f7f9]"><Icon name="edit" /></span></button>
        <strong>프로필 이미지</strong><p className="text-[11px] leading-[16.5px] text-[#969da8]">선택 사항 · 최대 5MB</p>
        <input ref={fileInput} id="profile-image" name="avatar" aria-label="프로필 이미지 파일" className="sr-only" tabIndex={-1} type="file" accept="image/png,image/jpeg,image/webp" onChange={event => {
          const file = event.target.files?.[0]
          if (!file) return
          if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setMessage('PNG, JPG, WebP 이미지(최대 5MB)를 선택해 주세요.'); return }
          const reader = new FileReader()
          reader.onload = () => { setAvatar(String(reader.result)); setMessage('') }
          reader.onerror = () => setMessage('이미지를 읽지 못했어요. 다시 선택해 주세요.')
          reader.readAsDataURL(file)
        }} />
      </div>
      <div className="flex flex-col gap-5"><FormField id="profile-nickname" label="닉네임" required minLength={2} maxLength={12} value={nickname} onChange={event => setNickname(event.target.value)} action={<button type="button" className="whitespace-nowrap text-xs font-extrabold text-[#2563eb]" onClick={() => setMessage(nickname.trim().length < 2 ? '닉네임은 2–12자로 입력해 주세요.' : checkNickname(nickname.trim()) ? '사용할 수 있어요.' : '이미 사용 중인 닉네임이에요.')}>중복 확인</button>} />
        <FormField id="profile-email" label="이메일" type="email" value={profile.email} readOnly />{message && <p className="text-[13px] leading-5 text-[#2563eb]" role="status">{message}</p>}
      </div>
    </form>
    <section className="mt-[60px] flex flex-col items-start justify-between gap-5 rounded-[10px] border border-[#d92d20] bg-[#d92d201a] p-5 text-[#d92d20] min-[701px]:mt-[max(48px,calc(100vh-576px))] min-[701px]:flex-row min-[701px]:items-center"><div><h2 className="mb-1 text-sm font-bold">회원 탈퇴</h2><p className="text-[11px] leading-[16.5px]">탈퇴하면 이 데모 계정과 평점·후기가 삭제됩니다. 이 브라우저의 즐겨찾기는 유지됩니다.</p></div><button type="button" className="inline-flex h-[42px] items-center justify-center rounded-lg border border-[#d92d20] bg-white px-4 text-sm font-extrabold whitespace-nowrap" onClick={() => dialog.current?.showModal()}>회원 탈퇴</button></section>
    <dialog className="m-auto max-w-[calc(100%-32px)] rounded-xl border border-[#e3e6eb] bg-white p-7 backdrop:bg-[#17191e66]" ref={dialog}><h2 className="text-lg font-bold">회원 탈퇴</h2><p className="my-4">이 데모 계정과 평점·후기를 삭제할까요?</p><div className="flex justify-end gap-3"><button type="button" className="rounded-lg border border-[#e3e6eb] px-4 py-2" onClick={() => dialog.current?.close()}>취소</button><button type="button" className="rounded-lg border border-[#d92d20] px-4 py-2 text-[#d92d20]" onClick={onDelete}>탈퇴하기</button></div></dialog>
  </main>
}
