import { useRef } from 'react'
import { useIsMutating, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useAuthSession } from '../../hooks/use-auth-session'
import { favoriteOptions, favoritesOptions } from '../../queries/account-queries'
import { favoriteMutationOptions } from '../../mutations/account-mutations'
import { memberFailure } from '../../api/members/member-api'
import { SessionChangedError } from '../../stores/auth-store'
import { cn } from '../../utils/cn'
import { Icon } from '../icon'

interface Props { movieId: number; title: string; variant?: 'card' | 'detail' | 'search' }
export function BookmarkButton({ movieId, title, variant = 'card' }: Props) {
  const session = useAuthSession()
  return <ServerBookmark key={session.generation} movieId={movieId} title={title} variant={variant} />
}
function ServerBookmark({ movieId, title, variant = 'card' }: Props) {
  const session = useAuthSession(), client = useQueryClient(), navigate = useNavigate()
  const list = useQuery({ ...favoritesOptions(session), enabled: Boolean(session.accessToken) && variant !== 'detail' })
  const status = useQuery(favoriteOptions(movieId, session, variant === 'detail'))
  const options = favoriteMutationOptions(client, session, movieId)
  const mutation = useMutation(options)
  const busy = useIsMutating({ mutationKey: options.mutationKey }) > 0
  const locked = useRef(false)
  const query = variant === 'detail' ? status : list
  const isBookmarked = variant === 'detail' ? status.data?.isFavorite ?? false : list.data?.some(item => item.movieId === movieId) ?? false
  const hasData = query.data !== undefined
  const disabled = Boolean(session.accessToken) && (busy || query.isLoading || query.fetchStatus === 'paused')
  return <button type="button" aria-label={`${title} 북마크${query.isError && !hasData ? ' 다시 조회' : ''}`} aria-pressed={isBookmarked} disabled={disabled} title={!session.accessToken ? '로그인 후 즐겨찾기를 사용할 수 있어요.' : query.isError ? '클릭하면 최신 상태를 다시 조회합니다.' : undefined} onClick={async () => {
    if (!session.accessToken) { await navigate({ to: '/login' }); return }
    if (!hasData) { await query.refetch(); return }
    if (locked.current || client.isMutating({ mutationKey: options.mutationKey })) return
    locked.current = true
    try { await mutation.mutateAsync(isBookmarked) }
    catch (error) { if (!(error instanceof SessionChangedError)) window.alert(memberFailure(error).message) }
    finally { locked.current = false }
  }} className={cn(
    'disabled:cursor-wait disabled:opacity-50',
    variant === 'card' && 'absolute top-2.5 right-2.5 grid size-[34px] place-items-center rounded-lg border border-white bg-[#17191e]',
    variant === 'card' && isBookmarked && 'border-[#2563eb] bg-[#2563eb]',
    variant === 'detail' && 'inline-flex h-[42px] items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white',
    variant === 'search' && 'inline-flex items-center gap-1 rounded-md border border-[#e3e6eb] bg-[#17191e] px-2 py-1 text-xs font-bold text-white',
    variant === 'search' && isBookmarked && 'border-[#2563eb] bg-[#2563eb]',
  )}>
    <Icon name={variant === 'detail' ? 'detail-bookmark' : isBookmarked ? 'bookmark' : 'bookmark-outline'} />
    {variant !== 'card' && (busy ? '변경 중' : query.isError && !hasData ? '즐겨찾기 다시 조회' : isBookmarked ? '즐겨찾기 해제' : '즐겨찾기')}
  </button>
}
