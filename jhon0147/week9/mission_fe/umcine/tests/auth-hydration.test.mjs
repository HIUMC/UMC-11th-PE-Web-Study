import test from "node:test";
import assert from "node:assert/strict";
import { useAuthStore } from "../src/stores/auth-store.ts";

test("서버와 첫 렌더링에서 토큰을 읽지 않고 명시적으로 저장 상태를 복원한다", async () => {
  assert.equal(useAuthStore.getState().accessToken, null);
  assert.equal(useAuthStore.getState().hasHydrated, false);
  let reads = 0;
  let saved;
  globalThis.window = { localStorage: {
    getItem: () => { reads++; return JSON.stringify({ state: { accessToken: "restored-token" }, version: 0 }); },
    setItem: (_key, value) => { saved = JSON.parse(value); },
    removeItem: () => {},
  } };
  try {
    assert.equal(reads, 0);
    await useAuthStore.persist.rehydrate();
    assert.equal(useAuthStore.getState().accessToken, "restored-token");
    assert.equal(useAuthStore.getState().hasHydrated, false);
    useAuthStore.getState().finishHydration();
    assert.equal(useAuthStore.getState().hasHydrated, true);
    assert.deepEqual(saved.state, { accessToken: "restored-token" });
  } finally {
    delete globalThis.window;
  }
});
