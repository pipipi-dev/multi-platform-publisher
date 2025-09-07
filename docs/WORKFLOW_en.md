# 📝 Article Publishing Workflow

Complete guide for creating and publishing articles across multiple platforms.

---

## 📋 Prerequisites

Make sure you have completed the initial setup:
- ✅ Repository forked/cloned
- ✅ Required API tokens configured
- ✅ GitHub Actions enabled

> **📖 If not set up**: Refer to [SETUP_en.md](SETUP_en.md) to complete the setup.

---

## Step 1: Article Creation

### Create New Article

Create a new `.md` file in the `articles/` folder:

```markdown
# Filename examples: articles/my-awesome-article.md or articles/YYYYMMDD-my-awesome-article.md
---
title: "Next.js Performance Optimization"
emoji: "⚡"
type: "tech"
topics: ["nextjs", "react", "performance"]
published: false  # Zenn publishing setting (false for draft)

# Multi-platform publishing settings
platforms:
  qiita: true   # Publish to Qiita
  devto: true   # Publish to Dev.to
---

# Next.js Performance Optimization

## Introduction
This article covers...
```

> **📝 Filename Convention**: Date prefix (`YYYYMMDD-`) is optional. Use it if you want easier file management. The system works perfectly with or without date prefixes.

### Image Management

#### Image File Placement
Place images in the `images/` directory. Recommended naming convention:

```bash
# Recommended naming pattern
images/YYYYMMDD-01-description.png
images/YYYYMMDD-02-another-image.jpg
```

#### Image Reference in Articles
Reference images using GitHub Raw URL absolute paths:

```markdown
![Image Description](https://raw.githubusercontent.com/{your-username}/multi-platform-publisher/main/images/filename.png)

*Optional image caption*
```

### Automatic Syntax Conversion

The system automatically converts Zenn-specific syntax for each platform:

#### Message Box Conversion

**Zenn Format (Original Article):**
```markdown
:::message
Notes and information go here
:::

:::message alert
Important warnings go here
:::
```

**Qiita Format (Auto-converted):**
```markdown
:::note warn
Notes and information go here
:::

:::note alert
Important warnings go here
:::
```

> **📝 Writing Note**: Write articles in Zenn format. Platform-specific conversions are handled automatically.

---

## Step 2: Preview

### Preview Articles

#### Zenn Preview
```bash
npx zenn preview
# → Open http://localhost:8000
```

#### Qiita Preview
```bash
# Convert to Qiita format first
npm run convert

# Preview Qiita version (with config file)
npm run preview:qiita
# → Open http://127.0.0.1:8888
```

#### Concurrent Preview (Recommended)
```bash
npm run preview:all
# → Opens both Zenn and Qiita previews simultaneously
```

---

## Step 3: Publishing Process

### Pre-Publishing Checklist
- [ ] Article content finalized
- [ ] Images added to `images/` directory
- [ ] Image paths use absolute format
- [ ] Metadata configured correctly
- [ ] Platform selection specified (if needed)

### Publish Article
```bash
# 1. Stage and commit changes
git add articles/my-awesome-article.md images/
git commit -m "Add article: My Article Title"

# 2. Push to trigger GitHub Actions
git push origin main
```

### GitHub Actions Workflow
1. **Detect Changes**: Scans `articles/` for new/modified files
2. **Filter Published**: Only processes `published: true` articles
3. **Platform Selection**: Respects `platforms` configuration if specified
4. **Convert Metadata**: Transforms Zenn format to platform-specific
5. **API Publishing**: Publishes via platform APIs
6. **Sync Management**: Updates tracking in `config/published-articles.json`

---

## Step 4: Post-Publishing Verification

### Check Workflow Status
```bash
# View GitHub Actions results
open https://github.com/[your-username]/multi-platform-publisher/actions
```

### Verify Published Articles
- **Zenn**: `https://zenn.dev/[username]/articles/[slug]`
- **Qiita**: Check your Qiita dashboard
- **Dev.to**: Check your Dev.to dashboard

### Sync Local Repository
```bash
# Pull GitHub Actions updates to published-articles tracking
git pull origin main

# Check tracking file updates
cat config/published-articles.json
```

---

## 🛠️ Utility Commands

### Article Management
```bash
# List all articles
ls articles/*.md

# Find draft articles
grep -l "published: false" articles/*.md

# Find published articles
grep -l "published: true" articles/*.md

# Find platform-specific articles
grep -l "platforms:" articles/*.md
```

### Development Commands
```bash
# Install dependencies
npm install

# Run all previews
npm run preview:all

# Convert articles (dry run)
npm run convert

# Test all article conversion (development/testing)
node scripts/convert-articles.js --test

# Test publishing (dry run)
npm run publish:dry
```

---

## 🔧 Troubleshooting

### Common Errors and Solutions

#### ❌ Conversion failed

**Cause**: Article frontmatter syntax error
**Solution**: 
```bash
# Check conversion with detailed error output
npm run convert

# Test all article conversion (development/testing)
node scripts/convert-articles.js --test

# Check specific file syntax
npx js-yaml articles/my-article.md
```

#### ❌ Images not displaying

**Cause**: Image path configuration error
**Solution**: 
- Ensure images are in `images/` directory
- Verify GitHub Raw URL absolute paths are used correctly
