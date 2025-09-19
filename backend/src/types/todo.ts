// Todo項目のデータ構造を定義する型
export interface Todo {
  id: string;          // 一意識別子
  title: string;       // Todoのタイトル
  description?: string; // Todoの詳細説明（オプション）
  completed: boolean;  // 完了状態（true: 完了, false: 未完了）
  createdAt: Date;     // 作成日時
  updatedAt: Date;     // 最終更新日時
}

// Todo作成時のリクエストボディ型（id、日時は自動生成されるため除外）
export interface CreateTodoRequest {
  title: string;
  description?: string;
}

// Todo更新時のリクエストボディ型（部分更新対応）
export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}