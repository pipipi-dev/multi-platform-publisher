---
title: "Multi-Platform Publisher を使ってみよう"
emoji: "🚀"
type: "tech"
topics: ["zenn", "qiita", "devto", "automation", "githubactions"]
published: false  # Zenn公開設定

# マルチプラットフォーム投稿設定
platforms:
  qiita: false  # Qiita投稿設定
  devto: false  # Dev.to投稿設定
---

## 🎯 この記事の概要

**解決する問題**
- 複数プラットフォームへの記事投稿の手間
- プラットフォーム別のフォーマット対応の負担
- 記事管理の煩雑さ

**対象読者**
- 技術記事を複数プラットフォームに投稿したい方
- GitHub Actions の基本的な使い方を理解している方
- 効率的な記事投稿ワークフローを求めている方

**前提知識**
- Git の基本操作
- Markdown記法の基礎
- GitHub の基本的な使い方

## 📊 結論・要点

**Multi-Platform Publisher の主な利点**
- ✅ **一度の執筆で複数投稿**: Zenn形式で書くだけで3つのプラットフォームに対応
- ✅ **自動フォーマット変換**: プラットフォーム固有の記法を自動変換
- ✅ **GitHub Actions統合**: プッシュするだけの簡単な投稿フロー
- ✅ **柔軟な投稿制御**: プラットフォーム別の公開・非公開設定

このサンプル記事では、Multi-Platform Publisher の基本的な使い方を実際の手順とともに解説します。

## 💡 このツールでできること

- **一度書けば、どこでも投稿**: Zenn形式で記事を書くだけ
- **自動変換**: 各プラットフォーム用のフォーマットに自動変換
- **GitHub Actions連携**: プッシュするだけで自動投稿

## 📝 記事の書き方

### プラットフォーム別投稿制御

```markdown
---
title: "記事のタイトル"
emoji: "🚀"
type: "tech"
topics: ["タグ1", "タグ2", "タグ3"]
published: true   # Zennに投稿する場合はtrue、しない場合はfalse
platforms:
  qiita: true     # Qiitaに投稿する場合はtrue、しない場合はfalse
  devto: false    # Dev.toに投稿する場合はtrue、しない場合はfalse
---
```

## 🖼️ 画像の管理

画像は `images/` フォルダに配置し、絶対パスで参照：

```markdown
![サンプル画像](https://raw.githubusercontent.com/pipipi-dev/multi-platform-publisher/main/images/sample.png)
```

## 🔄 投稿フロー

1. **記事作成**: `articles/` フォルダに `.md` ファイルを作成
2. **プレビュー確認**: `npm run preview:all` でローカル確認
3. **投稿**: Git にプッシュするだけで自動投稿

## 💡 Tips

### ファイル名について
- 日付プレフィクス（`YYYYMMDD-`）はオプション
- 管理しやすくしたい場合に使用
- `my-article.md` でも `20250904-my-article.md` でも動作します

### プレビューコマンド
```bash
# Zenn プレビュー（localhost:8000）
npm run preview:zenn

# Qiita プレビュー（127.0.0.1:8888）
npm run preview:qiita

# 両方同時にプレビュー
npm run preview:all
```

## 🚀 実際に投稿してみましょう

1. この記事の `published: false` を `published: true` に変更
2. Git にコミット・プッシュ
3. GitHub Actions が自動実行
4. 各プラットフォームで記事を確認

## 🎯 まとめ

**Multi-Platform Publisher** を活用することで、以下の効果が期待できます：

✅ **時間削減**
- 1つの記事作成で3つのプラットフォームに同時投稿
- フォーマット変換の自動化

✅ **品質向上**
- 統一されたMarkdown記法による一貫した記事品質
- プレビュー機能による事前確認

✅ **管理の効率化**
- Git によるバージョン管理
- プラットフォーム別の投稿制御

### 次のステップ
1. このサンプル記事を参考に自分の記事を作成
2. プレビュー機能で投稿前確認を習慣化
3. 投稿実績を蓄積して読者との接点を拡大

**あなたの記事投稿ライフがより効率的になることを願っています！**

> **💡 ヒント**: このサンプル記事は自由に削除・編集して構いません。あなたの最初の記事として活用してください。