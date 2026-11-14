import { useState } from 'react'
import { cn } from '../../utils/cn'
export function MovieImage({ src, alt, className, decorative = false, lazy = false }: { src: string | null; alt: string; className: string; decorative?: boolean; lazy?: boolean }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  if (!src || failedSrc === src) return <div className={cn('grid place-items-center bg-[#e3e6eb] text-xs text-[#606774]', className)} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : `${alt} · 이미지 없음`} aria-hidden={decorative || undefined}><span>이미지 없음</span></div>
  return <img className={className} src={src} alt={decorative ? '' : alt} aria-hidden={decorative || undefined} loading={lazy ? 'lazy' : undefined} onError={() => setFailedSrc(src)} />
}
