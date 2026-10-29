import type { InputHTMLAttributes, ReactNode } from 'react'
import { Icon } from './icon'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: string
  action?: ReactNode
  hint?: string
}

export function FormField({ label, icon, action, hint, id, ...props }: Props) {
  return <div className="flex flex-col gap-2"><label className="text-[13px] leading-4 font-extrabold" htmlFor={id}>{label}</label>
    <div className="flex min-h-12 items-center gap-[9px] rounded-lg border border-[#e3e6eb] bg-white px-[13px] focus-within:border-[#2563eb]">{icon && <span className="grid w-4 place-items-center"><Icon name={icon} /></span>}
      <input className="min-w-0 flex-1 bg-transparent px-0.5 py-3.5 text-sm outline-none" id={id} name={id} {...props} aria-describedby={hint ? `${id}-hint` : undefined} />{action}
    </div>{hint && <p className="text-[11px] leading-[16.5px] text-[#969da8]" id={`${id}-hint`}>{hint}</p>}
  </div>
}
