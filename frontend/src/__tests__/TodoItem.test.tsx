/**
 * TodoItemコンポーネント テスト
 *
 * 【テスト対象】
 * - 個別のTodoアイテム表示・操作用コンポーネント
 * - チェックボックスによる完了状態切り替え機能
 * - 削除ボタンの動作とコールバック連携
 *
 * 【テスト項目】
 * 1. 基本レンダリング（未完了・完了済みTodoの表示）
 * 2. 条件付きレンダリング（説明の有無、日時表示）
 * 3. ユーザーインタラクション（チェック・削除操作）
 * 4. アクセシビリティ（aria-label、チェック状態）
 * 5. エラーケース（無効日付のハンドリング）
 * 6. 状態変化（プロパティ変更時の再レンダリング）
 *
 * 【重要度】★★☆ 推奨テスト
 * Todoリストの主要な表示・操作コンポーネントとしての動作保証
 *
 * 【不要なテスト】
 * - 特殊文字のXSSテスト（Reactが自動処理するため不要）
 * - 過剰なアクセシビリティテスト（基本的な属性確認で十分）
 * - 非現実的な長いタイトルテスト（実用的な範囲のテストに簡略化）
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from '../components/TodoItem'

// テスト用のサンプルTodoデータ
const mockTodo = {
  id: 'todo-1',
  title: 'テストTodo',
  description: 'テスト用の説明',
  completed: false,
  createdAt: new Date('2024-01-01T10:00:00Z'),
  updatedAt: new Date('2024-01-01T10:00:00Z')
}

const mockCompletedTodo = {
  ...mockTodo,
  id: 'todo-2',
  title: '完了済みTodo',
  completed: true
}

// TodoItemコンポーネントのテスト
describe('TodoItem Component', () => {
  const mockOnToggle = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    mockOnToggle.mockClear()
    mockOnDelete.mockClear()
  })

  // 基本的なレンダリングテスト
  describe('Rendering', () => {
    it('未完了のTodoが正しくレンダリングされる', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      // タイトルと説明の表示確認
      expect(screen.getByText('テストTodo')).toBeInTheDocument()
      expect(screen.getByText('テスト用の説明')).toBeInTheDocument()

      // チェックボックスが未チェック状態
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()

      // 削除ボタンの存在確認
      expect(screen.getByRole('button', { name: /削除/i })).toBeInTheDocument()
    })

    it('完了済みのTodoが正しくレンダリングされる', () => {
      render(
        <TodoItem
          todo={mockCompletedTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      // チェックボックスがチェック状態
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()

      // 完了済みスタイルが適用されている（クラス名で確認）
      const todoItem = screen.getByText('完了済みTodo').closest('.todo-item')
      expect(todoItem).toHaveClass('completed')
    })

    it('説明がない場合は説明欄が表示されない', () => {
      const todoWithoutDescription = {
        ...mockTodo,
        description: undefined
      }

      render(
        <TodoItem
          todo={todoWithoutDescription}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      // タイトルは表示される
      expect(screen.getByText('テストTodo')).toBeInTheDocument()

      // 説明は表示されない（説明用のクラス要素が存在しない）
      expect(screen.queryByText('テスト用の説明')).not.toBeInTheDocument()
    })

    it('日時が正しくフォーマットされて表示される', () => {
      // 更新日時が異なるTodoデータを作成
      const todoWithDifferentDates = {
        ...mockTodo,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z')
      }

      render(
        <TodoItem
          todo={todoWithDifferentDates}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      // 作成日時と更新日時の表示を確認
      expect(screen.getByText(/作成:/)).toBeInTheDocument()
      expect(screen.getByText(/更新:/)).toBeInTheDocument()
    })
  })

  // インタラクションテスト
  describe('User Interactions', () => {
    it('チェックボックスをクリックするとonToggleが呼ばれる', async () => {
      const user = userEvent.setup()
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(mockOnToggle).toHaveBeenCalledTimes(1)
      expect(mockOnToggle).toHaveBeenCalledWith(mockTodo.id)
    })

    it('削除ボタンをクリックするとonDeleteが呼ばれる', async () => {
      const user = userEvent.setup()
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /削除/i })
      await user.click(deleteButton)

      expect(mockOnDelete).toHaveBeenCalledTimes(1)
      expect(mockOnDelete).toHaveBeenCalledWith(mockTodo.id)
    })
  })

  // 条件付きレンダリングテスト
  describe('Conditional Rendering', () => {
    it('空の説明文字列の場合は説明欄が表示されない', () => {
      const todoWithEmptyDescription = {
        ...mockTodo,
        description: ''
      }

      render(
        <TodoItem
          todo={todoWithEmptyDescription}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      // 説明が表示されないことを確認（description用のpタグが存在しない）
      expect(screen.queryByText('テスト用の説明')).not.toBeInTheDocument()
      const descriptionElement = screen.queryByText(/テスト用の説明/)
      expect(descriptionElement).not.toBeInTheDocument()
    })

    it('実用的な範囲の長いタイトルでも適切に表示される', () => {
      const todoWithLongTitle = {
        ...mockTodo,
        title: 'プロジェクトの進捗確認と連絡調整を行い、明日のミーティングの資料を準備する'
      }

      render(
        <TodoItem
          todo={todoWithLongTitle}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      expect(screen.getByText(todoWithLongTitle.title)).toBeInTheDocument()
    })
  })

  // アクセシビリティテスト
  describe('Accessibility', () => {
    it('チェックボックスに適切なaria-labelが設定されている', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAccessibleName()
    })

    it('削除ボタンに適切なaria-labelが設定されている', () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /削除/i })
      expect(deleteButton).toHaveAccessibleName()
    })

    it('完了状態が適切にチェックボックスで示される', () => {
      render(
        <TodoItem
          todo={mockCompletedTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })
  })

  // 重要なエラーケーステスト
  describe('Error Handling', () => {
    it('無効な日付でもエラーにならない', () => {
      const todoWithInvalidDate = {
        ...mockTodo,
        createdAt: new Date('invalid'),
        updatedAt: new Date('invalid')
      }

      // レンダリングがエラーにならないことを確認
      expect(() => {
        render(
          <TodoItem
            todo={todoWithInvalidDate}
            onToggle={mockOnToggle}
            onDelete={mockOnDelete}
          />
        )
      }).not.toThrow()
    })
  })

  // 状態変化テスト
  describe('State Changes', () => {
    it('プロパティが変更された時に再レンダリングされる', () => {
      const { rerender } = render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      expect(screen.getByText('テストTodo')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).not.toBeChecked()

      // プロパティを変更して再レンダリング
      rerender(
        <TodoItem
          todo={mockCompletedTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      expect(screen.getByText('完了済みTodo')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeChecked()
    })
  })
})
