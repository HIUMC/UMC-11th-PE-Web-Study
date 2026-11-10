import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth-store";
import { getMe, updateMe, type MemberProfile } from "../api/members/me";
import { apiErrorMessage } from "../api/api-client";
import { useBookmarkStore } from "../store/bookmark-store";
import { imageUrl, movieApi } from "../api/tmdb";
import { checkNicknameDuplicate } from "../api/members/check-nickname-duplicate";

function Avatar({ src }: { src: string }) {
  return <span className="profile-avatar"><img className={src ? "uploaded-avatar" : ""} src={src || "/icons/movie-icons/person.svg"} alt="프로필 이미지" /></span>;
}

function Favorites() {
  const ids = useBookmarkStore(state => state.bookmarkedIds);
  const [page, setPage] = useState(1);
  const total = Math.max(1, Math.ceil(ids.length / 5));
  const current = Math.min(page, total);
  const queries = useQueries({ queries: ids.slice((current - 1) * 5, current * 5).map(id => ({ queryKey: ["movies", "detail", id], queryFn: () => movieApi.detail(id) })) });
  return <section className="favorites"><h2>내 즐겨찾기</h2>
    {!ids.length && <p className="empty-favorites">아직 즐겨찾기한 영화가 없어요. <a href="/">영화 둘러보기</a></p>}
    <div className="profile-movies">{queries.map((query, index) => query.data ? <a href={`/movies/${query.data.id}`} className="profile-movie" key={query.data.id}><img src={imageUrl(query.data.poster_path)} alt={query.data.title} /><b>{query.data.title}</b><small>{query.data.release_date.replaceAll("-", ".")}</small></a> : <p className="field-message" key={ids[(current - 1) * 5 + index]}>{query.isError ? "영화를 불러오지 못했어요." : "불러오는 중…"}{query.isError && <button type="button" onClick={() => query.refetch()}>다시 시도</button>}</p>)}</div>
    {!!ids.length && <nav className="profile-pagination" aria-label="즐겨찾기 페이지"><button disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="이전 페이지">‹</button><span aria-current="page">{current}</span><button disabled={current === total} onClick={() => setPage(current + 1)} aria-label="다음 페이지">›</button></nav>}
  </section>;
}

function ProfileLoader({ children }: { children: (profile: MemberProfile & { avatar: string }) => ReactNode }) {
  const token = useAuthStore(state => state.token);
  const query = useQuery({ queryKey: ["member", "me"], queryFn: getMe, enabled: !!token, retry: false });
  if (!token) return <main className="profile-page"><p className="notice">로그인이 필요해요. <a className="primary-button" href="/login">로그인</a></p></main>;
  if (query.isPending) return <main className="profile-page"><p className="notice">내 정보를 불러오는 중이에요…</p></main>;
  if (query.isError) return <main className="profile-page"><p className="notice" role="alert">내 정보를 불러오지 못했어요. <button type="button" onClick={() => query.refetch()}>다시 시도</button></p></main>;
  return children({ ...query.data, avatar: localStorage.getItem(`umcine-avatar:${query.data.email}`) || "" });
}

export function ProfilePage() {
  return <ProfileLoader>{profile => <ProfileView profile={profile} />}</ProfileLoader>;
}
function ProfileView({ profile }: { profile: MemberProfile & { avatar: string } }) {
  return <main className="profile-page"><div className="profile-heading"><h1>내 정보</h1><a className="primary-button" href="/mypage/edit">정보 수정</a></div><section className="basic-info"><h2>기본 정보</h2><div className="profile-details"><Avatar src={profile.avatar} /><dl><dt>닉네임</dt><dd>{profile.nickname}</dd></dl><dl><dt>이메일</dt><dd>{profile.email}</dd></dl></div></section><Favorites /></main>;
}

export function ProfileEditPage() {
  return <ProfileLoader>{profile => <ProfileEditor profile={profile} />}</ProfileLoader>;
}
function ProfileEditor({ profile }: { profile: MemberProfile & { avatar: string } }) {
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState(profile.nickname);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [checked, setChecked] = useState("");
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const valid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const changed = nickname.trim() !== profile.nickname;
  async function check() {
    if (!valid || checking || saving) return;
    setChecking(true);
    setMessage("");
    try {
      const response = await checkNicknameDuplicate(nickname.trim());
      setChecked(response.available ? nickname.trim() : "");
      setMessage(response.available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch { setMessage("중복 확인에 실패했어요. 서버 연결을 확인해 주세요."); }
    finally { setChecking(false); }
  }
  function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) { setMessage("JPG, PNG, WEBP 이미지를 최대 5MB까지 선택해 주세요."); event.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => { setAvatar(String(reader.result)); setMessage(""); };
    reader.onerror = () => setMessage("이미지를 읽지 못했어요. 다시 선택해 주세요.");
    reader.readAsDataURL(file);
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || checking || saving || (changed && checked !== nickname.trim())) return;
    setSaving(true);
    setMessage("");
    try {
      const updated = await updateMe(nickname.trim());
      queryClient.setQueryData(["member", "me"], updated);
      try { localStorage.setItem(`umcine-avatar:${profile.email}`, avatar); }
      catch { setMessage("닉네임은 서버에 저장했지만 이미지 저장 공간이 부족해요. 더 작은 이미지를 선택해 주세요."); return; }
      location.assign("/mypage");
    } catch (error) { setMessage(await apiErrorMessage(error)); }
    finally { setSaving(false); }
  }
  return <main className="profile-page edit-page"><form onSubmit={save} noValidate><div className="profile-heading"><div><h1>내 정보 수정</h1><p>닉네임과 프로필 이미지만 변경할 수 있어요.</p></div><button className="primary-button" disabled={!valid || checking || saving || (changed && checked !== nickname.trim())}>{saving ? "저장 중…" : "변경사항 저장"}</button></div>
    <div className="edit-grid"><div className="avatar-editor"><label htmlFor="avatar-upload"><Avatar src={avatar} /><span className="avatar-edit-icon"><img src="/icons/movie-icons/edit.svg" alt="이미지 변경" /></span><strong>프로필 이미지</strong><small>이 브라우저에만 저장 · 최대 5MB</small></label><input id="avatar-upload" className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={saving} /></div><div className="edit-fields">
      <div className="form-field"><label htmlFor="edit-nickname">닉네임</label><div className="input-shell"><input id="edit-nickname" value={nickname} disabled={checking || saving} onChange={e => { setNickname(e.target.value); setChecked(""); setMessage(""); }} /><button className="check-button" type="button" disabled={!valid || checking || saving || !changed} onClick={check}>{checking ? "확인 중" : "중복 확인"}</button></div>{!valid && <p className="field-message error">닉네임은 2–12자로 입력해 주세요.</p>}</div>
      <div className="form-field"><label htmlFor="edit-email">이메일</label><div className="input-shell"><input id="edit-email" value={profile.email} readOnly /></div></div><p className="field-message" role="status">{message}</p>
    </div></div></form><div className="withdrawal"><div><strong>회원 탈퇴</strong><p>탈퇴하면 계정과 정보, 작성한 즐겨찾기가 모두 삭제되어 복구할 수 없습니다.</p></div><button type="button" onClick={() => setMessage("회원 탈퇴는 서버 API 연결 후 사용할 수 있어요.")}>회원 탈퇴</button></div></main>;
}
