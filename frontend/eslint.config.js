// ESLint設定: 以下をチェック
// 1. 基本エラー: 未使用変数、構文エラー等
// 2. TypeScript: 型関連の問題
// 3. React Hook: useEffectの依存配列等
// 4. 開発効率: Fast Refreshが効く書き方
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),  // ビルド結果フォルダは無視
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended, // JavaScript基本ルール
      tseslint.configs.recommended, // TypeScript基本ルール
      reactHooks.configs['recommended-latest'], // React Hook規則
      reactRefresh.configs.vite,  // Vite HMR(開発時リロード)最適化
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
