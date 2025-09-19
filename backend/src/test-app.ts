// テスト専用のアプリケーション設定 - サーバー起動を含まない
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import todosRouter from './routes/todos.js'

// Honoアプリケーションインスタンスを作成（テスト用）
const testApp = new Hono()

// CORS設定 - フロントエンド（localhost:5173）からのアクセスを許可
testApp.use('/*', cors({
  origin: ['http://localhost:5173'],  // Viteの開発サーバーからのアクセスを許可
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

// ルートエンドポイント - サーバー稼働確認用
testApp.get('/', (c) => {
  return c.json({
    message: 'Todo API Server is running!',
    version: '1.0.0',
    endpoints: {
      todos: '/api/todos'
    }
  })
})

// API ルートグループの設定
testApp.route('/api/todos', todosRouter)

// ヘルスチェックエンドポイント
testApp.get('/health', (c) => {
  return c.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  })
})

// 404エラーハンドリング
testApp.notFound((c) => {
  return c.json({
    success: false,
    error: 'エンドポイントが見つかりません',
    path: c.req.path
  }, 404)
})

export default testApp