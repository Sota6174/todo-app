// メインアプリケーションコンポーネント - Todoアプリの全体を統合
import { useState, useEffect } from 'react';
import './App.css';

// APIクライアント関数をインポート
import {
  getAllTodos,
  createTodo,
  toggleTodoCompletion,
  deleteTodo
} from './api/todos';

// 型定義をインポート
import type { Todo, CreateTodoRequest } from './api/todos';

// コンポーネントをインポート
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

export default function App() {
  // アプリケーションの状態管理
  const [todos, setTodos] = useState<Todo[]>([]);        // Todoリスト
  const [isLoading, setIsLoading] = useState(false);     // ローディング状態
  const [error, setError] = useState<string | null>(null); // エラー状態

  // 初回マウント時にTodo一覧を取得
  useEffect(() => {
    loadTodos();
  }, []);

  // Todo一覧を読み込む関数
  const loadTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const todoList = await getAllTodos();
      setTodos(todoList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Todoの取得に失敗しました');
      console.error('Todo読み込みエラー:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 新しいTodoを追加する関数
  const handleAddTodo = async (request: CreateTodoRequest) => {
    try {
      setError(null);
      const newTodo = await createTodo(request);
      setTodos(prevTodos => [...prevTodos, newTodo]); // 新しいTodoを末尾に追加
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Todoの追加に失敗しました');
      console.error('Todo追加エラー:', err);
    }
  };

  // Todo完了状態を切り替える関数
  const handleToggleTodo = async (id: string) => {
    try {
      setError(null);
      const updatedTodo = await toggleTodoCompletion(id);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Todoの状態変更に失敗しました');
      console.error('Todo状態変更エラー:', err);
    }
  };

  // Todoを削除する関数
  const handleDeleteTodo = async (id: string) => {
    try {
      setError(null);
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Todoの削除に失敗しました');
      console.error('Todo削除エラー:', err);
    }
  };

  return (
    <div className="app">
      {/* ヘッダー */}
      <header className="app-header">
        <h1>📝 Todo アプリ</h1>
        <p>HonoとReactで作るシンプルなTodoアプリケーション</p>
      </header>

      {/* メインコンテンツ */}
      <main className="app-main">
        {/* エラーメッセージ表示 */}
        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button onClick={loadTodos} className="retry-button">
              再試行
            </button>
          </div>
        )}

        {/* Todo追加フォーム */}
        <section className="add-todo-section">
          <AddTodo onAdd={handleAddTodo} isLoading={isLoading} />
        </section>

        {/* Todo一覧表示 */}
        <section className="todo-list-section">
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            isLoading={isLoading}
          />
        </section>
      </main>

      {/* フッター */}
      <footer className="app-footer">
        <p>Phase 3: フロントエンド実装完了 🎉</p>
      </footer>
    </div>
  );
}