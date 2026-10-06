import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

//북마크 저장소 상태와 함수 타입 정의
interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

//persist 적용한 북마크 저장소 생성
export const useBookmarkStore = create<BookmarkStore>()(
  //상태 저장, 새로고침 시 저장된 상태 복원
  persist(
    (set) => ({
      bookmarkedMovieIds: [], //초기값
      toggleBookmark: (movieId) =>
        //현재 상태 기준으로 북마크 목록 변경
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? //이미 북마크햇다면 -> 제거
              state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : //아니면 -> 추가
              [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      //키 이름
      name: "umcine-bookmark-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
    },
  ),
);
