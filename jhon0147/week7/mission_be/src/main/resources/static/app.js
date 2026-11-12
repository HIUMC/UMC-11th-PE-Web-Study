let accessToken = "";
let editingId = null;
const $ = selector => document.querySelector(selector);

async function request(method, path, data, useToken = true) {
  const headers = {};
  if (data !== undefined) headers["Content-Type"] = "application/json";
  if (useToken && accessToken) headers.Authorization = "Bearer " + accessToken;
  const response = await fetch(path, {method, headers, body: data === undefined ? undefined : JSON.stringify(data)});
  const body = await response.json();
  $("#status").textContent = method + " " + path + " · HTTP " + response.status + " · " + body.message;
  $("#response").textContent = JSON.stringify(body, null, 2);
  $(".result").dataset.error = String(!response.ok);
  if (response.status === 401 && useToken) {
    accessToken = "";
    $("#account").textContent = "다시 로그인해주세요.";
    $("#profile").replaceChildren();
  }
  return {ok: response.ok, body};
}

async function run(action) {
  document.querySelectorAll("button").forEach(button => { button.disabled = true; });
  try { await action(); }
  catch { $("#status").textContent = "서버와 연결하지 못했어요. 서버 실행 상태를 확인해주세요."; }
  finally { document.querySelectorAll("button").forEach(button => { button.disabled = false; }); }
}

function bind(id, action) {
  $(id).addEventListener("submit", event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    void run(() => action(data));
  });
}

function showProfile(info) {
  $("#account").textContent = info.nickname + "님으로 로그인했어요.";
  $("#nickname input").value = info.nickname;
  $("#profile").replaceChildren();
  for (const [label, value] of [["이메일", info.email], ["닉네임", info.nickname], ["가입일", info.createdAt]]) {
    const title = document.createElement("dt");
    const content = document.createElement("dd");
    title.textContent = label;
    content.textContent = value;
    $("#profile").append(title, content);
  }
}

function cancelEdit() {
  editingId = null;
  $("#rating-title").textContent = "평점 남기기";
  $("#rating [name=movieId]").disabled = false;
  $("#rating [name=comment]").value = "";
}

bind("#login", async data => {
  const result = await request("POST", "/auth/login", data, false);
  if (result.ok) {
    accessToken = result.body.result.accessToken;
    $("#account").textContent = result.body.result.nickname + "님으로 로그인했어요.";
    $("#login [name=password]").value = "";
    $("#profile").replaceChildren();
    cancelEdit();
  }
});
bind("#signup", async data => {
  const result = await request("POST", "/members", data, false);
  if (result.ok) {
    $("#login [name=email]").value = data.email;
    $("#list [name=memberId]").value = result.body.result.memberId;
    $("#signup [name=password]").value = "";
  }
});
$("#me").addEventListener("click", () => void run(async () => {
  const result = await request("GET", "/members/me");
  if (result.ok) showProfile(result.body.result);
}));
bind("#nickname", async data => {
  const result = await request("PATCH", "/members/me", data);
  if (result.ok) showProfile(result.body.result);
});
bind("#rating", async data => {
  const payload = {score: Number(data.score), comment: data.comment};
  if (editingId === null) payload.movieId = Number(data.movieId);
  const result = await request(editingId === null ? "POST" : "PATCH", editingId === null ? "/ratings" : "/ratings/" + editingId, payload);
  if (result.ok) cancelEdit();
});
$("#cancel-edit").addEventListener("click", cancelEdit);
$("#logout").addEventListener("click", () => {
  accessToken = "";
  $("#account").textContent = "로그아웃했어요.";
  $("#profile").replaceChildren();
  $("#response").textContent = "아직 보낸 요청이 없어요.";
  $("#status").textContent = "새 계정으로 로그인할 수 있어요.";
  $("#ratings").replaceChildren();
  cancelEdit();
});
bind("#list", async data => {
  const result = await request("GET", "/members/" + encodeURIComponent(data.memberId) + "/ratings", undefined, false);
  if (!result.ok) return;
  $("#ratings").replaceChildren();
  if (result.body.result.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "아직 남긴 평점이 없어요.";
    $("#ratings").append(empty);
  }
  for (const rating of result.body.result) {
    const item = document.createElement("li");
    const heading = document.createElement("div");
    heading.className = "rating-heading";
    const title = document.createElement("strong");
    title.textContent = "영화 #" + rating.movieId;
    const score = document.createElement("span");
    score.textContent = "★ " + rating.score + " / 5";
    heading.append(title, score);
    const comment = document.createElement("p");
    comment.textContent = rating.comment || "작성한 한줄평이 없어요.";
    const actions = document.createElement("div");
    actions.className = "actions";
    const edit = document.createElement("button");
    edit.className = "secondary";
    edit.textContent = "수정";
    edit.addEventListener("click", () => {
      editingId = rating.ratingId;
      $("#rating-title").textContent = "평점 #" + rating.ratingId + " 수정";
      $("#rating [name=movieId]").value = rating.movieId;
      $("#rating [name=movieId]").disabled = true;
      $("#rating [name=score]").value = rating.score;
      $("#rating [name=comment]").value = rating.comment || "";
      $("#rating-title").scrollIntoView({behavior: "smooth", block: "center"});
    });
    const remove = document.createElement("button");
    remove.className = "danger";
    remove.textContent = "삭제";
    remove.addEventListener("click", () => void run(async () => {
      const result = await request("DELETE", "/ratings/" + rating.ratingId);
      if (result.ok) { item.remove(); cancelEdit(); }
    }));
    actions.append(edit, remove);
    item.append(heading, comment, actions);
    $("#ratings").append(item);
  }
});
