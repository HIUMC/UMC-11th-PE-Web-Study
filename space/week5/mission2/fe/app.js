const API_BASE_URL = 'http://localhost:8080';
const get = (id) => document.getElementById(id);
const definitions = {
  nickname: { path: (value) => `/members/nickname/${encodeURIComponent(value)}`, label: '닉네임' },
  email: { path: (value) => `/members/email/${encodeURIComponent(value)}`, label: '이메일' },
  ratings: { path: (value) => `/members/${encodeURIComponent(value)}/ratings`, label: '별점' },
  check: {
    path: () => '/members/check', label: '회원 정보', method: 'POST',
    body: () => ({ nickname: get('check').value, email: get('check-email').value }),
  },
};
const states = Object.fromEntries(Object.keys(definitions).map((key) => [key, { success: false, pending: false }]));

function updateSummary() {
  const count = Object.values(states).filter((state) => state.success).length;
  const total = Object.keys(definitions).length;
  get('success-count').textContent = count;
  get('progress-bar').style.width = `${count / total * 100}%`;
  get('connection-summary').textContent = count === total ? '모든 API가 정상 응답했습니다' : `${count}개 API 정상 응답 · 총 ${total}개`;
  get('run-all').disabled = Object.values(states).some((state) => state.pending);
}

function setResult(key, message, type = '') {
  get(`${key}-result`).textContent = message;
  get(`${key}-result`).className = `result ${type}`;
}

function setBadge(key, text, type = '') {
  get(`${key}-badge`).textContent = text;
  get(`${key}-badge`).className = `status-badge ${type}`;
}

function dateText(value) {
  if (!value) return '날짜 정보 없음';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('ko-KR', { hour12: false });
}

function renderRatings(ratings) {
  const container = get('rating-list');
  container.replaceChildren();
  if (!ratings.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = '아직 남긴 별점이 없어요. 첫 번째 영화 기록을 기다리고 있습니다.';
    container.append(empty);
    return;
  }
  for (const rating of ratings) {
    const item = document.createElement('div');
    item.className = 'rating-item';
    const top = document.createElement('div');
    top.className = 'rating-top';
    const title = document.createElement('span');
    title.className = 'movie-title';
    title.textContent = `영화 #${rating.movieId}`;
    const score = document.createElement('span');
    score.className = 'rating-score';
    score.textContent = `★ ${rating.score}점`;
    top.append(title, score);
    const comment = document.createElement('p');
    comment.className = 'rating-comment';
    comment.textContent = rating.comment || '작성된 코멘트가 없습니다.';
    const date = document.createElement('span');
    date.className = 'rating-date';
    date.textContent = `등록 ${dateText(rating.createdAt)} · 별점 #${rating.ratingId}`;
    item.append(top, comment, date);
    container.append(item);
  }
}

