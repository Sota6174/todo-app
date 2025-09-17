# Todo App - Hono + React + Vite

HonoとReactを使用したシンプルなTodoアプリケーションです。ViteのReact TypeScriptテンプレートをベースに、Honoサーバーを追加した構成となっています。

## 🛠 技術スタック

### フロントエンド
- **React** - UIライブラリ
- **Vite** - ビルドツール・開発サーバー
- **TypeScript** - 型安全性の確保

### バックエンド
- **Hono** - 軽量・高速なWebフレームワーク
- **Node.js** - ランタイム
- **TypeScript** - 型安全性の確保

## 📋 機能

- Todo一覧表示
- Todo追加
- Todo完了/未完了の切り替え
- Todo削除

## 🚀 開発環境のセットアップ

### 前提条件
- Node.js (v18以上)
- npm

### インストール
```bash
# 依存関係のインストール
npm install
```

### 開発サーバーの起動

#### フロントエンドとバックエンドを同時起動
```bash
npm run dev:both
```

#### フロントエンドのみ起動
```bash
npm run dev
```

#### バックエンドのみ起動
```bash
npm run dev:server
```

### アクセスURL
- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:3001

## 🏗 プロジェクト構造

```
todo-app2/
├── src/
│   ├── components/          # Reactコンポーネント
│   ├── api/                 # API通信関数
│   ├── server/              # Honoサーバー
│   ├── App.tsx              # メインコンポーネント
│   └── main.tsx             # エントリーポイント
├── public/
├── package.json
└── vite.config.ts
```

## 🔧 利用可能なスクリプト

- `npm run dev` - フロントエンドの開発サーバー起動
- `npm run dev:server` - バックエンドサーバー起動
- `npm run dev:both` - フロントエンドとバックエンドを同時起動
- `npm run build` - プロダクション用ビルド
- `npm run preview` - ビルド結果のプレビュー

## 📚 学習目的

このプロジェクトは以下の技術的理解を深めることを目的としています：

### Vite
- 高速な開発サーバー
- TypeScript標準サポート
- HMR（ホットモジュール置換）

### Hono
- 軽量で高速なWebフレームワーク
- TypeScript完全対応
- シンプルなAPI設計

### React
- コンポーネント設計
- 状態管理（useState）
- 副作用処理（useEffect）
- イベントハンドリング