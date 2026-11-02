import type { ReactNode } from 'react'
import { useUmcine } from './use-umcine'
import { UmcineContext } from './umcine-store'

export function UmcineProvider({ children }: { children: ReactNode }) {
  const state = useUmcine()
  return <UmcineContext.Provider value={state}>{children}</UmcineContext.Provider>
}
