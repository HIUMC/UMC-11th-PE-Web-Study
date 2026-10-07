import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { PRACTICE_BOOKMARK_KEY, SESSION_PRACTICE_KEY, readBookmarkIds, saveBookmarkIds, type BrowserStorage } from '../utils/bookmark-storage'
import { BOOKMARK_STORE_KEY } from '../stores/bookmark-store'
import { DISPLAY_SETTINGS_KEY } from '../stores/display-settings-store'

// 학습 전용: 앱의 북마크 store와 같은 key를 쓰지 않는다.
function practiceStorage(mode: 'local' | 'session'): BrowserStorage {
  const getStorage = () => mode === 'local' ? localStorage : sessionStorage
  return { getItem: key => getStorage().getItem(key), setItem: (key, value) => getStorage().setItem(key, value), removeItem: key => getStorage().removeItem(key) }
}

export function StorageLabPage({ mode }: { mode: 'local' | 'session' }) {
  const key = mode === 'local' ? PRACTICE_BOOKMARK_KEY : SESSION_PRACTICE_KEY
  const [ids, setIds] = useState(() => readBookmarkIds(practiceStorage(mode), key))
  const [target, setTarget] = useState<string>(key)
  const [raw, setRaw] = useState('[2,7]')
  const [message, setMessage] = useState('')
  useEffect(() => {
    saveBookmarkIds(practiceStorage(mode), ids, key)
  }, [ids, key, mode])
  const targetStorage = () => practiceStorage(target === SESSION_PRACTICE_KEY ? 'session' : 'local')
  function operate(action: 'read' | 'write' | 'remove') {
    try {
      if (action === 'read') { const value = targetStorage().getItem(target); setRaw(value ?? ''); setMessage(value === null ? 'key가 없습니다 (getItem → null).' : `저장값: ${value}`) }
      else if (action === 'write') { targetStorage().setItem(target, raw); setMessage('문자열을 저장했습니다. 복원 결과는 새로고침 후 확인하세요.') }
      else { targetStorage().removeItem(target); setMessage('선택한 key만 삭제했습니다. 이미 열린 앱 메모리는 유지됩니다. 새로고침하세요.') }
    } catch (error) { setMessage(`저장소 작업 실패: ${String(error)}`) }
  }
  const button = 'rounded-lg border border-[#e3e6eb] bg-white px-3 py-2 text-sm font-bold'
  return <main id="main-content" className="mx-auto w-full max-w-[960px] flex-1 space-y-6 px-5 py-8">
    <h1 className="text-3xl font-bold">Web Storage 실습</h1><p className="text-sm text-[#606774]">학습 전용 화면입니다. 직접 저장은 실습 key만 사용하며, 실제 영화 북마크는 Zustand persist가 관리합니다.</p>
    <nav className="flex flex-wrap gap-3"><Link className={button} to="/storage-lab" search={{ storage: 'local' }}>localStorage 실습</Link><Link className={button} to="/storage-lab" search={{ storage: 'session' }}>sessionStorage 실습</Link><Link className={button} to="/">영화 목록</Link></nav>
    <section className="space-y-3 rounded-xl border border-[#e3e6eb] p-5"><h2 className="text-lg font-bold">직접 저장 · {mode}Storage</h2><p>실습 key: <code>{key}</code></p><p role="status">복원한 ID: [{ids.join(', ')}]</p>
      <div className="flex gap-3">{[2, 7].map(id => <button key={id} className={button} aria-pressed={ids.includes(id)} onClick={() => setIds(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id])}>영화 {id} 실습 북마크</button>)}</div>
      <p className="text-sm">useState 지연 초기화로 읽고, 변경 시 effect로 저장합니다. getItem으로 결과를 확인하며 저장 실패는 Console에 보고합니다.</p>
    </section>
    <section className="space-y-3 rounded-xl border border-[#e3e6eb] p-5"><h2 className="text-lg font-bold">저장값 검증 실험</h2>
      <label className="flex flex-wrap items-center gap-3">검증할 key<select className={button} value={target} onChange={event => setTarget(event.target.value)}>{[PRACTICE_BOOKMARK_KEY, SESSION_PRACTICE_KEY, BOOKMARK_STORE_KEY, DISPLAY_SETTINGS_KEY].map(value => <option key={value}>{value}</option>)}</select></label>
      <label className="block">저장할 문자열<textarea aria-label="저장할 문자열" className="mt-2 min-h-24 w-full rounded-lg border border-[#e3e6eb] bg-white p-3 font-mono text-sm" value={raw} onChange={event => setRaw(event.target.value)} /></label>
      <div className="flex flex-wrap gap-3"><button className={button} onClick={() => operate('write')}>setItem</button><button className={button} onClick={() => operate('read')}>getItem</button><button className={button} onClick={() => operate('remove')}>removeItem</button><button className={button} onClick={() => window.location.reload()}>새로고침</button></div>
      <p role="status" className="break-all text-sm text-[#2563eb]">{message}</p>
      <p className="text-sm text-[#606774]">일반 창의 같은 origin에서 비교하세요. sessionStorage는 같은 탭 새로고침에 유지되고, opener 없는 새 탭은 별도 세션입니다. clear()는 사용하지 않습니다.</p>
    </section>
  </main>
}
