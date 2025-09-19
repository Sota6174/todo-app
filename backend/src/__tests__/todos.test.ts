/**
 * Todoアプリケーション バックエンドAPIテスト
 *
 * 【テスト対象】
 * - Todo CRUD操作（作成・読取・更新・削除）のAPIエンドポイント
 * - エラーハンドリング（バリデーション、存在しないリソース）
 * - ヘルスチェック機能とサーバー状態確認
 *
 * 【テスト項目】
 * 1. ヘルスチェック（GET /、GET /health）
 * 2. Todo一覧取得（GET /api/todos）
 * 3. Todo作成（POST /api/todos）
 * 4. Todo完了状態切り替え（PATCH /api/todos/:id/toggle）
 * 5. Todo削除（DELETE /api/todos/:id）
 * 6. Todo個別取得（GET /api/todos/:id）
 * 7. エラーハンドリング（404、不正JSON）
 *
 * 【重要度】★★★ 必須テスト
 * API仕様の正確性とデータ整合性を保証する基本的なテストスイート
 */

import { describe, it, expect, beforeEach } from 'vitest'
import testApp from '../test-app.js'
import { clearTodos, initializeSampleData } from '../store/todoStore.js'

// Todo APIテスト - Honoネイティブのfetch APIを使用
describe('Todo API Tests', () => {
  // 各テスト前にデータをリセット
  beforeEach(() => {
    clearTodos() // 既存データをクリア
    initializeSampleData() // サンプルデータを再設定
  })

  // ヘルスチェックテスト
  describe('GET /', () => {
    it('サーバーが正常に応答する', async () => {
      const response = await testApp.request('/')

      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toMatchObject({
        message: 'Todo API Server is running!',
        version: '1.0.0',
        endpoints: {
          todos: '/api/todos'
        }
      })
    })
  })

  // Todo一覧取得テスト
  describe('GET /api/todos', () => {
    it('全Todo一覧を正常に取得できる', async () => {
      const response = await testApp.request('/api/todos')

      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toMatchObject({
        success: true,
        message: 'Todoリストを取得しました'
      })
      expect(body.data).toBeInstanceOf(Array)
      expect(body.data.length).toBeGreaterThan(0)
    })

    it('Todoアイテムが正しい構造を持つ', async () => {
      const response = await testApp.request('/api/todos')

      expect(response.status).toBe(200)

      const body = await response.json()
      const firstTodo = body.data[0]

      expect(firstTodo).toHaveProperty('id')
      expect(firstTodo).toHaveProperty('title')
      expect(firstTodo).toHaveProperty('completed')
      expect(firstTodo).toHaveProperty('createdAt')
      expect(firstTodo).toHaveProperty('updatedAt')
      expect(typeof firstTodo.id).toBe('string')
      expect(typeof firstTodo.title).toBe('string')
      expect(typeof firstTodo.completed).toBe('boolean')
    })
  })

  // Todo作成テスト
  describe('POST /api/todos', () => {
    it('新しいTodoを正常に作成できる', async () => {
      const newTodo = {
        title: '新しいテストTodo',
        description: 'テスト用の説明'
      }

      const response = await testApp.request('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
      })

      expect(response.status).toBe(201)

      const body = await response.json()
      expect(body).toMatchObject({
        success: true,
        message: 'Todoを作成しました'
      })
      expect(body.data).toMatchObject({
        title: newTodo.title,
        description: newTodo.description,
        completed: false
      })
      expect(body.data).toHaveProperty('id')
      expect(body.data).toHaveProperty('createdAt')
      expect(body.data).toHaveProperty('updatedAt')
    })

    it('必須項目が不足している場合はエラーを返す', async () => {
      const invalidTodo = {
        description: '説明のみでタイトルなし'
      }

      const response = await testApp.request('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidTodo)
      })

      expect(response.status).toBe(400)

      const body = await response.json()
      expect(body).toMatchObject({
        success: false
      })
    })
  })

  // Todo完了状態切り替えテスト
  describe('PATCH /api/todos/:id/toggle', () => {
    it('Todoの完了状態を正常に切り替えできる', async () => {
      // まず一覧を取得して既存のTodoのIDを取得
      const todosResponse = await testApp.request('/api/todos')
      expect(todosResponse.status).toBe(200)

      const todosBody = await todosResponse.json()
      const firstTodo = todosBody.data[0]
      const originalStatus = firstTodo.completed

      // 完了状態を切り替え
      const response = await testApp.request(`/api/todos/${firstTodo.id}/toggle`, {
        method: 'PATCH'
      })

      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toMatchObject({
        success: true,
        message: `Todoを${!originalStatus ? '完了' : '未完了'}に変更しました`
      })
      expect(body.data.completed).toBe(!originalStatus)
      expect(body.data.id).toBe(firstTodo.id)
    })

    it('存在しないIDの場合はエラーを返す', async () => {
      const response = await testApp.request('/api/todos/nonexistent-id/toggle', {
        method: 'PATCH'
      })

      expect(response.status).toBe(404)

      const body = await response.json()
      expect(body).toMatchObject({
        success: false,
        error: 'Todoが見つかりません'
      })
    })
  })

  // Todo削除テスト
  describe('DELETE /api/todos/:id', () => {
    it('Todoを正常に削除できる', async () => {
      // まず一覧を取得して既存のTodoのIDを取得
      const todosResponse = await testApp.request('/api/todos')
      expect(todosResponse.status).toBe(200)

      const todosBody = await todosResponse.json()
      const firstTodo = todosBody.data[0]

      // Todoを削除
      const response = await testApp.request(`/api/todos/${firstTodo.id}`, {
        method: 'DELETE'
      })

      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toMatchObject({
        success: true,
        message: 'Todoを削除しました'
      })

      // 削除されたことを確認
      const verificationResponse = await testApp.request(`/api/todos/${firstTodo.id}`)
      expect(verificationResponse.status).toBe(404)

      const verificationBody = await verificationResponse.json()
      expect(verificationBody).toMatchObject({
        success: false,
        error: 'Todoが見つかりません'
      })
    })

    it('存在しないIDの場合はエラーを返す', async () => {
      const response = await testApp.request('/api/todos/nonexistent-id', {
        method: 'DELETE'
      })

      expect(response.status).toBe(404)

      const body = await response.json()
      expect(body).toMatchObject({
        success: false,
        error: 'Todoが見つかりません'
      })
    })
  })

  // Todo個別取得テスト
  describe('GET /api/todos/:id', () => {
    it('指定されたIDのTodoを正常に取得できる', async () => {
      // まず一覧を取得して既存のTodoのIDを取得
      const todosResponse = await testApp.request('/api/todos')
      expect(todosResponse.status).toBe(200)

      const todosBody = await todosResponse.json()
      const firstTodo = todosBody.data[0]

      // 個別取得
      const response = await testApp.request(`/api/todos/${firstTodo.id}`)

      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toMatchObject({
        success: true,
        message: 'Todoを取得しました'
      })
      expect(body.data).toMatchObject({
        id: firstTodo.id,
        title: firstTodo.title,
        completed: firstTodo.completed
      })
    })

    it('存在しないIDの場合はエラーを返す', async () => {
      const response = await testApp.request('/api/todos/nonexistent-id')

      expect(response.status).toBe(404)

      const body = await response.json()
      expect(body).toMatchObject({
        success: false,
        error: 'Todoが見つかりません'
      })
    })
  })

  // ヘルスチェックテスト
  describe('GET /health', () => {
    it('ヘルスチェックが正常に応答する', async () => {
      const response = await testApp.request('/health')

      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body).toHaveProperty('status', 'OK')
      expect(body).toHaveProperty('timestamp')
      expect(typeof body.timestamp).toBe('string')
    })
  })

  // エラーハンドリングテスト
  describe('Error Handling', () => {
    it('存在しないエンドポイントは404エラーを返す', async () => {
      const response = await testApp.request('/nonexistent')

      expect(response.status).toBe(404)

      const body = await response.json()
      expect(body).toMatchObject({
        success: false,
        error: 'エンドポイントが見つかりません',
        path: '/nonexistent'
      })
    })

    it('不正なJSONでリクエストした場合はエラーを返す', async () => {
      const response = await testApp.request('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'invalid json'
      })

      expect(response.status).toBe(400)
    })
  })
})
