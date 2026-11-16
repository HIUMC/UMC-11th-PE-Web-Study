import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../utils/cn'

export const authButtonClass = 'inline-flex min-h-12 items-center justify-center rounded-lg bg-[#245feb] px-4 text-sm font-bold text-white hover:bg-[#1d52ce] disabled:cursor-not-allowed disabled:bg-[#245feb]/65'

export function AuthPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="grid place-items-center px-4 py-10">
      <section className="w-full max-w-[432px]" aria-labelledby="auth-title">
        <h1 id="auth-title" className="mb-4 text-[32px] leading-tight font-extrabold tracking-tight">{title}</h1>
        {children}
      </section>
    </main>
  )
}

type AuthFieldProps = ComponentProps<'input'> & {
  id: string
  label: string
  icon?: 'mail' | 'lock'
  action?: ReactNode
  message?: string
  invalid?: boolean
}

export function AuthField({ id, label, icon, action, message, invalid, ...input }: AuthFieldProps) {
  const helpId = `${id}-help`
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold" htmlFor={id}>{label}</label>
      <div className={cn(
        'flex min-h-[50px] items-center gap-2 rounded-[9px] border bg-white px-3.5 focus-within:ring-2 focus-within:ring-[#245feb]/30',
        invalid ? 'border-red-500' : 'border-[#dfe4eb]',
      )}>
        {icon && <img src={`/icons/${icon}.svg`} alt="" className="size-4 opacity-70" />}
        <input {...input} id={id} aria-invalid={invalid || undefined} aria-describedby={message ? helpId : undefined}
          className="min-w-0 flex-1 self-stretch text-sm outline-none placeholder:text-[#858e9d] disabled:text-[#697383]" />
        {action}
      </div>
      {message && <p id={helpId} aria-live="polite" className={cn('mt-1 text-xs', invalid ? 'text-red-700' : 'text-[#697383]')}>{message}</p>}
    </div>
  )
}
