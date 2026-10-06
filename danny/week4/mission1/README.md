# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## 4주차 선택 미션 기록

### 북마크 저장소를 sessionStorage로 바꿨을 때의 차이

`bookmark-store.ts`의 저장소를 `localStorage`에서 `sessionStorage`로 바꾸고, 영화 한 편을 북마크한 뒤 같은 순서로 확인했어요.

| 상황 | sessionStorage | localStorage |
|---|---|---|
| 같은 탭 새로고침 | 유지 | 유지 |
| 새 탭 열기 | 비어 있음 | 유지 |
| 탭 닫고 다시 열기 | 비어 있음 | 유지 |
| 브라우저 재실행 | 비어 있음 | 유지 |

- `sessionStorage`는 탭마다 따로 저장되고, 탭을 닫으면 사라져요. 그래서 같은 탭의 새로고침에서만 북마크가 남았어요.
- `localStorage`는 같은 사이트의 모든 탭이 함께 쓰고, 브라우저를 다시 열어도 남아 있어요.
- 필수 미션이 "브라우저 재실행 뒤에도 유지"라서 북마크는 `localStorage`로 다시 되돌렸어요.

### 브라우저에만 저장하는 화면 설정: 영화 정렬

- 영화 목록 제목 오른쪽에서 기본순, 최신 개봉순, 제목순을 고를 수 있어요.
- 선택값은 `umcine-view-settings-store` 키로 `localStorage`에 저장돼서, 새로고침하거나 브라우저를 다시 열어도 유지돼요.
- 저장값이 JSON이 아니거나 없는 정렬 값이면 기본순으로 돌아가요.
