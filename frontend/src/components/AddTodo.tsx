// 新しいTodoを追加するためのフォームコンポーネント
import { useState } from 'react';
import type { CreateTodoRequest } from '../api/todos';

interface AddTodoProps {
  onAdd: (request: CreateTodoRequest) => void;  // Todo追加のコールバック
  isLoading?: boolean;                          // ローディング状態（オプション）
}

export default function AddTodo({ onAdd, isLoading = false }: AddTodoProps) {
  // フォームの状態管理
  const [title, setTitle] = useState('');         // タイトル入力
  const [description, setDescription] = useState(''); // 説明入力

  // フォーム送信ハンドラー
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // タイトルの入力チェック（前後の空白を除去）
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return; // 空の場合は何もしない
    }

    // Todo追加リクエストを作成
    const request: CreateTodoRequest = {
      title: trimmedTitle,
      description: description.trim() || undefined  // 空文字の場合はundefinedに
    };

    // 親コンポーネントにTodo追加を通知
    onAdd(request);

    // フォームをクリア
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <h2>新しいTodoを追加</h2>

      {/* タイトル入力フィールド */}
      <div className="input-group">
        <label htmlFor="title">タイトル *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Todoのタイトルを入力してください"
          required
          disabled={isLoading}
          className="title-input"
        />
      </div>

      {/* 説明入力フィールド */}
      <div className="input-group">
        <label htmlFor="description">説明（オプション）</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Todoの詳細説明を入力してください（任意）"
          disabled={isLoading}
          className="description-input"
          rows={3}
        />
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={!title.trim() || isLoading}
        className="add-button"
      >
        {isLoading ? '追加中...' : 'Todoを追加'}
      </button>
    </form>
  );
}