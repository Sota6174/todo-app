/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Vitestの設定ファイル - フロントエンド用テスト設定
export default defineConfig({
  plugins: [react()],
  test: {
    // JSDOM環境でテストを実行（ブラウザ環境をシミュレート）
    environment: 'jsdom',

    // テストファイルのパターン設定
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    // グローバル設定（describeやitなどをインポートなしで使用可能）
    globals: true,

    // セットアップファイル設定（@testing-library/jest-domの拡張を追加）
    setupFiles: ['./src/test/setup.ts'],

    // カバレッジ設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      include: ['src/**/*.{js,ts,jsx,tsx}'],
      exclude: [
        'src/**/*.test.{js,ts,jsx,tsx}',
        'src/**/*.spec.{js,ts,jsx,tsx}',
        'src/test/**',
        'src/main.tsx'
      ]
    },

    // テストタイムアウト設定
    testTimeout: 10000,
    hookTimeout: 10000
  }
})