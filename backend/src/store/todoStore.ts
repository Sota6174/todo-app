import type { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo.js';

// メモリ内でTodoデータを保存する配列
let todos: Todo[] = [];

// 一意IDを生成するためのカウンター
let idCounter = 1;

// 一意ID生成関数
const generateId = (): string => {
  return `todo_${idCounter++}`;
};

// 全Todoを取得
export const getAllTodos = (): Todo[] => {
  return [...todos]; // 配列のコピーを返す
};

// IDでTodoを取得
export const getTodoById = (id: string): Todo | undefined => {
  return todos.find(todo => todo.id === id);
};

// 新しいTodoを作成
export const createTodo = (request: CreateTodoRequest): Todo => {
  const now = new Date();
  const newTodo: Todo = {
    id: generateId(),
    title: request.title,
    description: request.description,
    completed: false, // 新規作成時は未完了
    createdAt: now,
    updatedAt: now
  };

  todos.push(newTodo);
  return newTodo;
};

// Todoを更新
export const updateTodo = (id: string, request: UpdateTodoRequest): Todo | null => {
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) {
    return null; // Todo が見つからない
  }

  const existingTodo = todos[todoIndex];
  const updatedTodo: Todo = {
    ...existingTodo,
    title: request.title !== undefined ? request.title : existingTodo.title,
    description: request.description !== undefined ? request.description : existingTodo.description,
    completed: request.completed !== undefined ? request.completed : existingTodo.completed,
    updatedAt: new Date()
  };

  todos[todoIndex] = updatedTodo;
  return updatedTodo;
};

// Todoの完了状態を切り替え
export const toggleTodoCompletion = (id: string): Todo | null => {
  const todo = getTodoById(id);
  if (!todo) {
    return null;
  }

  return updateTodo(id, { completed: !todo.completed });
};

// Todoを削除
export const deleteTodo = (id: string): boolean => {
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) {
    return false; // Todo が見つからない
  }

  todos.splice(todoIndex, 1);
  return true;
};

// テスト用のサンプルデータを初期化
export const initializeSampleData = (): void => {
  const now = new Date();

  todos = [
    {
      id: generateId(),
      title: 'サンプルTodo 1',
      description: 'これは最初のサンプルTodoです',
      completed: false,
      createdAt: now,
      updatedAt: now
    },
    {
      id: generateId(),
      title: 'サンプルTodo 2',
      description: 'これは完了済みのサンプルTodoです',
      completed: true,
      createdAt: now,
      updatedAt: now
    }
  ];
};