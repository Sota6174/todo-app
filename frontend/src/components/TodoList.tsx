// Todo一覧を表示するコンポーネント
import type { Todo } from '../api/todos';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];                                // 表示するTodoリスト
  onToggle: (id: string) => void;              // 完了状態切り替えのコールバック
  onDelete: (id: string) => void;              // 削除のコールバック
  isLoading?: boolean;                         // ローディング状態（オプション）
}

export default function TodoList({ todos, onToggle, onDelete, isLoading = false }: TodoListProps) {
  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="todo-list loading">
        <p>Todoリストを読み込み中...</p>
      </div>
    );
  }

  // Todoが存在しない場合の表示
  if (todos.length === 0) {
    return (
      <div className="todo-list empty">
        <p>まだTodoがありません。新しいTodoを追加してみましょう！</p>
      </div>
    );
  }

  // 完了済みと未完了のTodoを分離
  const incompleteTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="todo-list">
      {/* Todo統計情報 */}
      <div className="todo-stats">
        <p>
          全{todos.length}件
          {incompleteTodos.length > 0 && ` （未完了: ${incompleteTodos.length}件）`}
          {completedTodos.length > 0 && ` （完了済み: ${completedTodos.length}件）`}
        </p>
      </div>

      {/* 未完了のTodo一覧 */}
      {incompleteTodos.length > 0 && (
        <div className="todo-section">
          <h3 className="section-title">未完了のTodo</h3>
          <div className="todo-items">
            {incompleteTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* 完了済みのTodo一覧 */}
      {completedTodos.length > 0 && (
        <div className="todo-section completed-section">
          <h3 className="section-title">完了済みのTodo</h3>
          <div className="todo-items">
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}