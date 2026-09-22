import type { InputHTMLAttributes, ReactNode } from 'react'
import { Icon } from './icon'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: string
  action?: ReactNode
  hint?: string
}

export function FormField({ label, icon, action, hint, id, ...props }: Props) {
  return <div className="form-group"><label htmlFor={id}>{label}</label>
    <div className="field">{icon && <span className="field-icon"><Icon name={icon} /></span>}
      <input id={id} name={id} {...props} aria-describedby={hint ? `${id}-hint` : undefined} />{action}
    </div>{hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
  </div>
}
