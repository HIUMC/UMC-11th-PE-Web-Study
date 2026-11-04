import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['src/routes/**/*.{ts,tsx}'],
    rules: {
      // TanStack Router는 Route 설정에서 파일 내부 컴포넌트를 참조한다.
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/pages/movies/search-page.tsx', 'src/pages/movies/movie-detail-page.tsx'],
    rules: {
      // 워크북의 useEffect 요청 예제는 요청 전에 로딩과 데이터를 초기화한다.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
