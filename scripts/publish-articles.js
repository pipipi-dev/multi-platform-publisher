/**
 * 記事投稿のオーケストレータ
 *
 * articles/ を走査し、frontmatter の指定に従って各プラットフォームモジュール
 * (publish-qiita / publish-devto / publish-memoreru) へ投稿する。
 * 投稿済み ID は config/published-articles.json に保存する。
 * Zenn は GitHub 連携が articles/ を直接読むため、ここでは投稿処理を行わない。
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { publishToQiita } = require('./publish-qiita');
const { publishToDevTo } = require('./publish-devto');
const { publishToMemoreru } = require('./publish-memoreru');

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

// プラットフォームの定義 (追加するときはここに 1 エントリ足す)
const PLATFORMS = [
  { key: 'qiita', publish: publishToQiita, idKey: 'qiita_id', urlKey: 'qiita_url' },
  { key: 'devto', publish: publishToDevTo, idKey: 'devto_id', urlKey: 'devto_url' },
  { key: 'memoreru', publish: publishToMemoreru, idKey: 'memoreru_id', urlKey: 'memoreru_url' },
];

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

    for (const platform of PLATFORMS) {
      if (!enabledPlatforms.includes(platform.key)) {
        console.log(`⏭️  ${platform.key} 投稿スキップ（プラットフォーム指定外）`);
        continue;
      }
      const result = await platform.publish(article, publishedData);
      if (result) {
        publishedData[article.slug][platform.idKey] = result.id;
        publishedData[article.slug][platform.urlKey] = result.url;
      }
    }

    // Zenn（GitHub連携のため、投稿処理は不要）
    if (article.frontmatter.published) {
      console.log('✅ Zenn: GitHub連携により自動投稿されます');
    }

    // レート制限対策：記事間で少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 投稿データを保存（どのプラットフォームにも投稿実績が無い空エントリは残さない。
  // 下書きが走査対象に入った場合や dry-run で空エントリが書き込まれるのを防ぐ）
  for (const slug of Object.keys(publishedData)) {
    if (Object.keys(publishedData[slug]).length === 0) delete publishedData[slug];
  }
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
  loadPublishedData,
  savePublishedData,
  getPublishedArticles,
  main,
};
