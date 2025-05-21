# Next.js + Firebase タスク管理アプリケーション構成

このドキュメントでは、Next.js と Firebase で構築されたタスク管理アプリケーションのプロジェクト構成について説明します。

## プロジェクト概要

このプロジェクトは、Next.js と Firebase を使用したタスク管理アプリケーションです。ユーザーは認証を通じてアプリにログインし、個人のタスクを作成、読取、更新、削除することができます。

### 主な機能

- **ユーザー認証**: メール/パスワードを使用したログイン・登録システム
- **タスク管理**: タスクの作成、表示、編集、削除（CRUD操作）
- **プロフィール管理**: ユーザープロフィール情報の確認と編集
- **レスポンシブUI**: 様々なデバイスで利用可能なレスポンシブデザイン

## 技術スタック

- **フロントエンド**: Next.js, React
- **バックエンド**: Firebase
  - Firebase Authentication (認証)
  - Cloud Firestore (データベース)
- **スタイリング**: CSS-in-JS (styled-jsx)

## ディレクトリ構造

```
websample1/
├── src/
│   ├── firebase/
│   │   └── config.js              # Firebase設定（環境変数使用）
│   │
│   └── webapp/                    # Next.jsアプリケーション
│       ├── components/            # Reactコンポーネント
│       │   ├── auth/              # 認証関連コンポーネント
│       │   │   ├── LoginForm.js
│       │   │   ├── LogoutButton.js
│       │   │   ├── ProfileForm.js
│       │   │   ├── ProtectedRoute.js
│       │   │   └── SignupForm.js
│       │   │
│       │   ├── layout/
│       │   │   └── Layout.js      # 共通レイアウトコンポーネント
│       │   │
│       │   └── tasks/            # タスク関連コンポーネント
│       │       ├── TaskDetail.js  # タスク詳細表示
│       │       ├── TaskEditForm.js # タスク編集フォーム
│       │       ├── TaskForm.js    # タスク作成フォーム
│       │       ├── TaskItem.js    # タスク個別表示
│       │       ├── TaskList.js    # タスク一覧
│       │       ├── TaskListView.js # 別形式のタスク一覧
│       │       └── index.js
│       │
│       ├── firebase/
│       │   └── config.js         # Firebaseの初期化・設定
│       │
│       ├── lib/                  # ユーティリティと共通ロジック
│       │   ├── auth/             # 認証ロジック
│       │   │   ├── AuthContext.js # 認証状態管理コンテキスト
│       │   │   └── authUtils.js  # 認証ユーティリティ関数
│       │   │
│       │   └── firestore/        # Firestoreデータ操作
│       │       ├── index.js
│       │       ├── models.js     # データモデル定義
│       │       ├── profileService.js # プロフィール操作
│       │       └── taskService.js # タスク操作 (CRUD)
│       │
│       ├── pages/                # Next.jsのページ
│       │   ├── _app.js           # アプリケーションのルート
│       │   ├── dashboard.js      # ダッシュボード (要認証)
│       │   ├── index.js          # ホームページ
│       │   ├── login.js          # ログインページ
│       │   ├── profile.js        # プロフィールページ (要認証)
│       │   └── signup.js         # 新規登録ページ
│       │
│       ├── public/               # 静的ファイル
│       │
│       ├── styles/
│       │   └── globals.css       # グローバルスタイル
│       │
│       ├── package.json          # 依存関係と設定
│       └── package-lock.json
│
├── TODO.md                       # 開発タスクリスト
├── DEPLOY_VERCEL.md              # Vercelデプロイ手順
└── PROJECT_STRUCTURE.md          # このファイル
```

## 主要コンポーネントと機能説明

### 1. 認証システム

認証システムは、Firebase Authentication を使用して実装されています。

