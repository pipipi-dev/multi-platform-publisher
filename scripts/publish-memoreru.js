/**
 * Memoreru (https://memoreru.com) への記事投稿モジュール
 *
 * frontmatter を除いた本文をページとして作成/更新する。
 * 投稿済み ID は config/published-articles.json の memoreru_id で管理する。
 *
 * 環境変数:
 *   MEMORERU_API_TOKEN  Memoreru の API キー (未設定ならスキップ)
 *   MEMORERU_API_URL    省略時 https://memoreru.com
 *   MEMORERU_DRY_RUN=1  リクエストせず送信内容だけ表示
 */
const fs = require('fs');
const axios = require('axios');

// Load environment variables from .env.local if it exists
if (fs.existsSync('.env.local')) {
  require('dotenv').config({ path: '.env.local' });
}

const BASE = (process.env.MEMORERU_API_URL || 'https://memoreru.com').replace(/\/$/, '');
const TOKEN = process.env.MEMORERU_API_TOKEN;
const DRY_RUN = process.env.MEMORERU_DRY_RUN === '1';

async function request(method, apiPath, body) {
  const res = await axios({
    method,
    url: `${BASE}${apiPath}`,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    data: body,
    validateStatus: () => true,
  });
  if (res.status >= 400) {
    throw new Error(`${method} ${apiPath} -> ${res.status}: ${JSON.stringify(res.data).slice(0, 300)}`);
  }
  return res.data;
}

function buildPagePayload({ title, body, emoji }) {
  return {
    content_type: 'page',
    title,
    body: `${body.replace(/\r\n/g, '\n').trim()}\n`,
    scope: 'public',
    language: 'ja', // Zenn 形式の日本語記事を前提とするテンプレートのため固定
    ...(emoji ? { icon: { type: 'emoji', emoji } } : {}),
  };
}

/** 1 記事を作成または更新し、{ id, url } を返す (スキップ時は null)。 */
async function upsertPage(slug, payload, publishedData) {
  const existingId = publishedData[slug] && publishedData[slug].memoreru_id;

  if (DRY_RUN) {
    console.log(`🔎 [dry-run] Memoreru ${existingId ? `PATCH ${existingId}` : 'POST (新規)'}: ${payload.title}`);
    return null;
  }

  if (existingId) {
    await request('PATCH', `/api/contents/pages/${existingId}`, payload);
    console.log(`✅ Memoreru: 更新しました (${payload.title})`);
    return { id: existingId, url: `${BASE}/ja/contents/page/${existingId}` };
  }

  const created = await request('POST', '/api/contents/pages', payload);
  const id = (created && created.data && (created.data.contentId || created.data.id)) || created.contentId;
  if (!id) throw new Error(`Memoreru の作成レスポンスから ID を取得できません: ${JSON.stringify(created).slice(0, 200)}`);
  console.log(`✅ Memoreru: 作成しました (${payload.title})`);
  return { id, url: `${BASE}/ja/contents/page/${id}` };
}

/** 記事を Memoreru へ投稿する (publish-articles.js の main から呼ばれる)。 */
async function publishToMemoreru(article, publishedData) {
  if (!TOKEN && !DRY_RUN) {
    console.log('⏭️  MEMORERU_API_TOKEN が設定されていないため、Memoreruへの投稿をスキップします');
    return null;
  }
  const payload = buildPagePayload({
    title: article.frontmatter.title,
    body: article.content,
    emoji: article.frontmatter.emoji,
  });
  return upsertPage(article.slug, payload, publishedData);
}

module.exports = { publishToMemoreru, upsertPage, buildPagePayload };
