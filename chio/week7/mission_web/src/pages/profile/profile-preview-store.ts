import { create } from 'zustand'

export const useProfilePreview = create<{ nickname: string; setNickname: (nickname: string) => void }>((set) => ({
  nickname: '영화친구',
  setNickname: (nickname) => set({ nickname }),
}))
