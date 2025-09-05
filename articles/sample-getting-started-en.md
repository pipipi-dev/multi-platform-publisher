---
title: "Getting Started with Multi-Platform Publisher"
emoji: "🚀"
type: "tech"
topics: ["zenn", "qiita", "devto", "automation", "githubactions"]
published: false  # Zenn publishing setting

# Multi-platform publishing settings
platforms:
  qiita: false  # Qiita publishing setting
  devto: false  # Dev.to publishing setting
---

## 🎯 Article Overview

**Problems This Article Solves**
- Time-consuming multiple platform publishing
- Platform-specific format conversion burden
- Complex article management workflow

**Target Readers**
- Writers wanting to publish to multiple tech platforms
- Users with basic GitHub Actions knowledge
- Developers seeking efficient publishing workflows

**Prerequisites**
- Basic Git operations
- Markdown syntax fundamentals
- Basic GitHub usage

## 📊 Conclusion & Key Points

**Main Benefits of Multi-Platform Publisher**
- ✅ **Write Once, Publish Everywhere**: Write in Zenn format, publish to 3 platforms
- ✅ **Automatic Format Conversion**: Platform-specific syntax converted automatically
- ✅ **GitHub Actions Integration**: Simple push-to-publish workflow
- ✅ **Flexible Publishing Control**: Platform-specific publish/draft settings

This sample article demonstrates the basic usage of Multi-Platform Publisher with practical steps and examples.

## 💡 What This Tool Can Do

- **Write Once, Publish Everywhere**: Write articles in Zenn format only
- **Auto Conversion**: Automatically convert to each platform's format
- **GitHub Actions Integration**: Automatically publish by just pushing

## 📝 How to Write Articles

### Platform-Specific Publishing Control

```markdown
---
title: "Your Article Title"
emoji: "🚀"
type: "tech"
topics: ["tag1", "tag2", "tag3"]
published: true   # true to publish to Zenn, false to skip
platforms:
  qiita: true     # true to publish to Qiita, false to skip
  devto: false    # true to publish to Dev.to, false to skip
---
```

## 🖼️ Image Management

Place images in the `images/` folder and reference them with absolute paths:

```markdown
![Sample Image](https://raw.githubusercontent.com/pipipi-dev/multi-platform-publisher/main/images/sample.png)
```

## 🔄 Publishing Flow

1. **Create Article**: Create `.md` file in `articles/` folder
2. **Preview Check**: Check locally with `npm run preview:all`
3. **Publish**: Just push to Git for automatic publishing

## 💡 Tips

### About File Names
- Date prefix (`YYYYMMDD-`) is optional
- Use when you want easier management
- Both `my-article.md` and `20250904-my-article.md` work

### Preview Commands
```bash
# Zenn preview (localhost:8000)
npm run preview:zenn

# Qiita preview (127.0.0.1:8888)
npm run preview:qiita

# Both previews simultaneously
npm run preview:all
```

## 🚀 Let's Publish for Real

1. Change `published: false` to `published: true` in this article
2. Commit and push to Git
3. GitHub Actions will run automatically
4. Check your articles on each platform

## 🎯 Summary

By using **Multi-Platform Publisher**, you can expect the following benefits:

✅ **Time Savings**
- Single article creation for 3-platform simultaneous publishing
- Automated format conversion

✅ **Quality Improvement**
- Consistent article quality through unified Markdown syntax
- Pre-publication verification via preview features

✅ **Management Efficiency**
- Version control through Git
- Platform-specific publishing control

### Next Steps
1. Create your own articles using this sample as reference
2. Make preview checking a habit before publishing
3. Build your readership by accumulating published content

**We hope this makes your article publishing life more efficient!**

> **💡 Tip**: Feel free to delete or edit this sample article. Use it as your first article template.