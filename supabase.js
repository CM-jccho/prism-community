/* ==========================================================================
   PRISM — Supabase (무료 플랜) 커뮤니티 백엔드
   - CONFIG 에 프로젝트 URL 과 anon(publishable) 키를 넣으면 자동으로 켜집니다.
     값이 비어 있으면 요청을 한 번도 보내지 않고 기존 로컬 데모 그대로 동작합니다.
   - 빌드 도구 없이 REST(fetch)만 사용합니다. React/번들러 불필요.
   - 테이블: prism_posts / prism_comments  (supabase/schema.sql)
   ========================================================================== */
(() => {
  'use strict';

  const CONFIG = window.PRISM_SUPABASE || {
    url: '',       // 예: https://abcdefghijklm.supabase.co
    anonKey: ''    // 예: eyJhbGciOi...  (anon public key / publishable key)
  };

  const POSTS = 'prism_posts';
  const COMMENTS = 'prism_comments';
  const TABLE_URL = () => CONFIG.url.replace(/\/$/, '') + '/rest/v1/';
  const PLACEHOLDER = {
    image: 'images/art-neon-city.svg',
    app: 'images/art-app-ui.svg',
    video: 'images/art-film.svg',
    automation: 'images/art-automation.svg'
  };
  const TOOL_IDS = ['claude', 'chatgpt', 'midjourney', 'sora', 'kling', 'cursor', 'runway', 'suno', 'n8n', 'etc'];
  const CAT_IDS = ['image', 'app', 'video', 'automation'];

  const ready = () => !!(CONFIG.url && CONFIG.anonKey);

  function headers(extra) {
    return {
      apikey: CONFIG.anonKey,
      Authorization: 'Bearer ' + CONFIG.anonKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(extra || {})
    };
  }

  async function request(path, opts = {}) {
    if (!ready()) throw new Error('supabase-not-configured');
    const res = await fetch(TABLE_URL() + path, {
      ...opts,
      headers: headers(opts.headers)
    });
    if (!res.ok) {
      let detail = '';
      try { detail = await res.text(); } catch (e) { /* ignore */ }
      throw new Error('supabase ' + res.status + ' ' + detail.slice(0, 160));
    }
    if (res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  function hueOf(str) {
    let h = 0;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
    return h;
  }

  function handleOf(nick, given) {
    if (given) return given.startsWith('@') ? given : '@' + given;
    const base = String(nick || 'guest').replace(/[^0-9A-Za-z가-힣_]/g, '').slice(0, 12).toLowerCase();
    return '@' + (base || 'guest');
  }

  function toolId(value) {
    const v = String(value || '').toLowerCase();
    if (TOOL_IDS.includes(v)) return v;
    const hit = TOOL_IDS.find((id) => v.includes(id));
    return hit || 'etc';
  }

  /* DB row → 앱의 글 객체 */
  function toPost(row) {
    const cat = CAT_IDS.includes(row.category) ? row.category : 'image';
    return {
      id: 'sb_' + row.id,
      remoteId: row.id,
      remote: true,
      mine: false,
      author: { nick: row.nickname, handle: handleOf(row.nickname, row.handle), level: 1, hue: hueOf(row.nickname) },
      promptPublic: true,
      copies: 0,
      cheers: { fire: Number(row.likes) || 0, bulb: 0, clap: 0 },
      me: {},
      bookmarked: false,
      votes: 0,
      voted: false,
      picked: false,
      comments: [],
      tags: Array.isArray(row.tags) ? row.tags : [],
      title: row.title,
      desc: row.description || '',
      prompt: row.prompt,
      tool: toolId(row.tool),
      category: cat,
      image: row.image_url || PLACEHOLDER[cat],
      views: null,
      createdAt: Date.parse(row.created_at) || Date.now()
    };
  }

  /* DB row → 앱의 댓글 객체 */
  function toComment(row) {
    return {
      id: 'sbc_' + row.id,
      remoteId: row.id,
      remote: true,
      mine: false,
      author: { nick: row.nickname, handle: handleOf(row.nickname), level: 1, hue: hueOf(row.nickname) },
      text: row.body,
      type: row.kind === 'suggestion' ? 'suggestion' : 'general',
      createdAt: Date.parse(row.created_at) || Date.now(),
      likes: Number(row.likes) || 0,
      liked: false,
      replies: []
    };
  }

  /* 앱의 글 객체 → DB row (이미지는 400KB 이하 data URL/외부 URL 만) */
  function toRow(post) {
    const img = typeof post.image === 'string' && post.image.length && post.image.length <= 400000 ? post.image : null;
    return {
      title: String(post.title || '').slice(0, 120),
      description: String(post.desc || '').slice(0, 600),
      prompt: String(post.prompt || '').slice(0, 4000),
      tool: toolId(post.tool),
      category: CAT_IDS.includes(post.category) ? post.category : 'image',
      tags: Array.isArray(post.tags) ? post.tags.slice(0, 8) : [],
      image_url: img,
      nickname: String((post.author && post.author.nick) || 'guest').slice(0, 24),
      handle: String((post.author && post.author.handle) || '').slice(0, 40) || null
    };
  }

  /* ---------------------------------------------------------------- API */
  async function listPosts(limit = 60) {
    const rows = await request(`${POSTS}?select=*&order=created_at.desc&limit=${limit}`);
    return (rows || []).map(toPost);
  }

  async function insertPost(post) {
    const rows = await request(POSTS, {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(toRow(post))
    });
    return rows && rows[0] ? toPost(rows[0]) : null;
  }

  async function listComments(postId, limit = 200) {
    const rows = await request(`${COMMENTS}?select=*&post_id=eq.${encodeURIComponent(postId)}&order=created_at.asc&limit=${limit}`);
    return (rows || []).map(toComment);
  }

  async function insertComment(postId, nickname, body, kind = 'general') {
    const rows = await request(COMMENTS, {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        post_id: postId,
        nickname: String(nickname || 'guest').slice(0, 24),
        body: String(body || '').slice(0, 800),
        kind: kind === 'suggestion' ? 'suggestion' : 'general'
      })
    });
    return rows && rows[0] ? toComment(rows[0]) : null;
  }

  async function likePost(postId) {
    return request('rpc/prism_like_post', { method: 'POST', body: JSON.stringify({ p_post: postId }) });
  }

  async function likeComment(commentId) {
    return request('rpc/prism_like_comment', { method: 'POST', body: JSON.stringify({ p_comment: commentId }) });
  }

  window.PRISM_SB = { ready, config: CONFIG, listPosts, insertPost, listComments, insertComment, likePost, likeComment };
})();
