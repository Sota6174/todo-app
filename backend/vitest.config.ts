/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

// Vitestの設定ファイル - バックエンドAPI用テスト設定
export default defineConfig({
  test: {
    // Node.js環境でテストを実行
    environment: 'node',

    // テストファイルのパターン設定
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    // カバレッジ設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      include: ['src/**/*.{js,ts}'],
      exclude: ['src/**/*.test.{js,ts}', 'src/**/*.spec.{js,ts}']
    },

    // テストタイムアウト設定
    testTimeout: 10000,
    hookTimeout: 10000,

    // グローバルセットアップ
    globals: true
  }
})