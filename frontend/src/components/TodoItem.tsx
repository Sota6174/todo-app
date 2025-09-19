// 個別のTodoアイテムを表示・操作するコンポーネント
import type { Todo } from '../api/todos';

interface TodoItemProps {
  todo: Todo;                                    // 表示するTodoオブジェクト
  onToggle: (id: string) => void;               // 完了状態切り替えのコールバック
  onDelete: (id: string) => void;               // 削除のコールバック
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  // 日付を読みやすい形式でフォーマット
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {/* 完了状態切り替えチェックボックス */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
        aria-label={`${todo.title}を${todo.completed ? '未完了' : '完了'}に変更`}
      />

      {/* Todo内容表示エリア */}
      <div className="todo-content">
        {/* タイトル */}
        <h3 className="todo-title">{todo.title}</h3>

        {/* 説明（存在する場合のみ表示） */}
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}

        {/* 作成日時 */}
        <div className="todo-meta">
          <span className="todo-date">作成: {formatDate(todo.createdAt)}</span>
          {/* 更新日時が作成日時と異なる場合のみ表示 */}
          {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
            <span className="todo-date">更新: {formatDate(todo.updatedAt)}</span>
          )}
        </div>
      </div>

      {/* 削除ボタン */}
      <button
        onClick={() => onDelete(todo.id)}
        className="delete-button"
        aria-label={`${todo.title}を削除`}
        title="削除"
      >
        🗑️
      </button>
    </div>
  );
}