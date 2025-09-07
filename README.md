# Multi Platform Publisher 🚀

**一度書けば、どこでも投稿** - Zenn、Qiita、Dev.to への自動記事投稿システム

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **English Version**: [README_en.md](README_en.md)

## ✨ 特徴

- **📝 単一ソース**: Zenn形式で一度記事を書くだけ
- **🤖 自動投稿**: 複数プラットフォームに自動で投稿
- **🌐 マルチプラットフォーム**: Zenn、Qiita、Dev.to に対応
- **🏷️ スマートメタデータ**: プラットフォーム固有のメタデータを自動変換
- **🖼️ 画像管理**: GitHub 経由で画像を一元管理
- **🔄 同期更新**: 全プラットフォームで記事を同期保持

## 📂 構成

```
multi-platform-publisher/
├── articles/          # 📝 技術記事（Markdown形式）
│   └── *.md          # 各記事ファイル
├── images/           # 🖼️ 記事用画像
│   └── *.png/jpg     # 画像ファイル
├── scripts/          # 🛠️ 変換・投稿スクリプト
│   ├── convert-articles.js  # 記事変換処理
│   └── publish-articles.js  # API投稿処理
├── config/           # ⚙️ 設定ファイル
│   └── published-articles.json  # 投稿済み記事の管理
├── .github/          # 🤖 GitHub設定
│   └── workflows/
│       └── publish.yml  # 自動投稿ワークフロー
├── package.json      # 📦 依存関係とコマンド定義
├── package-lock.json # 📦 依存関係のロックファイル
└── .gitignore        # 📝 Git除外設定

# 自動生成されるフォルダ（.gitignoreで除外）
├── qiita/public/     # 🔄 自動変換されたQiita記事
└── dev-to/           # 🔄 自動変換されたDev.to記事
```

## 🚀 クイックスタート

### 📖 詳細なセットアップ手順

**初回利用者は [SETUP.md](docs/SETUP.md) を参照してください** - 詳細なセットアップガイドです。

### 1. リポジトリのセットアップ

1. リポジトリのフォーク・クローン
2. Zenn GitHub連携設定
3. APIキーの取得
4. GitHub Secrets設定  
5. GitHub Actions権限設定

### 2. 最初の記事を書く

`articles/`に新しいMarkdownファイルを作成：

```markdown
# ファイル名例: articles/my-awesome-article.md または articles/YYYYMMDD-my-awesome-article.md
---
title: "素晴らしい記事"
emoji: "🚀"
type: "tech"
topics: ["javascript", "web"]
published: true  # Zenn公開設定

# マルチプラットフォーム投稿設定
platforms:
  qiita: true   # Qiitaに投稿
  devto: true   # Dev.toに投稿
---

# 素晴らしい記事

記事の内容をここに書きます...
```

> **📝 ファイル名について**: 日付プレフィクス（`YYYYMMDD-`）はオプションです。ファイル管理を容易にしたい場合に使用してください。システムは日付なしのファイル名でも正常に動作します。

### 3. 投稿

リポジトリにプッシュするだけ：

```bash
git add articles/my-awesome-article.md
git commit -m "新規記事追加: 素晴らしい記事"
git push
```

GitHub Actions が自動で：
- 各プラットフォーム用に記事を変換
- Zenn に投稿（GitHub連携経由）
- Qiita に投稿（API経由）
- Dev.to に投稿（API経由）

## ⚙️ 初期設定

**詳細な設定手順は [📖 SETUP.md](docs/SETUP.md) を参照してください。**

### 必要なもの
- GitHubアカウント
- 投稿したいプラットフォームのアカウント（Zenn/Qiita/Dev.to）
- 各プラットフォームのAPIトークン（必要に応じて）

> **📌 注意**: トークンが設定されていないプラットフォームへの投稿は自動的にスキップされます。

## 📝 記事の書き方

**詳細な記事作成ワークフローは [📖 WORKFLOW.md](docs/WORKFLOW.md) を参照してください。**

### 基本フォーマット

```markdown
---
title: "記事タイトル"
emoji: "🚀"
type: "tech"
topics: ["タグ1", "タグ2"]
published: true  # Zenn公開設定

# マルチプラットフォーム投稿設定
platforms:
  qiita: true   # Qiitaに投稿
  devto: true   # Dev.toに投稿
---

# 記事の内容
記事の本文をここに書きます...
```

### 投稿の仕様
- **Zenn**: `published: true/false` で公開/下書き制御
- **Qiita/Dev.to**: `platforms` オブジェクトで投稿制御
- **画像**: `images/` フォルダに配置し、GitHub Raw URLで参照

## 🤖 動作の仕組み

1. **記事検出**: GitHub Actionsが`articles/`内の新規/変更記事を検出
2. **メタデータ解析**: Zennフロントマターを抽出し各プラットフォーム用に変換
3. **コンテンツ変換**: プラットフォーム固有の要件に合わせてコンテンツを調整
   - **独自記法変換**: Zennメッセージボックス → Qiitaノートボックス
   - **メタデータ変換**: プラットフォーム固有形式への調整
4. **API投稿**: プラットフォームAPIを使用して記事を作成/更新
5. **同期管理**: 全プラットフォーム間での一貫性を維持

## 📖 詳細ドキュメント

### 利用可能なドキュメント

| ドキュメント | 説明 |
|------------|------|
| [SETUP.md](docs/SETUP.md) | 初期セットアップガイド |
| [WORKFLOW.md](docs/WORKFLOW.md) | 詳細ワークフローガイド |

### 含まれる内容
- 環境セットアップガイド
- 記事作成・プレビュー手順
- プラットフォーム選択
- 投稿ワークフロー
- トラブルシューティング

## 🛠️ 開発

### ローカル環境セットアップ

```bash
# 依存関係をインストール
npm install

# 変換スクリプトをローカルで実行
npm run convert

# 全記事変換テスト（Git差分無関係）
node scripts/convert-articles.js --test

# 投稿テスト（ドライラン）
npm run publish:dry

# 記事プレビュー
npm run preview:all

# Zennプレビュー（ポート8000）
npm run preview:zenn

# Qiitaプレビュー（ポート8888）
npm run preview:qiita
```

### カスタムスクリプト

`scripts/`ディレクトリには変換ユーティリティが含まれています：
- `convert-articles.js` - Zennから各プラットフォーム形式への変換
  - 通常モード: Git差分のある記事のみ変換
  - テストモード: `--test` オプションで全記事を変換対象
- `publish-articles.js` - 各プラットフォームへのAPI投稿処理

## 📚 参考ドキュメント

- [Zenn CLI ドキュメント](https://zenn.dev/zenn/articles/zenn-cli-guide)
- [Qiita CLI ドキュメント](https://qiita.com/Qiita/items/666e190490d0af90a92b)
- [Qiita API ドキュメント](https://qiita.com/api/v2/docs)
- [Dev.to API ドキュメント](https://developers.forem.com/api)
- [GitHub Actions ドキュメント](https://docs.github.com/ja/actions)

---

**楽しい投稿ライフを！ 🚀**
