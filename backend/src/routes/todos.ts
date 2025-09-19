import { Hono } from 'hono';
import { validator } from 'hono/validator';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodoCompletion,
  deleteTodo
} from '../store/todoStore.js';
import type { CreateTodoRequest, UpdateTodoRequest } from '../types/todo.js';

// Todo専用のHonoインスタンスを作成
const todos = new Hono();

// GET /api/todos - 全Todo取得
todos.get('/', (c) => {
  try {
    const allTodos = getAllTodos();
    return c.json({
      success: true,
      data: allTodos,
      message: 'Todoリストを取得しました'
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Todoリストの取得に失敗しました'
    }, 500);
  }
});

// GET /api/todos/:id - 特定のTodo取得
todos.get('/:id', (c) => {
  try {
    const id = c.req.param('id');
    const todo = getTodoById(id);

    if (!todo) {
      return c.json({
        success: false,
        error: 'Todoが見つかりません'
      }, 404);
    }

    return c.json({
      success: true,
      data: todo,
      message: 'Todoを取得しました'
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Todoの取得に失敗しました'
    }, 500);
  }
});

// POST /api/todos - 新しいTodo作成
todos.post(
  '/',
  validator('json', (value, c) => {
    // リクエストボディのバリデーション
    if (!value || typeof value !== 'object') {
      return c.json({
        success: false,
        error: 'リクエストボディが不正です'
      }, 400);
    }

    const { title, description } = value as any;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return c.json({
        success: false,
        error: 'タイトルは必須項目です'
      }, 400);
    }

    if (description !== undefined && typeof description !== 'string') {
      return c.json({
        success: false,
        error: '説明は文字列である必要があります'
      }, 400);
    }

    return {
      title: title.trim(),
      description: description?.trim()
    } as CreateTodoRequest;
  }),
  (c) => {
    try {
      const request = c.req.valid('json');
      const newTodo = createTodo(request);

      return c.json({
        success: true,
        data: newTodo,
        message: 'Todoを作成しました'
      }, 201);
    } catch (error) {
      return c.json({
        success: false,
        error: 'Todoの作成に失敗しました'
      }, 500);
    }
  }
);

// PUT /api/todos/:id - Todo更新
todos.put(
  '/:id',
  validator('json', (value, c) => {
    if (!value || typeof value !== 'object') {
      return c.json({
        success: false,
        error: 'リクエストボディが不正です'
      }, 400);
    }

    const { title, description, completed } = value as any;

    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      return c.json({
        success: false,
        error: 'タイトルは空文字列にできません'
      }, 400);
    }

    if (description !== undefined && typeof description !== 'string') {
      return c.json({
        success: false,
        error: '説明は文字列である必要があります'
      }, 400);
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
      return c.json({
        success: false,
        error: '完了状態はboolean値である必要があります'
      }, 400);
    }

    return {
      title: title?.trim(),
      description: description?.trim(),
      completed
    } as UpdateTodoRequest;
  }),
  (c) => {
    try {
      const id = c.req.param('id');
      const request = c.req.valid('json');

      const updatedTodo = updateTodo(id, request);

      if (!updatedTodo) {
        return c.json({
          success: false,
          error: 'Todoが見つかりません'
        }, 404);
      }

      return c.json({
        success: true,
        data: updatedTodo,
        message: 'Todoを更新しました'
      });
    } catch (error) {
      return c.json({
        success: false,
        error: 'Todoの更新に失敗しました'
      }, 500);
    }
  }
);

// PATCH /api/todos/:id/toggle - 完了状態切り替え
todos.patch('/:id/toggle', (c) => {
  try {
    const id = c.req.param('id');
    const updatedTodo = toggleTodoCompletion(id);

    if (!updatedTodo) {
      return c.json({
        success: false,
        error: 'Todoが見つかりません'
      }, 404);
    }

    return c.json({
      success: true,
      data: updatedTodo,
      message: `Todoを${updatedTodo.completed ? '完了' : '未完了'}に変更しました`
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Todoの状態切り替えに失敗しました'
    }, 500);
  }
});

// DELETE /api/todos/:id - Todo削除
todos.delete('/:id', (c) => {
  try {
    const id = c.req.param('id');
    const success = deleteTodo(id);

    if (!success) {
      return c.json({
        success: false,
        error: 'Todoが見つかりません'
      }, 404);
    }

    return c.json({
      success: true,
      message: 'Todoを削除しました'
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Todoの削除に失敗しました'
    }, 500);
  }
});

export default todos;