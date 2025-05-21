# Vercelへのデプロイ手順

このドキュメントでは、Next.js + Firebaseで構築されたタスク管理アプリケーションをVercelにデプロイする手順を説明します。

## 前提条件

- GitHubアカウント
- Vercelアカウント（[vercel.com](https://vercel.com)で作成可能）
- デプロイ準備が完了したNext.jsプロジェクト

## 1. GitHubにプロジェクトをプッシュする

Vercelは直接GitHubリポジトリからデプロイするため、まずプロジェクトをGitHubにプッシュする必要があります。

```bash
# リモートリポジトリがまだ設定されていない場合
git remote add origin https://github.com/ユーザー名/リポジトリ名.git

# mainブランチにプッシュ
git push -u origin main
```

## 2. Vercelアカウントの設定

1. [Vercel](https://vercel.com)にアクセスしてログインする（GitHubアカウントでログイン可能）
2. 新しいVercelアカウントの場合は、必要に応じて基本情報を入力する

## 3. プロジェクトのインポート

1. Vercelダッシュボードで「New Project」をクリック
2. 「Import Git Repository」セクションからプロジェクトのGitHubリポジトリを選択
   - 表示されない場合は「Add GitHub Account」または「Configure GitHub App」をクリックしてGitHubとの連携を設定

## 4. プロジェクト設定の構成

「Import Project」画面で以下の設定を行います：

1. **Project Name**: プロジェクト名を入力（デフォルトではリポジトリ名）
2. **Framework Preset**: 自動的に「Next.js」が選択されているはず
3. **Root Directory**: プロジェクトのルートディレクトリを指定
   - このプロジェクトの場合は `src/webapp` を指定

## 5. 環境変数の設定

Firebase構成情報などの環境変数を設定します：

1. 「Environment Variables」セクションを展開
2. プロジェクトの `.env.local` ファイルの内容を追加
   - 以下のFirebase関連の環境変数を設定：

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 6. デプロイ設定の確認と実行

1. すべての設定を確認
2. 「Deploy」ボタンをクリック
3. Vercelがプロジェクトのビルドとデプロイを自動的に開始

## 7. デプロイの確認

1. デプロイが完了すると、プロジェクトダッシュボードに移動
2. 「Visit」ボタンをクリックして、デプロイされたアプリケーションにアクセス
3. 以下の機能が正常に動作することを確認：
   - ユーザー登録・ログイン
   - タスクの作成・編集・削除
   - レスポンシブデザイン

## 8. カスタムドメインの設定（任意）

デフォルトでは、`プロジェクト名.vercel.app` のURLが割り当てられます。カスタムドメインを使用する場合：

1. Vercelプロジェクトダッシュボードで「Settings」タブをクリック
2. 「Domains」セクションにアクセス
3. 「Add」ボタンをクリックしてカスタムドメインを追加
4. 表示される指示に従ってDNSレコードを設定

## 9. 継続的デプロイメント

Vercelは継続的デプロイメントをサポートしています：

- GitHubのmainブランチに変更をプッシュすると、自動的に新しいデプロイが開始される
- プルリクエストごとにプレビューデプロイが作成される

## トラブルシューティング

### ビルドエラーが発生する場合

1. Vercelダッシュボードでデプロイのログを確認
2. パッケージの依存関係に問題がないか確認
3. 環境変数が正しく設定されているか確認

### Firebase接続の問題

1. Firebaseコンソールで認証の許可ドメインに `vercel.app` ドメイン（またはカスタムドメイン）を追加
2. Firestoreのセキュリティルールを確認し、必要に応じて調整

## 参考リンク

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js公式デプロイガイド](https://nextjs.org/docs/deployment)
- [Firebase Hostingとの併用方法](https://firebase.google.com/docs/hosting/frameworks/nextjs)