- **AuthContext.js**: React Context API を使用してアプリケーション全体で認証状態を共有
- **LoginForm.js / SignupForm.js**: ユーザーログインと新規登録フォーム
- **ProtectedRoute.js**: 非認証ユーザーのアクセスを制限するためのRouteラッパー
- **authUtils.js**: ログイン、登録、ログアウトなどの認証関連ユーティリティ関数

### 2. データベース連携

Firestoreを使用してタスクとユーザープロフィールデータを管理しています。

- **models.js**: データモデルの定義と検証
- **taskService.js**: タスク関連のCRUD操作を実装
  - タスクの作成、取得、更新、削除
  - ユーザーIDに基づくタスクのフィルタリング
- **profileService.js**: ユーザープロフィール操作を実装
  - プロフィール情報の取得と更新

### 3. UIコンポーネント

UIは、Next.jsとReactコンポーネントを使用して構築されています。

- **Layout.js**: 共通のページレイアウト（ヘッダー、フッター、ナビゲーション）
- **TaskList.js**: タスク一覧の表示と管理（フィルタリング、ソート機能）
- **TaskItem.js**: 個別タスクの表示と操作（完了・未完了の切り替え）
- **TaskForm.js**: 新規タスク作成フォーム
- **TaskDetail.js**: タスクの詳細表示
- **TaskEditForm.js**: タスク編集フォーム

### 4. ページ構造

Next.jsのページルーティングを使用して、以下のページが実装されています。

- **index.js (/)**: ホームページ - アプリケーションの紹介と機能概要
- **login.js (/login)**: ログインページ
- **signup.js (/signup)**: 新規登録ページ
- **dashboard.js (/dashboard)**: タスク管理ダッシュボード（要認証）
- **profile.js (/profile)**: ユーザープロフィール管理（要認証）

## データフロー

1. **認証フロー**:
   - ユーザーがログインまたは登録フォームを送信
   - Firebase Authenticationで認証処理
   - 認証状態が`AuthContext`を通じてアプリケーション全体に共有
   - 認証状態に基づいて適切なUIとナビゲーションを表示

2. **タスク管理フロー**:
   - 認証済みユーザーがタスク作成フォームを使用して新規タスクを作成
   - タスクデータがFirestoreに保存され、ユーザーIDと関連付け
   - タスク一覧コンポーネントが、ユーザーのタスクをFirestoreから取得して表示
   - ユーザーがタスクを編集または削除すると、Firestoreのデータも更新

## スタイリング

アプリケーションは、CSS-in-JS (styled-jsx) を使用してスタイリングされています。

- コンポーネントごとにスコープ付きCSSを定義
- グローバルスタイルは `globals.css` で定義
- レスポンシブデザインはメディアクエリを使用

## セキュリティ

- **クライアントサイド**: Firebase Authentication を使用してユーザー認証
- **データベース**: Firestoreセキュリティルールにより、ユーザーは自身のデータのみにアクセス可能
- **認証保護**: ProtectedRouteコンポーネントにより、未認証ユーザーは保護されたページにアクセスできない

## デプロイ

アプリケーションは以下の方法でデプロイできます：

- **Vercel**: Next.jsアプリケーションの推奨デプロイプラットフォーム（詳細は `DEPLOY_VERCEL.md` を参照）
- **Firebase Hosting**: 静的ファイルのホスティングとFirebase統合

## 拡張の可能性

このプロジェクトは以下のような機能で拡張できます：

1. **ソーシャル認証**: Google, Facebook, Twitterなどのソーシャルログイン追加
2. **共有機能**: タスクの共有やチーム機能の追加
3. **通知機能**: タスクのリマインダーや期限通知
4. **分析機能**: タスク完了率などのユーザー活動分析
5. **オフライン対応**: Service WorkerとIndexedDBを使用したオフライン機能

## 開発者向け情報

- **開発サーバー起動**: `npm run dev`
- **本番ビルド作成**: `npm run build`
- **本番サーバー起動**: `npm run start`

## 環境変数設定

`.env.local` ファイルに以下の環境変数を設定する必要があります：

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```