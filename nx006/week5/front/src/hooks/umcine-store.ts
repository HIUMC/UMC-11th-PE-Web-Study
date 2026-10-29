import { createContext, useContext } from 'react'
import { useUmcine } from './use-umcine'

export type UmcineState = ReturnType<typeof useUmcine>
export const UmcineContext = createContext<UmcineState | null>(null)

export function useUmcineContext() {
  const state = useContext(UmcineContext)
  if (!state) throw new Error('UmcineProvider가 필요합니다.')
  return state
}
