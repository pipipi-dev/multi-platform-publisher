/**
 * Dev.to への記事投稿モジュール
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const matter = require('gray-matter');

// Load environment variables from .env.local if it exists
if (fs.existsSync('.env.local')) {
  require('dotenv').config({ path: '.env.local' });
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


module.exports = { publishToDevTo };
