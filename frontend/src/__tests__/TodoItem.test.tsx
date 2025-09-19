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
      const todoContent = screen.getByText('完了済みTodo').parentElement
      expect(todoContent).toHaveClass('completed')
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
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      // 作成日時の表示を確認（日本語フォーマット）
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

    it('TodoタイトルエリアをクリックしてもonToggleが呼ばれる', async () => {
      const user = userEvent.setup()
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      // タイトル部分をクリック（ラベル要素として機能）
      const todoTitle = screen.getByText('テストTodo')
      await user.click(todoTitle)

      expect(mockOnToggle).toHaveBeenCalledTimes(1)
      expect(mockOnToggle).toHaveBeenCalledWith(mockTodo.id)
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

      // 説明セクションが存在しないことを確認
      expect(screen.queryByText('')).not.toBeInTheDocument()
    })

    it('長いタイトルでも適切に表示される', () => {
      const todoWithLongTitle = {
        ...mockTodo,
        title: 'これは非常に長いタイトルです。' +
               'Todoアイテムのタイトルが長い場合でも適切に表示されることを確認するためのテスト用データです。' +
               '文字数制限やレイアウトの崩れがないかをチェックします。'
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

    it('完了状態が適切にaria属性で示される', () => {
      render(
        <TodoItem
          todo={mockCompletedTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
      expect(checkbox).toHaveAttribute('aria-checked', 'true')
    })
  })

  // エッジケーステスト
  describe('Edge Cases', () => {
    it('日付が無効な場合でもエラーにならない', () => {
      const todoWithInvalidDate = {
        ...mockTodo,
        createdAt: new Date('invalid-date'),
        updatedAt: new Date('invalid-date')
      }

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

    it('特殊文字を含むタイトルでも正しく表示される', () => {
      const todoWithSpecialChars = {
        ...mockTodo,
        title: '<script>alert("XSS")</script> & "quotes" \'single\' 日本語 🎯'
      }

      render(
        <TodoItem
          todo={todoWithSpecialChars}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      )

      // エスケープされた形で表示されることを確認
      expect(screen.getByText(todoWithSpecialChars.title)).toBeInTheDocument()
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