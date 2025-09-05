const fs = require('fs');
const path = require('path');
const axios = require('axios');
const matter = require('gray-matter');

// Load environment variables from .env.local if it exists
if (fs.existsSync('.env.local')) {
  require('dotenv').config({ path: '.env.local' });
}

// 記事データを保存するためのJSONファイル
const ARTICLE_DATA_FILE = path.join(process.cwd(), 'config', 'published-articles.json');

// 公開済み記事データの読み込み
function loadPublishedData() {
  if (fs.existsSync(ARTICLE_DATA_FILE)) {
    return JSON.parse(fs.readFileSync(ARTICLE_DATA_FILE, 'utf8'));
  }
  return {};
}

// 公開済み記事データの保存
function savePublishedData(data) {
  const configDir = path.dirname(ARTICLE_DATA_FILE);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.writeFileSync(ARTICLE_DATA_FILE, JSON.stringify(data, null, 2));
}

// Qiitaに投稿
async function publishToQiita(article, publishedData) {
  if (!process.env.QIITA_API_TOKEN || process.env.QIITA_API_TOKEN.trim() === '') {
    console.log('⏭️  QIITA_API_TOKEN が設定されていないため、Qiitaへの投稿をスキップします');
    return null;
  }

  const qiitaPath = path.join(process.cwd(), 'qiita', 'public', `${article.slug}.md`);
  if (!fs.existsSync(qiitaPath)) {
    console.log(`⏭️  Qiitaファイルが存在しません: ${qiitaPath}`);
    return null;
  }

  const qiitaContent = fs.readFileSync(qiitaPath, 'utf8');
  const parsed = matter(qiitaContent);
  
  try {
    const existingId = publishedData[article.slug]?.qiita_id;
    
    if (existingId) {
      // 既存記事を更新
      console.log(`🔄 Qiita記事更新中: ${article.slug}`);
      const response = await axios.patch(
        `https://qiita.com/api/v2/items/${existingId}`,
        {
          title: parsed.data.title,
          body: parsed.content,
          tags: parsed.data.tags.map(tag => ({ name: tag })),
          private: parsed.data.private || false
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.QIITA_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ Qiita記事更新成功: ${response.data.url}`);
      return { id: response.data.id, url: response.data.url };
      
    } else {
      // 新規記事作成
      console.log(`📝 Qiita新規記事投稿中: ${article.slug}`);
      const response = await axios.post(
        'https://qiita.com/api/v2/items',
        {
          title: parsed.data.title,
          body: parsed.content,
          tags: parsed.data.tags.map(tag => ({ name: tag })),
          private: parsed.data.private || false
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.QIITA_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ Qiita記事投稿成功: ${response.data.url}`);
      return { id: response.data.id, url: response.data.url };
    }
    
  } catch (error) {
    console.error(`❌ Qiita投稿エラー (${article.slug}):`);
    console.error('  Status:', error.response?.status);
    console.error('  Headers:', error.response?.headers);
    console.error('  Data:', error.response?.data || error.message);
    console.error('  Config:', error.config ? {
      url: error.config.url,
      method: error.config.method,
      headers: error.config.headers
    } : 'No config');
    return null;
  }
}

// Dev.toに投稿
async function publishToDevTo(article, publishedData) {
  if (!process.env.DEV_TO_API_KEY || process.env.DEV_TO_API_KEY.trim() === '') {
    console.log('⏭️  DEV_TO_API_KEY が設定されていないため、Dev.toへの投稿をスキップします');
    return null;
  }

  const devtoPath = path.join(process.cwd(), 'dev-to', `${article.slug}.md`);
  if (!fs.existsSync(devtoPath)) {
    console.log(`⏭️  Dev.toファイルが存在しません: ${devtoPath}`);
    return null;
  }

  const devtoContent = fs.readFileSync(devtoPath, 'utf8');
  const parsed = matter(devtoContent);
  
  try {
    const existingId = publishedData[article.slug]?.devto_id;
    
    if (existingId) {
      // 既存記事を更新
      console.log(`🔄 Dev.to記事更新中: ${article.slug}`);
      const response = await axios.put(
        `https://dev.to/api/articles/${existingId}`,
        {
          article: {
            title: parsed.data.title,
            body_markdown: parsed.content,
            published: parsed.data.published || true,
            tags: parsed.data.tags ? parsed.data.tags.split(', ') : [],
            description: parsed.data.description
          }
        },
        {
          headers: {
            'api-key': process.env.DEV_TO_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ Dev.to記事更新成功: ${response.data.url}`);
      return { id: response.data.id, url: response.data.url };
      
    } else {
      // 新規記事作成
      console.log(`📝 Dev.to新規記事投稿中: ${article.slug}`);
      const response = await axios.post(
        'https://dev.to/api/articles',
        {
          article: {
            title: parsed.data.title,
            body_markdown: parsed.content,
            published: parsed.data.published || true,
            tags: parsed.data.tags ? parsed.data.tags.split(', ') : [],
            description: parsed.data.description
          }
        },
        {
          headers: {
            'api-key': process.env.DEV_TO_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ Dev.to記事投稿成功: ${response.data.url}`);
      return { id: response.data.id, url: response.data.url };
    }
    
  } catch (error) {
    console.error(`❌ Dev.to投稿エラー (${article.slug}):`, error.response?.data || error.message);
    return null;
  }
}

// 公開記事の取得
function getPublishedArticles() {
  const articlesDir = path.join(process.cwd(), 'articles');
  const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));
  
  return files.map(file => {
    const filePath = path.join(articlesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);
    
    return {
      filename: file,
      slug: file.replace('.md', ''),
      frontmatter: parsed.data,
      content: parsed.content
    };
  }).filter(article => {
    // published: true の記事、または platforms オブジェクトで true になっている記事を処理対象とする
    const hasPlatformEnabled = article.frontmatter.platforms && 
      typeof article.frontmatter.platforms === 'object' &&
      Object.values(article.frontmatter.platforms).some(enabled => enabled === true);
    
    return article.frontmatter.published || hasPlatformEnabled;
  });
}

// メイン実行
async function main() {
  console.log('🚀 記事投稿を開始...');
  
  const articles = getPublishedArticles();
  const publishedData = loadPublishedData();
  
  console.log(`📝 ${articles.length}件の公開記事を検出`);
  
  for (const article of articles) {
    console.log(`\n📄 処理中: ${article.filename}`);
    
    // プラットフォーム選択の確認
    const platforms = article.frontmatter.platforms || { qiita: true, devto: true };
    const enabledPlatforms = Object.keys(platforms).filter(key => platforms[key]);
    
    // プラットフォーム表示（Zennは別途published判定）
    const platformsDisplay = [];
    if (article.frontmatter.published) platformsDisplay.push('zenn');
    platformsDisplay.push(...enabledPlatforms);
    console.log(`🎯 対象プラットフォーム: ${platformsDisplay.join(', ')}`);
    
    if (!publishedData[article.slug]) {
      publishedData[article.slug] = {};
    }
    
    // Qiita投稿
    if (enabledPlatforms.includes('qiita')) {
      const qiitaResult = await publishToQiita(article, publishedData);
      if (qiitaResult) {
        publishedData[article.slug].qiita_id = qiitaResult.id;
        publishedData[article.slug].qiita_url = qiitaResult.url;
      }
    } else {
      console.log('⏭️  Qiita投稿スキップ（プラットフォーム指定外）');
    }
    
    // Dev.to投稿
    if (enabledPlatforms.includes('devto')) {
      const devtoResult = await publishToDevTo(article, publishedData);
      if (devtoResult) {
        publishedData[article.slug].devto_id = devtoResult.id;
        publishedData[article.slug].devto_url = devtoResult.url;
      }
    } else {
      console.log('⏭️  Dev.to投稿スキップ（プラットフォーム指定外）');
    }
    
    // Zenn（GitHub連携のため、投稿処理は不要）
    if (article.frontmatter.published) {
      console.log('✅ Zenn: GitHub連携により自動投稿されます');
    }
    
    // レート制限対策：記事間で少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 投稿データを保存
  savePublishedData(publishedData);
  
  console.log('\n🎉 投稿処理完了!');
  console.log('📊 結果はconfig/published-articles.jsonに保存されました');
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ 投稿処理でエラーが発生:', error);
    process.exit(1);
  });
}

module.exports = {
  publishToQiita,
  publishToDevTo,
  getPublishedArticles
};