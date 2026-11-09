import { useState, type SubmitEvent } from "react";
import { cn } from "../../utils/cn";

interface MyInfo {
  email: string;
  nickname: string;
  bio: string;
}

const BIO_MAX_LENGTH = 100;

// 퍼블리싱 단계라 API 대신 임시 데이터를 써요.
const INITIAL_MY_INFO: MyInfo = {
  email: "subin@umc.com",
  nickname: "수빈",
  bio: "주말마다 영화 한 편씩 보는 중이에요.",
};

export function MyInfoPage() {
  const [myInfo, setMyInfo] = useState<MyInfo>(INITIAL_MY_INFO);
  const [draft, setDraft] = useState<MyInfo>(INITIAL_MY_INFO);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const trimmedNickname = draft.nickname.trim();
  const isNicknameValid = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isBioValid = draft.bio.length <= BIO_MAX_LENGTH;
  const isChanged = trimmedNickname !== myInfo.nickname || draft.bio.trim() !== myInfo.bio;
  const canSave = isNicknameValid && isBioValid && isChanged;

  const handleStartEdit = () => {
    setDraft(myInfo);
    setIsEditing(true);
    setIsSaved(false);
  };

  const handleCancel = () => {
    setDraft(myInfo);
    setIsEditing(false);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;

    setMyInfo({ ...myInfo, nickname: trimmedNickname, bio: draft.bio.trim() });
    setIsEditing(false);
    setIsSaved(true);
  };

  return (
    <main className="page-content my-page">
      <section className="page-heading" aria-labelledby="my-title">
        <div>
          <p className="eyebrow">MY PAGE</p>
          <h1 id="my-title">내 정보</h1>
          <p className="page-description">프로필 정보를 확인하고 수정할 수 있어요.</p>
        </div>
        {!isEditing && (
          <button className="secondary-button" type="button" onClick={handleStartEdit}>
            <img src="/icons/edit.svg" alt="" />
            정보 수정
          </button>
        )}
      </section>

      {isSaved && (
        <p className="form-result" role="status">
          내 정보를 저장했어요.
        </p>
      )}

      <section className="profile-card">
        <div className="profile-avatar" aria-hidden="true">
          {myInfo.nickname.charAt(0)}
        </div>

        {isEditing ? (
          <form className="auth-form profile-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="my-email">이메일</label>
              <div className="input-box readonly">
                <img src="/icons/mail.svg" alt="" />
                <input id="my-email" type="email" value={draft.email} readOnly />
              </div>
              <p className="field-hint">이메일은 변경할 수 없어요.</p>
            </div>

            <div className="form-field">
              <label htmlFor="my-nickname">닉네임</label>
              <div className={cn("input-box", !isNicknameValid && "invalid")}>
                <img src="/icons/person.svg" alt="" />
                <input
                  id="my-nickname"
                  type="text"
                  value={draft.nickname}
                  onChange={(event) => setDraft((prev) => ({ ...prev, nickname: event.target.value }))}
                  placeholder="2~12자 닉네임"
                />
              </div>
              {!isNicknameValid && <p className="field-error">닉네임은 2~12자로 입력해 주세요.</p>}
            </div>

            <div className="form-field">
              <label htmlFor="my-bio">한 줄 소개</label>
              <textarea
                id="my-bio"
                className={cn("textarea-box", !isBioValid && "invalid")}
                value={draft.bio}
                onChange={(event) => setDraft((prev) => ({ ...prev, bio: event.target.value }))}
                placeholder="나를 소개해 주세요"
                rows={3}
              />
              <p className={cn("field-hint", !isBioValid && "field-error")}>
                {draft.bio.length} / {BIO_MAX_LENGTH}
              </p>
            </div>

            <div className="form-actions">
              <button className="secondary-button" type="button" onClick={handleCancel}>
                취소
              </button>
              <button className="primary-button" type="submit" disabled={!canSave}>
                저장
              </button>
            </div>
          </form>
        ) : (
          <dl className="profile-info">
            <div>
              <dt>닉네임</dt>
              <dd>{myInfo.nickname}</dd>
            </div>
            <div>
              <dt>이메일</dt>
              <dd>{myInfo.email}</dd>
            </div>
            <div>
              <dt>한 줄 소개</dt>
              <dd>{myInfo.bio || <span className="profile-empty">아직 소개가 없어요.</span>}</dd>
            </div>
          </dl>
        )}
      </section>
    </main>
  );
}

export default MyInfoPage;
