// テスト環境のセットアップファイル
// @testing-library/jest-domの拡張機能を有効化
import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// グローバルなテスト設定
// window.matchMediaのモック（CSSメディアクエリテスト用）
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // 非推奨だが後方互換性のため
    removeListener: vi.fn(), // 非推奨だが後方互換性のため
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// window.ResizeObserverのモック（レスポンシブコンポーネントテスト用）
;(globalThis as typeof globalThis & { ResizeObserver: unknown }).ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// fetch APIのモック設定（API通信テスト用）
const mockFetch = vi.fn()
;(globalThis as typeof globalThis & { fetch: unknown }).fetch = mockFetch

// テスト前後の自動クリーンアップ設定
beforeEach(() => {
  // fetchモックをリセット
  mockFetch.mockClear()
})
