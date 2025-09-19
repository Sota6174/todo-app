import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddTodo from '../components/AddTodo'

// AddTodoコンポーネントのテスト
describe('AddTodo Component', () => {
  // モック関数をテスト前にリセット
  const mockOnAdd = vi.fn()

  beforeEach(() => {
    mockOnAdd.mockClear()
  })

  // 基本的なレンダリングテスト
  describe('Rendering', () => {
    it('正しく全ての要素がレンダリングされる', () => {
      render(<AddTodo onAdd={mockOnAdd} isLoading={false} />)

      // フォーム要素の存在確認
      expect(screen.getByPlaceholderText('Todoのタイトルを入力してください')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Todoの詳細説明を入力してください（任意）')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Todoを追加/i })).toBeInTheDocument()

      // タイトルとヘッダーの確認
      expect(screen.getByText('新しいTodoをTodoを追加')).toBeInTheDocument()
    })

    it('ローディング中は適切なUIが表示される', () => {
      render(<AddTodo onAdd={mockOnAdd} isLoading={true} />)

      // ローディング状態での確認
      const addButton = screen.getByRole('button', { name: /Todoを追加中.../i })
      expect(addButton).toBeInTheDocument()
      expect(addButton).toBeDisabled()
    })
  })

  // フォーム入力テスト
  describe('Form Input', () => {
    it('タイトル入力フィールドに文字を入力できる', async () => {
      const user = userEvent.setup()
      render(<AddTodo onAdd={mockOnAdd} isLoading={false} />)

      const titleInput = screen.getByPlaceholderText('Todoのタイトルを入力してください')
      await user.type(titleInput, 'テストTodo')

      expect(titleInput).toHaveValue('テストTodo')
    })

    it('説明入力フィールドに文字を入力できる', async () => {
      const user = userEvent.setup()
      render(<AddTodo onAdd={mockOnAdd} isLoading={false} />)

      const descriptionInput = screen.getByPlaceholderText('Todoの詳細説明を入力してください（任意）')
      await user.type(descriptionInput, 'テスト説明')

      expect(descriptionInput).toHaveValue('テスト説明')
    })
  })

  // フォーム送信テスト
  describe('Form Submission', () => {
    it('有効なデータでフォーム送信ができる', async () => {
      const user = userEvent.setup()
      render(<AddTodo onAdd={mockOnAdd} isLoading={false} />)

      // フォーム入力
      const titleInput = screen.getByPlaceholderText('Todoのタイトルを入力してください')
      const descriptionInput = screen.getByPlaceholderText('Todoの詳細説明を入力してください（任意）')
      const addButton = screen.getByRole('button', { name: /Todoを追加/i })

      await user.type(titleInput, 'テストTodo')
      await user.type(descriptionInput, 'テスト説明')
      await user.click(addButton)

      // onTodoAdd関数が正しい引数で呼ばれることを確認
      expect(mockOnAdd).toHaveBeenCalledTimes(1)
      expect(mockOnAdd).toHaveBeenCalledWith({
        title: 'テストTodo',
        description: 'テスト説明'
      })
    })

    it('タイトルのみでもフォーム送信ができる', async () => {
      const user = userEvent.setup()
      render(<AddTodo onAdd={mockOnAdd} isLoading={false} />)

      const titleInput = screen.getByPlaceholderText('Todoのタイトルを入力してください')
      const addButton = screen.getByRole('button', { name: /Todoを追加/i })

      await user.type(titleInput, 'タイトルのみTodo')
      await user.click(addButton)

      expect(mockOnAdd).toHaveBeenCalledWith({
        title: 'タイトルのみTodo',
        description: undefined
      })
    })

    it('送信後にフォームがクリアされる', async () => {
      const user = userEvent.setup()
      render(<AddTodo onAdd={mockOnAdd} isLoading={false} />)

      const titleInput = screen.getByPlaceholderText('Todoのタイトルを入力してください')
      const descriptionInput = screen.getByPlaceholderText('Todoの詳細説明を入力してください（任意）')
      const addButton = screen.getByRole('button', { name: /Todoを追加/i })

      // フォーム入力と送信
      await user.type(titleInput, 'テストTodo')
      await user.type(descriptionInput, 'テスト説明')
      await user.click(addButton)

      // フォームがクリアされることを確認
      await waitFor(() => {
        expect(titleInput).toHaveValue('')
        expect(descriptionInput).toHaveValue('')
      })
    })
  })

  // バリデーションテスト
  describe('Form Validation', () => {
    it('空のタイトルでは送信できない', async () => {
      const user = userEvent.setup()
      render(<AddTodo onAdd={mockOnAdd} isLoading={false} />)

      const addButton = screen.getByRole('button', { name: /Todoを追加/i })
      await user.click(addButton)

      // onTodoAdd関数が呼ばれないことを確認
      expect(mockOnAdd).not.toHaveBeenCalled()
    })

    it('空白のみのタイトルでは送信できない', async () => {
      const user = userEvent.setup()
      render(<AddTodo onAdd={mockOnAdd} isLoading={false} />)

      const titleInput = screen.getByPlaceholderText('Todoのタイトルを入力してください')
      const addButton = screen.getByRole('button', { name: /Todoを追加/i })

      await user.type(titleInput, '   ')
      await user.click(addButton)

      expect(mockOnAdd).not.toHaveBeenCalled()
    })

    it('ローディング中は送信できない', async () => {
      const user = userEvent.setup()
      render(<AddTodo onAdd={mockOnAdd} isLoading={true} />)

      const titleInput = screen.getByPlaceholderText('Todoのタイトルを入力してください')
      await user.type(titleInput, 'テストTodo')

      const addButton = screen.getByRole('button', { name: /Todoを追加中.../i })
      expect(addButton).toBeDisabled()

      // ボタンがクリックできないことを確認
      await user.click(addButton)
      expect(mockOnAdd).not.toHaveBeenCalled()
    })
  })

  // Enterキーでの送信テスト
  describe('Keyboard Interaction', () => {
    it('タイトルフィールドでEnterキーを押すと送信される', async () => {
      const user = userEvent.setup()
      render(<AddTodo onAdd={mockOnAdd} isLoading={false} />)

      const titleInput = screen.getByPlaceholderText('Todoのタイトルを入力してください')
      await user.type(titleInput, 'Enterで送信テスト')
      await user.keyboard('{Enter}')

      expect(mockOnAdd).toHaveBeenCalledWith({
        title: 'Enterで送信テスト',
        description: undefined
      })
    })

    it('説明フィールドでEnterキーを押しても送信されない', async () => {
      const user = userEvent.setup()
      render(<AddTodo onAdd={mockOnAdd} isLoading={false} />)

      const titleInput = screen.getByPlaceholderText('Todoのタイトルを入力してください')
      const descriptionInput = screen.getByPlaceholderText('Todoの詳細説明を入力してください（任意）')

      await user.type(titleInput, 'テストタイトル')
      await user.click(descriptionInput)
      await user.type(descriptionInput, 'テスト説明')
      await user.keyboard('{Enter}')

      // 説明フィールドからのEnterでは送信されない
      expect(mockOnAdd).not.toHaveBeenCalled()
    })
  })

  // アクセシビリティテスト
  describe('Accessibility', () => {
    it('適切なaria-labelやroleが設定されている', () => {
      render(<AddTodo onAdd={mockOnAdd} isLoading={false} />)

      // ボタンがroleを持っていることを確認
      const addButton = screen.getByRole('button', { name: /Todoを追加/i })
      expect(addButton).toBeInTheDocument()

      // フォームが適切なセマンティクスを持っていることを確認
      const form = screen.getByRole('group')
      expect(form).toBeInTheDocument()
    })

    it('必須フィールドが適切にマークされている', () => {
      render(<AddTodo onAdd={mockOnAdd} isLoading={false} />)

      const titleInput = screen.getByPlaceholderText('Todoのタイトルを入力してください')
      expect(titleInput).toBeRequired()
    })
  })
})