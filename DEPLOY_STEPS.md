# デプロイ前の準備手順

このドキュメントでは、セキュリティ対策を適用した後のデプロイ準備手順について説明します。

## 1. 環境変数の設定

環境変数ファイル`.env.local`を作成し、Firebase認証情報を設定します：

```bash
# src/webapp/.env.local.exampleをコピーして作成
cp src/webapp/.env.local.example src/webapp/.env.local

# エディタで開いて値を設定
# 例：
# NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sample1-...
# など
```

## 2. ローカル開発サーバーの起動

環境変数が正しく設定されていることを確認するためにローカル開発サーバーを起動します：

```bash
cd src/webapp
npm run dev
```

アプリケーションが正常に起動し、Firebase認証とFirestoreが機能していることを確認してください。

## 3. 本番ビルドのテスト

本番環境用のビルドを作成し、正常に動作することを確認します：

```bash
cd src/webapp
npm run build
npm run start
```

## 4. Vercelへのデプロイ

`DEPLOY_VERCEL.md`の手順に従ってVercelにデプロイします。その際、Vercelダッシュボードで環境変数を設定する必要があります。

### 環境変数の設定（Vercel）

1. Vercelダッシュボードでプロジェクトを選択
2. Settings > Environment Variables に移動
3. 以下の環境変数を追加：
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

## 5. Firebase 認証ドメインの設定

Firebaseコンソールで、Vercelでデプロイされたドメインを認証ドメインに追加します：

1. Firebaseコンソールにログイン
2. プロジェクトを選択
3. Authentication > Settings > Authorized domains
4. Vercelドメイン（例：`your-project.vercel.app`）を追加

## セキュリティチェックリスト

デプロイ前に以下のチェックリストを確認してください：

- [ ] 機密情報が.gitignoreされている
- [ ] 環境変数が正しく設定されている
- [ ] Firebase設定がハードコードされていない
- [ ] Firestoreのセキュリティルールが適切に設定されている
- [ ] 本番ビルドが正常に動作する

## トラブルシューティング

### 環境変数が認識されない場合

Next.jsで環境変数が認識されない場合は、以下を確認してください：

1. `.env.local`ファイルが正しい場所（`src/webapp/.env.local`）にある
2. 環境変数名が`NEXT_PUBLIC_`で始まっている
3. 開発サーバーを再起動している

### Firebase接続エラー

Firebase接続エラーが発生した場合：

1. 環境変数の値が正しいか確認
2. Firebase Consoleでプロジェクトが有効か確認
3. ブラウザのコンソールでエラーメッセージを確認