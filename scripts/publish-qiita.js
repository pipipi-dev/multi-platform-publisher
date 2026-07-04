/**
 * Qiita への記事投稿モジュール
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const matter = require('gray-matter');

// Load environment variables from .env.local if it exists
if (fs.existsSync('.env.local')) {
  require('dotenv').config({ path: '.env.local' });
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


module.exports = { publishToQiita };
