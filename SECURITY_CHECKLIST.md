# セキュリティチェックリスト - Gitリポジトリの機密情報対策

このドキュメントでは、GitHubなどの公開リポジトリにプロジェクトをアップロードする前に実施すべきセキュリティチェックと、発見された機密情報の対応について説明します。

## 発見された機密情報

以下の機密情報がプロジェクト内で検出されました：

1. **Firebase API キー等の認証情報**:
   - ファイル: `/src/webapp/firebase/config.js`
   - ファイル: `/src/webapp/.env.local`
   - 問題: Firebase設定の認証情報が直接コード内にハードコードされています。

## 必要な対応

### 1. `.gitignore`ファイルの確認と更新

以下のファイルがgitignoreされていることを確認してください：

```
# 環境変数ファイル
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 2. 機密情報を含むファイルの処理

1. **ハードコードされた認証情報を削除**:
   - `/src/webapp/firebase/config.js`を、環境変数を使用するバージョンに修正
   ```javascript
   const firebaseConfig = {
     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
   };
   ```

2. **環境変数ファイルの保護**:
   - `.env.local`をgitの履歴から削除（下記コマンドを参照）
   - `.env.local.example`を代わりに使用（環境変数名だけを含む）

3. **Gitの履歴から機密情報を削除**:
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch src/webapp/.env.local" \
   --prune-empty --tag-name-filter cat -- --all
   ```

### 3. Firebase認証情報の安全性

Firebase APIキーは公開されても特定の操作しか許可しないように制限されていますが、以下の対策を検討してください：

1. **Firebase認証ドメインの制限**:
   - Firebaseコンソールで、承認されたドメインの設定を確認し、必要なものだけを許可する

2. **Firebase Security Rulesの強化**:
   - Firestoreのセキュリティルールを見直し、適切な認証と認可が行われるようにする

3. **APIキーの再生成を検討**:
   - 既にGitリポジトリに公開されてしまった場合、Firebase Consoleでプロジェクト設定から新しいAPIキーの発行を検討する

## GitHubにプッシュする前のチェックリスト

1. **機密情報の検出**:
   - `git-secrets`などのツールを使用して、コミット前に機密情報をスキャン
   - `git diff --staged`で変更内容に機密情報が含まれていないか確認

2. **環境変数の取り扱い**:
   - `.env.local`や他の秘密の構成ファイルが`.gitignore`に含まれていることを確認
   - サンプルの`.env.example`のみをリポジトリに含める

3. **プリコミットフックの設定**:
   - セキュリティチェックをgitのプリコミットフックに追加して自動化

```bash
# プリコミットフック例 (.git/hooks/pre-commit)
#!/bin/sh
if git diff --cached | grep -i "API_KEY\|SECRET\|PASSWORD\|TOKEN" > /dev/null; then
  echo "警告: コミット内に機密情報が含まれている可能性があります"
  exit 1
fi
```

## Vercelデプロイ時の注意点

1. **環境変数の設定**:
   - Vercelダッシュボードで環境変数を安全に設定する
   - リポジトリには`.env.local`ファイルをプッシュしない

2. **ビルドプロセス**:
   - ビルドログにシークレットが出力されていないことを確認

## セキュリティベストプラクティス

1. **環境変数の使用**:
   - すべての機密データは環境変数として外部化し、コードにハードコードしない

2. **最小権限の原則**:
   - Firebase および他のサービスでは、最小限の権限だけを付与

3. **セキュリティの定期的な監査**:
   - リポジトリとデプロイされたアプリケーションの両方を定期的に監査

4. **シークレットの管理**:
   - 本番環境のシークレットは、シークレット管理サービスまたはCI/CDプラットフォームの機能を使用して管理

5. **自動セキュリティスキャン**:
   - GitHubのSecurity Alertsなどの機能を有効にして、コードの脆弱性を自動的に検出する