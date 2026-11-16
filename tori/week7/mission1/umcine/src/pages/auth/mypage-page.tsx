import { useState } from "react";

export function MyPage() {
  const [nickname, setNickname] = useState("no0428");
  const [email] = useState("gwangsoo@cinemalab.kr");

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("변경사항이 저장되었습니다.");
  };

  const handleWithdraw = () => {
    const confirmed = window.confirm(
      "정말 회원 탈퇴하시겠습니까?"
    );

    if (confirmed) {
      alert("회원 탈퇴 API는 추후 연결할 예정입니다.");
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1280px] flex-col px-10 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">내 정보 수정</h1>
          <p className="mt-2 text-xs text-gray-400">
            내 정보를 조회하고 변경할 수 있어요.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          변경사항 저장
        </button>
      </div>

      <section className="mt-12 grid grid-cols-2 gap-12">
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center justify-center">
          <label className="relative cursor-pointer">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-200">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="프로필 이미지"
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src="/icons/person.svg"
                  alt=""
                  className="h-12 w-12"
                />
              )}
            </div>

            <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-600">
              <img
                src="/icons/edit.svg"
                alt=""
                className="h-4 w-4 brightness-0 invert"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <p className="mt-3 text-sm font-semibold">프로필 이미지</p>
          <p className="mt-1 text-xs text-gray-400">
            이미지 선택 · 최대 5MB
          </p>
        </div>

        {/* 사용자 정보 */}
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              닉네임
            </label>

            <div className="flex h-11 items-center overflow-hidden rounded-md border border-border bg-white">
              <input
                type="text"
                value={nickname}
                disabled={!isEditing}
                onChange={(e) => setNickname(e.target.value)}
                className="min-w-0 flex-1 px-3 text-sm outline-none disabled:bg-white"
              />

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 text-xs font-semibold text-primary"
              >
                {isEditing ? "수정 취소" : "수정"}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              이메일
            </label>

            <input
              type="email"
              value={email}
              disabled
              className="h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-gray-500"
            />
          </div>
        </div>
      </section>

      {/* 회원 탈퇴 */}
      <section className="mt-auto rounded-lg border border-red-300 bg-red-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-red-500">
              회원 탈퇴
            </h2>

            <p className="mt-1 text-xs text-red-400">
              탈퇴하면 작성한 정보와 활동 기록이 모두 삭제되며 복구할 수 없습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={handleWithdraw}
            className="rounded-md border border-red-400 bg-white px-5 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
          >
            회원 탈퇴
          </button>
        </div>
      </section>
    </main>
  );
}