async function callApi(key) {
  const form = get(`${key}-form`);
  const input = get(key);
  const inputs = [...form.querySelectorAll('input')];
  for (const field of inputs) {
    field.value = field.value.trim();
    field.setCustomValidity(field.value ? '' : '값을 입력해 주세요.');
  }
  if (key === 'ratings' && /^[1-9][0-9]*$/.test(input.value) && BigInt(input.value) > 9223372036854775807n) {
    input.setCustomValidity('회원 번호가 허용 범위를 초과했습니다.');
  }
  if (!form.reportValidity() || states[key].pending) return;
  const state = states[key];
  state.pending = true;
  state.success = false;
  const path = definitions[key].path(input.value);
  const url = `${API_BASE_URL}${path}`;
  const button = form.querySelector('button');
  button.disabled = true;
  inputs.forEach((field) => { field.disabled = true; });
  setBadge(key, '요청 중', 'loading');
  setResult(key, '서버 응답을 기다리고 있습니다.');
  get(`${key}-path`).textContent = url;
  get(`${key}-json`).textContent = '요청 중…';
  get(`${key}-meta`).textContent = 'PENDING';
  get(`${key}-time`).textContent = '';
  if (key === 'ratings') get('rating-list').replaceChildren();
  updateSummary();
  const started = performance.now();
  let response;
  try {
    const body = definitions[key].body?.();
    response = await fetch(url, {
      method: definitions[key].method || 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store',
      headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(10000),
    });
    const raw = await response.text();
    get(`${key}-meta`).textContent = `${response.status} · ${Math.round(performance.now() - started)} ms`;
    let data;
    try { data = JSON.parse(raw); } catch { /* Preserve a non-JSON error response below. */ }
    get(`${key}-json`).textContent = data === undefined ? (raw || '(응답 본문 없음)') : JSON.stringify(data, null, 2);
    const checkedAt = new Date();
    get(`${key}-time`).dateTime = checkedAt.toISOString();
    get(`${key}-time`).textContent = `응답 수신 ${checkedAt.toLocaleString('ko-KR', { hour12: false })}`;
    if (!response.ok) {
      throw new Error(response.status === 404 && key === 'ratings'
        ? '존재하지 않는 회원입니다. 다른 회원 번호로 조회해 주세요.'
        : `HTTP ${response.status}: 요청에 실패했습니다. 응답 내용을 확인해 주세요.`);
    }
    if (key === 'ratings') {
      if (!Array.isArray(data) || data.some((item) => !item || typeof item !== 'object' || !('movieId' in item))) {
        throw new Error('별점 목록의 응답 형식이 올바르지 않습니다.');
      }
      renderRatings(data);
      setResult(key, `회원 #${input.value} · ${data.length}개의 별점 기록을 불러왔습니다.`, 'success');
    } else if (key === 'check') {
      if (typeof data?.matched !== 'boolean') throw new Error('회원 정보 확인 응답 형식이 올바르지 않습니다.');
      setResult(key, data.matched
        ? '✓ 닉네임과 이메일이 같은 회원의 정보와 일치합니다.'
        : '닉네임과 이메일이 일치하는 회원이 없습니다.', data.matched ? 'success' : 'unavailable');
    } else {
      if (typeof data?.available !== 'boolean') throw new Error('중복 확인 응답 형식이 올바르지 않습니다.');
      setResult(key, data.available
        ? `✓ 사용 가능한 ${definitions[key].label}입니다.`
        : `이미 사용 중인 ${definitions[key].label}입니다. 다른 값을 입력해 주세요.`, data.available ? 'success' : 'unavailable');
    }
    state.success = true;
    setBadge(key, `HTTP ${response.status} OK`, 'success');
  } catch (error) {
    setBadge(key, response ? `HTTP ${response.status} · 오류` : '연결 실패', 'error');
    let message = error.message;
    if (!response) {
      message = error.name === 'TimeoutError' ? '응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.'
        : '서버에 연결하지 못했습니다. 백엔드 실행 상태와 접속 주소(localhost:5173), CORS 설정을 확인해 주세요.';
      get(`${key}-meta`).textContent = 'NETWORK ERROR';
      get(`${key}-json`).textContent = message;
    }
    setResult(key, message, 'error');
  } finally {
    state.pending = false;
    button.disabled = false;
    inputs.forEach((field) => { field.disabled = false; });
    updateSummary();
  }
}

for (const key of Object.keys(definitions)) {
  get(`${key}-form`).addEventListener('submit', (event) => {
    event.preventDefault();
    void callApi(key);
  });
  get(`${key}-form`).addEventListener('input', (event) => {
    event.target.setCustomValidity('');
    states[key].success = false;
    setBadge(key, '재조회 필요');
    setResult(key, '입력값이 변경되었습니다. 다시 조회해 주세요.');
    get(`${key}-json`).textContent = '입력값 변경 후 아직 요청하지 않았습니다.';
    get(`${key}-meta`).textContent = 'READY';
    get(`${key}-path`).textContent = definitions[key].path(get(key).value.trim());
    get(`${key}-time`).textContent = '';
    if (key === 'ratings') get('rating-list').replaceChildren();
    updateSummary();
  });
}

get('run-all').addEventListener('click', async () => {
  await Promise.all(Object.keys(definitions).map(callApi));
});
