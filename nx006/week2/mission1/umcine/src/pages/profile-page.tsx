import { useRef, useState } from 'react'
import { FormField } from '../components/form-field'
import { Icon } from '../components/icon'
import { MovieGrid } from '../components/movie-grid'
import { Pagination } from '../components/pagination'
import type { Movie } from '../types/movie'
import type { Profile } from '../types/profile'

interface Props { profile: Profile; movies: Movie[]; editing: boolean; onSave: (profile: Profile) => string | undefined; onDelete: () => void; onLogout: () => void; onToggleBookmark: (id: number) => void; checkNickname: (value: string) => boolean }

export function ProfilePage({ profile, movies, editing, onSave, onDelete, onLogout, onToggleBookmark, checkNickname }: Props) {
  const [nickname, setNickname] = useState(profile.nickname)
  const [avatar, setAvatar] = useState(profile.avatar)
  const [message, setMessage] = useState('')
  const [page, setPage] = useState(1)
  const fileInput = useRef<HTMLInputElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const bookmarked = movies.filter(movie => movie.isBookmarked)
  const totalPages = Math.max(1, Math.ceil(bookmarked.length / 5))
  const safePage = Math.min(page, totalPages)
  const avatarView = <span className="avatar">{avatar ? <img className="avatar-image" src={avatar} alt="프로필 이미지" /> : <Icon name="person" />}</span>
  if (!editing) return <main className="container profile-page" id="main-content" tabIndex={-1}>
    <div className="profile-heading"><h1>내 정보</h1><a className="button primary" href="#/profile/edit">정보 수정</a></div>
    <section className="profile-info"><h2>기본 정보</h2><div className="profile-info-content">{avatarView}<dl><div><dt>닉네임</dt><dd>{profile.nickname}</dd></div><div><dt>이메일</dt><dd>{profile.email}</dd></div></dl></div></section>
    <section className="favorites"><h2>내 즐겨찾기</h2>{bookmarked.length ? <><MovieGrid movies={bookmarked.slice((safePage - 1) * 5, safePage * 5)} onToggleBookmark={onToggleBookmark} showBookmark={false} /><Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} /></> : <p className="empty-state">아직 즐겨찾기한 영화가 없어요. 영화 목록에서 북마크를 눌러 보세요.</p>}</section>
    <button className="text-link logout" type="button" onClick={onLogout}>로그아웃</button>
  </main>
  return <main className="container profile-edit-page" id="main-content" tabIndex={-1}>
    <div className="profile-heading"><div><h1>내 정보 수정</h1><p className="page-description">닉네임과 프로필 이미지만 변경할 수 있어요.</p></div><button className="button primary" type="submit" form="profile-form">변경사항 저장</button></div>
    <form id="profile-form" className="profile-edit-form" onSubmit={event => { event.preventDefault(); setMessage(onSave({ ...profile, nickname: nickname.trim(), avatar }) ?? '') }}>
      <div className="avatar-editor"><button type="button" className="avatar-upload" aria-label="프로필 이미지 선택" onClick={() => fileInput.current?.click()}>{avatarView}<span className="edit-badge"><Icon name="edit" /></span></button>
        <strong>프로필 이미지</strong><p className="field-hint">선택 사항 · 최대 5MB</p>
        <input ref={fileInput} id="profile-image" name="avatar" aria-label="프로필 이미지 파일" className="visually-hidden" tabIndex={-1} type="file" accept="image/png,image/jpeg,image/webp" onChange={event => {
          const file = event.target.files?.[0]
          if (!file) return
          if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setMessage('PNG, JPG, WebP 이미지(최대 5MB)를 선택해 주세요.'); return }
          const reader = new FileReader()
          reader.onload = () => { setAvatar(String(reader.result)); setMessage('') }
          reader.onerror = () => setMessage('이미지를 읽지 못했어요. 다시 선택해 주세요.')
          reader.readAsDataURL(file)
        }} />
      </div>
      <div className="profile-fields"><FormField id="profile-nickname" label="닉네임" required minLength={2} maxLength={12} value={nickname} onChange={event => setNickname(event.target.value)} action={<button type="button" className="text-link" onClick={() => setMessage(nickname.trim().length < 2 ? '닉네임은 2–12자로 입력해 주세요.' : checkNickname(nickname.trim()) ? '사용할 수 있어요.' : '이미 사용 중인 닉네임이에요.')}>중복 확인</button>} />
        <FormField id="profile-email" label="이메일" type="email" value={profile.email} readOnly />{message && <p className="form-message" role="status">{message}</p>}
      </div>
    </form>
    <section className="danger-zone"><div><h2>회원 탈퇴</h2><p>탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.</p></div><button type="button" className="button danger" onClick={() => dialog.current?.showModal()}>회원 탈퇴</button></section>
    <dialog ref={dialog}><h2>회원 탈퇴</h2><p>이 데모 계정의 평점과 즐겨찾기를 삭제할까요?</p><div className="dialog-actions"><button type="button" className="button" onClick={() => dialog.current?.close()}>취소</button><button type="button" className="button danger" onClick={onDelete}>탈퇴하기</button></div></dialog>
  </main>
}
