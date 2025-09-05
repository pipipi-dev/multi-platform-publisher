# 🚀 Multi Platform Publisher セットアップガイド

このガイドでは、Multi Platform Publisherシステムを使って複数プラットフォームに自動投稿するための初期セットアップを説明します。

## 📋 前提条件

- GitHubアカウント
- Zenn、Qiita、Dev.toのアカウント
- 基本的なGit操作の知識

---

## 🎯 Step 1: リポジトリのフォーク・クローン

### 1.1 GitHubでフォーク
1. オリジナルリポジトリにアクセス
2. 右上の「Fork」ボタンをクリック
3. あなたのアカウントにフォーク

### 1.2 ローカルにクローン
```bash
# あなたのフォークしたリポジトリをクローン
git clone https://github.com/[あなたのユーザー名]/multi-platform-publisher.git
cd multi-platform-publisher

# 依存関係をインストール
npm install
```

---

## 🔗 Step 2: Zenn GitHub連携設定

ZennはAPIではなくGitHub連携を使用します。

### 2.1 Zennでリポジトリ連携

1. **Zennにログイン**
   - https://zenn.dev/

2. **GitHubからのデプロイ設定**
   - 右上のアバター → 「GitHubからのデプロイ」

3. **リポジトリ設定**
   - 「リポジトリ設定」をクリック
   - 「リポジトリを連携する」をクリック

4. **リポジトリ選択**
   - 「Only select repositories」を選択
   - `[あなたのユーザー名]/multi-platform-publisher`を選択
   - 「連携する」をクリック

### 2.2 連携確認

設定完了後、Zennの設定画面で連携されたリポジトリが表示されることを確認。

---

## 🔑 Step 3: APIキーの取得

各プラットフォームのAPIキーを取得します。

### 3.1 Qiita APIトークン取得

1. **Qiita設定画面にアクセス**
   - https://qiita.com/settings/applications

2. **個人用アクセストークン作成**
   - 「新しくトークンを発行する」をクリック
   - **説明**: `Qiita Multi Platform Publisher`
   - **スコープ**: 
     - ✅ `read_qiita`
     - ✅ `write_qiita`
   - 「発行する」をクリック

3. **トークンをコピー**
   - ⚠️ **重要**: 一度しか表示されないため、必ずコピーして安全な場所に保存

### 3.2 Dev.to APIキー取得

1. **Dev.to設定画面にアクセス**
   - https://dev.to/settings/extensions

2. **APIキー生成**
   - 「Generate API Key」をクリック
   - **Description**: `Dev.to Multi Platform Publisher`
   - 「Generate API Key」をクリック

3. **APIキーをコピー**
   - 表示されたAPIキーをコピーして安全な場所に保存

---

## ⚙️ Step 4: GitHub Secrets設定

### 4.1 GitHubリポジトリ設定画面へ

1. あなたのフォークしたリポジトリページにアクセス
2. 「Settings」タブをクリック
3. 左サイドバーで「Secrets and variables」→「Actions」を選択

### 4.2 Secretsを追加

「New repository secret」をクリックして、必要なプラットフォームのシークレットを作成：

> **📌 注意**: 全てのトークンを設定する必要はありません。使用したいプラットフォームのトークンのみ設定してください。設定されていないプラットフォームは自動的にスキップされます。

#### Secret 1: Qiita APIトークン（Qiitaに投稿する場合）
- **Name**: `QIITA_API_TOKEN`
- **Secret**: Step 3.1で取得したQiitaのAPIトークン
- 「Add secret」をクリック

#### Secret 2: Dev.to APIキー（Dev.toに投稿する場合）
- **Name**: `DEV_TO_API_KEY`
- **Secret**: Step 3.2で取得したDev.toのAPIキー
- 「Add secret」をクリック

### 4.3 設定確認

「Repository secrets」に以下が表示されることを確認：
```
QIITA_API_TOKEN        ••••••••••••••••
DEV_TO_API_KEY         ••••••••••••••••
```

## 🔧 Step 5: GitHub Actions権限設定

GitHub Actionsが投稿記録ファイル（`config/published-articles.json`）を更新できるように権限を設定します。

### 5.1 Actions権限設定を開く

1. リポジトリの「Settings」タブをクリック
2. 左サイドバーで「Actions」→「General」を選択
3. 下にスクロールして「Workflow permissions」セクションを探す

### 5.2 権限を設定

「Workflow permissions」で以下を選択：
- ✅ **Read and write permissions**
- ✅ **Allow GitHub Actions to create and approve pull requests**（オプション）

「Save」をクリックして設定を保存

---

## 🎨 Step 6: CLI環境セットアップ（オプション）

ローカルでプレビューしたい場合のセットアップです。

### 6.1 Zenn CLI初期化
```bash
# Zenn CLIを初期化
npx zenn init

# プレビューサーバー起動（テスト用）
npx zenn preview
# → http://localhost:8000 でプレビュー表示
```

### 6.2 Qiita CLI初期化
```bash
# Qiita CLIを初期化
npx qiita init

# プレビューサーバー起動（テスト用）
npx qiita preview  
# → http://localhost:8888 でプレビュー表示
```

### 6.3 同時プレビュー
```bash
# ZennとQiitaを同時プレビュー
npm run preview:all
```

---

## ✅ セットアップ完了！

以上で初期セットアップは完了です。

### 次のステップ

📖 **[WORKFLOW.md](WORKFLOW.md)** で以下を学びましょう：
- 記事の作成方法
- プラットフォーム選択
- プレビューの確認
- 投稿プロセス
- トラブルシューティング

---

## 🔧 トラブルシューティング

### よくあるエラーと解決法

#### ❌ Zennに記事が表示されない

**原因**: GitHub連携の設定ミス
**解決法**: Step 2のZenn連携設定を再実行し、連携が正しく完了しているか確認

#### ❌ GitHub Actionsが失敗する

**原因**: APIキーの設定ミスまたは権限不足
**解決法**: 
- Step 4のSecrets設定を再確認
- Step 5のWorkflow permissions設定を確認
