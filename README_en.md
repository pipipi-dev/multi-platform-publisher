# Multi Platform Publisher 🚀

**Write once, publish everywhere** - Automated article publishing to Zenn, Qiita, and Dev.to from a single repository.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **日本語版**: [README.md](README.md)

## ✨ Features

- **📝 Single Source**: Write articles once in Zenn format
- **🤖 Auto Publishing**: Automatically publish to multiple platforms
- **🌐 Multi-Platform**: Supports Zenn, Qiita, and Dev.to
- **🏷️ Smart Metadata**: Convert platform-specific metadata automatically
- **🖼️ Image Management**: Centralized image hosting via GitHub
- **🔄 Sync Updates**: Keep articles synchronized across platforms

## 📂 Structure

```
multi-platform-publisher/
├── articles/          # 📝 Technical articles (Markdown format)
│   └── *.md          # Article files
├── images/           # 🖼️ Article images
│   └── *.png/jpg     # Image files
├── scripts/          # 🛠️ Conversion and publishing scripts
│   ├── convert-articles.js  # Article conversion logic
│   └── publish-articles.js  # API publishing logic
├── config/           # ⚙️ Configuration files
│   └── published-articles.json  # Published articles tracking
├── .github/          # 🤖 GitHub configuration
│   └── workflows/
│       └── publish.yml  # Automated publishing workflow
├── package.json      # 📦 Dependencies and commands
├── package-lock.json # 📦 Dependency lock file
└── .gitignore        # 📝 Git exclusions

# Auto-generated folders (excluded by .gitignore)
├── qiita/public/     # 🔄 Auto-converted Qiita articles
└── dev-to/           # 🔄 Auto-converted Dev.to articles
```

## 🚀 Quick Start

### 📖 Detailed Setup Guide

**First-time users should refer to [SETUP_en.md](docs/SETUP_en.md)** - A comprehensive setup guide with step-by-step instructions.

### 1. Setup Repository

1. Fork and Clone Repository
2. Zenn GitHub Integration
3. Obtain API Keys
4. Configure GitHub Secrets
5. GitHub Actions Permissions

### 2. Write Your First Article

Create a new Markdown file in `articles/`:

```markdown
# Filename examples: articles/my-awesome-article.md or articles/YYYYMMDD-my-awesome-article.md
---
title: "My Awesome Article"
emoji: "🚀"
type: "tech"
topics: ["javascript", "web"]
published: true  # Zenn publishing setting

# Multi-platform publishing settings
platforms:
  qiita: true   # Publish to Qiita
  devto: true   # Publish to Dev.to
---

# My Awesome Article

Content goes here...
```

> **📝 Filename Convention**: Date prefix (`YYYYMMDD-`) is optional. Use it if you want easier file management. The system works perfectly with or without date prefixes.

### 3. Publish

Simply push to the repository:

```bash
git add articles/my-awesome-article.md
git commit -m "Add new article: My Awesome Article"
git push
```

GitHub Actions will automatically publish to selected platforms.

## ⚙️ Initial Configuration

**For detailed configuration instructions, see [📖 SETUP_en.md](docs/SETUP_en.md).**

### Requirements
- GitHub account
- Accounts on platforms you want to publish to (Zenn/Qiita/Dev.to)
- API tokens for each platform (as needed)

> **📌 Note**: Platforms without configured tokens will be automatically skipped during publishing.

## 📝 Writing Articles

**For detailed article creation workflow, see [📖 WORKFLOW_en.md](docs/WORKFLOW_en.md).**

### Basic Format

```markdown
---
title: "Article Title"
emoji: "🚀"
type: "tech"
topics: ["tag1", "tag2"]
published: true  # Zenn publishing setting

# Multi-platform publishing settings
platforms:
  qiita: true   # Publish to Qiita
  devto: true   # Publish to Dev.to
---

# Article Content
Your article content goes here...
```

### Publishing Specifications
- **Zenn**: `published: true/false` controls publish/draft status
- **Qiita/Dev.to**: `platforms` object controls publishing
- **Images**: Place in `images/` folder and reference with GitHub Raw URLs

## 🤖 How It Works

1. **Article Detection**: GitHub Actions detects new/modified articles in `articles/`
2. **Metadata Parsing**: Extracts Zenn frontmatter and converts for each platform
3. **Content Conversion**: Adjusts content to meet platform-specific requirements
4. **API Publishing**: Creates/updates articles using platform APIs
5. **Sync Management**: Maintains consistency across all platforms

## 📖 Detailed Documentation

### Available Documentation

| Document | Description |
|----------|-------------|
| [SETUP_en.md](docs/SETUP_en.md) | Initial setup guide |
| [WORKFLOW_en.md](docs/WORKFLOW_en.md) | Detailed workflow guide |

### Contents Covered
- Environment setup guide
- Article creation and preview procedures
- Platform selection
- Publishing workflow
- Troubleshooting

## 🛠️ Development

### Local Environment Setup

```bash
# Install dependencies
npm install

# Run conversion scripts locally
npm run convert

# Test publishing (dry run)
npm run publish:dry

# Preview articles
npm run preview:all

# Zenn preview (port 8000)
npm run preview:zenn

# Qiita preview (port 8888)
npm run preview:qiita
```

### Custom Scripts

The `scripts/` directory contains conversion utilities:
- `convert-articles.js` - Converts from Zenn to platform-specific formats
- `publish-articles.js` - Handles API publishing to each platform

## 📚 Reference Documentation

- [Zenn CLI Documentation](https://zenn.dev/zenn/articles/zenn-cli-guide)
- [Qiita CLI Documentation](https://qiita.com/Qiita/items/666e190490d0af90a92b)
- [Qiita API Documentation](https://qiita.com/api/v2/docs)
- [Dev.to API Documentation](https://developers.forem.com/api)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Happy publishing! 🚀**