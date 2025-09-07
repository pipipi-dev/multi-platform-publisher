# 📝 記事投稿ワークフロー

複数プラットフォームへの記事作成・投稿の完全ガイドです。

---

## 📋 前提条件

初期セットアップが完了していることを確認してください：
- ✅ リポジトリのフォーク/クローン完了
- ✅ 必要なAPIトークンを設定済み
- ✅ GitHub Actions有効化済み

> **📖 未設定の場合**: [SETUP.md](SETUP.md) を参照してセットアップを完了してください。

---

## Step 1: 記事作成

### 新規記事作成

`articles/` フォルダに新しい `.md` ファイルを作成します：

```markdown
---
title: "Next.js パフォーマンス最適化"
emoji: "⚡"
type: "tech"
topics: ["nextjs", "react", "performance"]
published: false  # Zenn公開設定（まず false で下書き）

# マルチプラットフォーム投稿設定
platforms:
  qiita: true   # Qiitaに投稿
  devto: true   # Dev.toに投稿
---

# Next.js パフォーマンス最適化

## はじめに
この記事では...
```

### 画像管理

#### 画像ファイルの配置
画像は `images/` ディレクトリに配置します。推奨命名規則：

```bash
# 推奨命名パターン
images/YYYYMMDD-01-description.png
images/YYYYMMDD-02-another-image.jpg
```

#### 記事内での画像参照
記事内では GitHub Raw URL の絶対パスで参照します：

```markdown
![画像の説明](https://raw.githubusercontent.com/{your-username}/multi-platform-publisher/main/images/filename.png)

*画像の補足説明（オプション）*
```

### 独自記法の自動変換

システムは Zenn 独自記法を各プラットフォーム向けに自動変換します：

#### メッセージボックスの変換

**Zenn 形式（元記事）:**
```markdown
:::message
注意事項をここに記載
:::

:::message alert
重要な警告をここに記載
:::
```

**Qiita 形式（自動変換後）:**
```markdown
:::note warn
注意事項をここに記載
:::

:::note alert
重要な警告をここに記載
:::
```

> **📝 執筆時の注意**: 記事は Zenn 形式で執筆してください。各プラットフォーム向けの変換は自動で行われます。

---

## Step 2: プレビュー

### Zenn プレビュー
```bash
npx zenn preview
# → http://localhost:8000 を開く
```

### Qiita プレビュー
```bash
# 最初にQiita形式に変換
npm run convert

# Qiita版をプレビュー（設定ファイル指定）
npm run preview:qiita
# → http://127.0.0.1:8888 を開く
```

### 同時プレビュー（推奨）
```bash
npm run preview:all
# → ZennとQiitaの両方のプレビューを同時に開く
```

---

## Step 3: 投稿プロセス

### 投稿前チェックリスト
- [ ] 記事内容の最終確認完了
- [ ] 画像を `images/` ディレクトリに追加済み
- [ ] 画像パスが絶対形式で設定済み
- [ ] メタデータが正しく設定済み
- [ ] プラットフォーム選択を指定済み（必要な場合）

### 記事投稿
```bash
# 1. 変更をステージングしてコミット
git add articles/my-awesome-article.md images/
git commit -m "記事追加: 記事タイトル"

# 2. プッシュしてGitHub Actionsを起動
git push origin main
```

### GitHub Actions ワークフロー
1. **変更検出**: `articles/` 内の新規/変更ファイルをスキャン
2. **公開記事フィルタ**: `published: true` の記事のみ処理
3. **プラットフォーム選択**: `platforms` オブジェクトが指定されている場合はそれを尊重
4. **メタデータ変換**: Zenn形式をプラットフォーム固有形式に変換
5. **API投稿**: プラットフォームAPIを経由して投稿
6. **リポジトリ更新**: 変換済み記事を対応フォルダにコミット

---

## Step 4: 投稿後確認

### ワークフロー状況確認
```bash
# GitHub Actions結果を表示
open https://github.com/[your-username]/multi-platform-publisher/actions
```

### 投稿記事確認
- **Zenn**: `https://zenn.dev/[username]/articles/[slug]`
- **Qiita**: Qiitaダッシュボードで確認
- **Dev.to**: Dev.toダッシュボードで確認

### ローカルリポジトリ同期
```bash
# GitHub Actionsで作成された変換記事をプル
git pull origin main

# 生成されたファイルを確認
ls qiita/public/    # Qiita版
ls dev-to/          # Dev.to版
```

---

## 🛠️ ユーティリティコマンド

### 記事管理
```bash
# 全記事一覧
ls articles/*.md

# 下書き記事検索
grep -l "published: false" articles/*.md

# 公開記事検索
grep -l "published: true" articles/*.md

# プラットフォーム指定記事検索
grep -l "platforms:" articles/*.md
```

### 開発用コマンド
```bash
# 依存関係インストール
npm install

# 全プレビュー実行
npm run preview:all

# 記事変換（ドライラン）
npm run convert

# 全記事変換テスト（Git差分無関係）
node scripts/convert-articles.js --test

# 投稿テスト（ドライラン）
npm run publish:dry
```

---

## 🔧 トラブルシューティング

### よくあるエラーと解決法

#### ❌ 変換が失敗する

**原因**: 記事フロントマターの構文エラー
**解決法**: 
```bash
# 記事変換で詳細エラー確認
npm run convert

# 全記事の変換動作確認（開発・テスト時）
node scripts/convert-articles.js --test

# 特定ファイルの構文確認
npx js-yaml articles/my-article.md
```

#### ❌ 画像が表示されない

**原因**: 画像パスの設定ミス
**解決法**: 
- 画像が `images/` ディレクトリにあることを確認
- GitHub Raw URL の絶対パスで記述されていることを確認
