// バックエンドAPIとの通信を行うクライアント関数群
// APIエンドポイントはhttp://localhost:3001/api/todosを想定

// Todo型定義（バックエンドと同じ型構造）
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Todo作成リクエスト型
export interface CreateTodoRequest {
  title: string;
  description?: string;
}

// Todo更新リクエスト型
export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

// APIレスポンス型（バックエンドのレスポンス形式に合わせる）
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// APIのベースURL（環境に応じて変更可能）
const API_BASE_URL = 'http://localhost:3001/api';

// 汎用的なAPIリクエスト関数
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    // HTTPエラーの場合、レスポンスボディからエラー情報を取得
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP Error: ${response.status}`);
  }

  return response.json();
}

// 全Todo取得
export async function getAllTodos(): Promise<Todo[]> {
  const response = await apiRequest<ApiResponse<Todo[]>>('/todos');

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Todoリストの取得に失敗しました');
  }

  // DateオブジェクトをJSONから復元
  return response.data.map(todo => ({
    ...todo,
    createdAt: new Date(todo.createdAt),
    updatedAt: new Date(todo.updatedAt)
  }));
}

// 特定Todo取得
export async function getTodoById(id: string): Promise<Todo> {
  const response = await apiRequest<ApiResponse<Todo>>(`/todos/${id}`);

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Todoの取得に失敗しました');
  }

  // DateオブジェクトをJSONから復元
  return {
    ...response.data,
    createdAt: new Date(response.data.createdAt),
    updatedAt: new Date(response.data.updatedAt)
  };
}

// Todo作成
export async function createTodo(request: CreateTodoRequest): Promise<Todo> {
  const response = await apiRequest<ApiResponse<Todo>>('/todos', {
    method: 'POST',
    body: JSON.stringify(request),
  });

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Todoの作成に失敗しました');
  }

  // DateオブジェクトをJSONから復元
  return {
    ...response.data,
    createdAt: new Date(response.data.createdAt),
    updatedAt: new Date(response.data.updatedAt)
  };
}

// Todo更新
export async function updateTodo(id: string, request: UpdateTodoRequest): Promise<Todo> {
  const response = await apiRequest<ApiResponse<Todo>>(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Todoの更新に失敗しました');
  }

  // DateオブジェクトをJSONから復元
  return {
    ...response.data,
    createdAt: new Date(response.data.createdAt),
    updatedAt: new Date(response.data.updatedAt)
  };
}

// Todo完了状態切り替え
export async function toggleTodoCompletion(id: string): Promise<Todo> {
  const response = await apiRequest<ApiResponse<Todo>>(`/todos/${id}/toggle`, {
    method: 'PATCH',
  });

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Todoの状態切り替えに失敗しました');
  }

  // DateオブジェクトをJSONから復元
  return {
    ...response.data,
    createdAt: new Date(response.data.createdAt),
    updatedAt: new Date(response.data.updatedAt)
  };
}

// Todo削除
export async function deleteTodo(id: string): Promise<void> {
  const response = await apiRequest<ApiResponse>(`/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.success) {
    throw new Error(response.error || 'Todoの削除に失敗しました');
  }
}