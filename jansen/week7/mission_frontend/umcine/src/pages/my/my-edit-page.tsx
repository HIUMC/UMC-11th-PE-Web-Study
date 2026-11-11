import { useRef, useState } from "react";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MOCK_EMAIL = "gwangsoo@cinemalab.kr";

export function MyEditPage() {
  const [nickname, setNickname] = useState("gs0428");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      alert("이미지는 최대 5MB까지 선택할 수 있어요.");
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    // 8주차에서 수정 API 연결
    alert(`저장할 닉네임: ${nickname}`);
  };

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-6">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">내 정보 수정</h1>
          <p className="mt-2 text-sm text-gray-500">
            닉네임과 프로필 이미지만 변경할 수 있어요.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"
        >
          변경사항 저장
        </button>
      </div>

      <div className="grid grid-cols-2 gap-10">
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center pt-4">
          <div className="relative">
            <div className="flex h-[82px] w-[82px] items-center justify-center overflow-hidden rounded-full bg-gray-200">
              {previewUrl ? (
                <img src={previewUrl} alt="프로필 미리보기" className="h-full w-full object-cover" />
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
                </svg>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-900 bg-white"
              aria-label="프로필 이미지 변경"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChangeImage}
            />
          </div>
          <p className="mt-2 text-sm font-bold text-gray-900">프로필 이미지</p>
          <p className="mt-0.5 text-[11px] text-gray-400">선택 사항 · 최대 5MB</p>
        </div>

        {/* 닉네임, 이메일 */}
        <div>
          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold text-gray-900">닉네임</label>
            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 pr-24 text-sm text-gray-900 outline-none focus:border-blue-600"
              />
              {/* 8주차에서 중복 확인 API 연결 */}
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600"
              >
                중복 확인
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-gray-900">이메일</label>
            <input
              type="email"
              value={MOCK_EMAIL}
              readOnly
              className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 회원 탈퇴 */}
      <section className="mt-28 flex items-center justify-between rounded-lg border border-red-500 bg-red-50 px-5 py-5">
        <div>
          <h2 className="text-sm font-bold text-red-600">회원 탈퇴</h2>
          <p className="mt-1 text-xs text-red-500">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-red-500 bg-white px-5 py-2.5 text-sm font-bold text-red-600"
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}