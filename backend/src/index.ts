import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import todosRouter from './routes/todos.js'
import { initializeSampleData } from './store/todoStore.js'

// Honoアプリケーションインスタンスを作成
const app = new Hono()

// CORS設定 - フロントエンド（localhost:5173）からのアクセスを許可
app.use('/*', cors({
  origin: ['http://localhost:5173'],  // Viteの開発サーバーからのアクセスを許可
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

// サンプルデータを初期化（開発用）
initializeSampleData()

// ルートエンドポイント - サーバー稼働確認用
app.get('/', (c) => {
  return c.json({
    message: 'Todo API Server is running!',
    version: '1.0.0',
    endpoints: {
      todos: '/api/todos'
    }
  })
})

// API ルートグループの設定
app.route('/api/todos', todosRouter)

// ヘルスチェックエンドポイント
app.get('/health', (c) => {
  return c.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  })
})

// 404エラーハンドリング
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'エンドポイントが見つかりません',
    path: c.req.path
  }, 404)
})

// サーバー起動（ポート3001に変更して計画書に合わせる）
serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`🚀 Todo API Server is running on http://localhost:${info.port}`)
  console.log(`📝 API Documentation: http://localhost:${info.port}/api/todos`)
  console.log(`💊 Health Check: http://localhost:${info.port}/health`)
})
