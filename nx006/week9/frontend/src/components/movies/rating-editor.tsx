import { useRef, useState } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthSession } from '../../hooks/use-auth-session'
import { meOptions, ratingsOptions } from '../../queries/account-queries'
import { ratingMutationOptions, type RatingAction } from '../../mutations/account-mutations'
import { memberFailure } from '../../api/members/member-api'
import { memberIdFromToken, SessionChangedError } from '../../stores/auth-store'
import type { Rating } from '../../api/auth/account-api'
import { ServiceFeedback } from '../service-feedback'
import { cn } from '../../utils/cn'
import { Icon } from '../icon'

export function RatingEditor({ movieId }: { movieId: number }) {
  const session = useAuthSession(), me = useQuery(meOptions(session))
  const ratings = useQuery(ratingsOptions(session, Boolean(me.data)))
  if (!session.accessToken) return <section className="w-full py-6 xl:w-[360px]"><h2 className="text-xl font-bold">내 평점</h2><p className="mt-3 text-sm text-[#606774]">평점과 후기는 로그인 후 저장할 수 있어요.</p><Link className="mt-3 inline-block text-[#2563eb]" href="/login">로그인</Link></section>
  if (!me.data) return <section className="w-full py-6 xl:w-[360px]"><ServiceFeedback {...me} /></section>
  if (memberIdFromToken(session.accessToken) === null) return <p role="alert" className="w-full py-6 xl:w-[360px]">현재 회원 번호를 확인할 수 없어요. 다시 로그인해 주세요.</p>
  if (!ratings.data) return <section className="w-full py-6 xl:w-[360px]"><ServiceFeedback {...ratings} /></section>
  const existing = ratings.data.find(rating => rating.movieId === movieId)
  return <div className="contents"><div className="w-full xl:contents"><ServiceFeedback {...ratings} /></div><RatingForm key={`${session.generation}:${movieId}:${existing?.ratingId ?? 'new'}:${existing?.updatedAt ?? ''}`} movieId={movieId} existing={existing} /></div>
}
function RatingForm({ movieId, existing }: { movieId: number; existing?: Rating }) {
  const session = useAuthSession(), client = useQueryClient()
  const [score, setScore] = useState(existing?.score ?? 0)
  const [comment, setComment] = useState(existing?.comment ?? '')
  const options = ratingMutationOptions(client, session, movieId)
  const mutation = useMutation(options)
  const locked = useRef(false)
  async function run(action: RatingAction) {
    if (locked.current || mutation.isPending || client.isMutating({ mutationKey: options.mutationKey })) return
    locked.current = true
    try { await mutation.mutateAsync(action) }
    catch (error) { if (!(error instanceof SessionChangedError)) window.alert(memberFailure(error).message) }
    finally { locked.current = false }
  }
  return <form className="flex w-full flex-col gap-2 border-t border-[#e3e6eb] py-6 xl:w-[360px] xl:shrink-0 xl:border-t-0 xl:border-l xl:py-0 xl:pb-10 xl:pl-[30px]" onSubmit={event => {
    event.preventDefault()
    if (!score || comment.length > 500) return
    const body = { score, comment: comment.trim() }
    void run(existing ? { kind: 'update', ratingId: existing.ratingId, body } : { kind: 'create', body })
  }} aria-busy={mutation.isPending}>
    <h2 className="text-[21px] leading-[25px] font-bold">내 평점</h2><p className="text-[11px] text-[#969da8]">별점은 필수, 후기는 선택이에요. 최대 500자</p>
    <div className="flex gap-1" role="group" aria-label="영화 별점">{[1, 2, 3, 4, 5].map(value => <button type="button" disabled={mutation.isPending} aria-label={`${value}점`} aria-pressed={score === value} className={cn('grid size-[38px] place-items-center rounded-lg border border-[#e3e6eb] bg-white', value <= score && 'border-[#2563eb] bg-[#dce8ff]')} key={value} onClick={() => { setScore(value); mutation.reset() }}><Icon name="star" /></button>)}</div>
    <textarea className="min-h-[102px] w-full resize-y rounded-lg border border-[#e3e6eb] px-3 py-4 text-[13px] leading-5" id="movie-review" name="review" aria-label="영화 후기" placeholder="영화를 보고 느낀 점을 남겨보세요." maxLength={500} disabled={mutation.isPending} value={comment} onChange={event => { setComment(event.target.value); mutation.reset() }} />
    <button className="inline-flex h-[42px] items-center justify-center rounded-lg bg-[#17191e] px-4 text-sm font-extrabold text-white disabled:opacity-40" disabled={!score || mutation.isPending} type="submit">{mutation.isPending ? '저장 중' : existing ? '평점 수정' : '평점 저장'}</button>
    {existing && <button type="button" className="h-[42px] rounded-lg border border-[#d92d20] text-sm font-bold text-[#d92d20] disabled:opacity-40" disabled={mutation.isPending} onClick={() => { void run({ kind: 'delete', ratingId: existing.ratingId }) }}>평점 삭제</button>}
    {mutation.isError && <p role="alert" className="text-sm text-[#d92d20]">{memberFailure(mutation.error).message}</p>}
    {mutation.isSuccess && <p role="status" className="text-sm text-[#2563eb]">변경한 평점을 서버에서 확인했어요.</p>}
  </form>
}
