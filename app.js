/* ==========================================================================
   PRISM — AI 창작 · 프롬프트 커뮤니티 (demo)
   Vanilla JS · localStorage persistence · zero network requests
   KO / EN / ZH / JA via i18n.js · sample content in content.js
   ========================================================================== */
(() => {
  'use strict';

  const I18N = window.PRISM_I18N;
  const SEED = window.PRISM_SEED_DATA;
  const t = (k, v) => I18N.t(k, v);
  const nf = (n) => I18N.nf(n);
  const timeAgo = (ts) => I18N.timeAgo(ts);
  const L = () => I18N.getLang();
  const pickText = (obj) => (obj ? (obj[L()] || obj.ko) : null);
  const cnt = (key, n, vars) => t(key + (Number(n) === 1 ? '.one' : ''), Object.assign({ n }, vars || {}));
  const krw = (n) => (L() === 'ko' ? Number(n).toLocaleString('ko-KR') + '원' : '₩' + Number(n).toLocaleString('en-US'));

  /* ---------------------------------------------------------------- constants */
  const KEY = 'prism.demo.v2';
  const ART = [
    'images/art-neon-city.svg', 'images/art-app-ui.svg', 'images/art-film.svg',
    'images/art-automation.svg', 'images/art-botanical.svg', 'images/art-storybook.svg',
    'images/art-brand.svg', 'images/art-shapes.svg', 'images/art-audio.svg',
    'images/art-nebula.svg', 'images/art-poster.svg', 'images/art-portrait.svg'
  ];

  /* English level names are the brand; label/short/desc come from the dictionary. */
  const LEVELS = {
    1: { id: 1, name: 'Seed', emoji: '', color: '#34D399' },
    2: { id: 2, name: 'Builder', emoji: '', color: '#60A5FA' },
    3: { id: 3, name: 'Master', emoji: '', color: '#FBBF24' },
    4: { id: 4, name: 'Curator', emoji: '', color: '#C084FC' }
  };

  const PERMS = {
    1: { prompt: false, copy: false, upload: false, suggestion: false, remix: false, vote: false, pick: false, challenge: false },
    2: { prompt: true, copy: true, upload: true, suggestion: true, remix: false, vote: false, pick: false, challenge: false },
    3: { prompt: true, copy: true, upload: true, suggestion: true, remix: true, vote: true, pick: false, challenge: false },
    4: { prompt: true, copy: true, upload: true, suggestion: true, remix: true, vote: true, pick: true, challenge: true }
  };

  const TOOLS = [
    { id: 'claude', name: 'Claude', color: '#D97757', mark: 'C' },
    { id: 'chatgpt', name: 'ChatGPT', color: '#10A37F', mark: 'G' },
    { id: 'midjourney', name: 'Midjourney', color: '#A78BFA', mark: 'M' },
    { id: 'sora', name: 'Sora', color: '#E2E8F0', mark: 'S' },
    { id: 'kling', name: 'Kling', color: '#38BDF8', mark: 'K' },
    { id: 'cursor', name: 'Cursor', color: '#93C5FD', mark: 'Cu' },
    { id: 'runway', name: 'Runway', color: '#5EEAD4', mark: 'R' },
    { id: 'suno', name: 'Suno', color: '#F472B6', mark: 'Su' },
    { id: 'n8n', name: 'n8n', color: '#FCA5A5', mark: 'n' },
    { id: 'etc', name: 'etc', color: '#94A3B8', mark: '+', i18n: 'tool.etc' }
  ];

  const CATS = [
    { id: 'image', emoji: '' },
    { id: 'app', emoji: '' },
    { id: 'video', emoji: '' },
    { id: 'automation', emoji: '' }
  ];

  const BENEFITS = [
    { key: 'view', icon: '', min: 1 },
    { key: 'comment', icon: '', min: 1 },
    { key: 'promptView', icon: '', min: 2 },
    { key: 'copy', icon: '', min: 2 },
    { key: 'suggest', icon: '', min: 2 },
    { key: 'upload', icon: '', min: 2 },
    { key: 'remix', icon: '', min: 3 },
    { key: 'vote', icon: '', min: 3 },
    { key: 'pick', icon: '', min: 4 },
    { key: 'challenge', icon: '', min: 4 }
  ];

  const EXPLORE_TAG_KEYS = ['glass', 'neon', 'poster', 'desert', 'flowly', 'news', 'icons3d', 'aura', 'storybook'];

  /* Real products the maker sells — links point to the external store (latpeed). */
  const SHOP = [
    {
      id: 'moa-hive',
      img: 'images/shop-moa-hive.svg',
      url: 'https://www.latpeed.com/products/VTtxq',
      freeUrl: 'https://cm-jccho.github.io/moa-hive/',
      price: 9900, list: 29000, pro: true
    },
    {
      id: 'cast-iron',
      img: 'images/shop-cast-iron.svg',
      url: 'https://www.latpeed.com/products/8q7nI',
      freeUrl: '',
      price: 4900, list: 9900, pro: false
    }
  ];
  const shopOff = (x) => Math.round((1 - x.price / x.list) * 100);

  /* ---------------------------------------------------------------- utils */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const toolOf = (id) => TOOLS.find((x) => x.id === id) || TOOLS[TOOLS.length - 1];
  const catOf = (id) => CATS.find((c) => c.id === id) || CATS[0];
  const toolName = (x) => (x && x.i18n ? t(x.i18n) : (x ? x.name : ''));
  const catName = (c) => t('cat.' + c.id);
  const lvOf = (n) => {
    const l = LEVELS[clamp(Number(n) || 1, 1, 4)];
    return {
      ...l,
      label: t('level.' + l.id + '.name'),
      short: t('level.' + l.id + '.short'),
      desc: t('level.' + l.id + '.desc'),
      req: t('level.' + l.id + '.req')
    };
  };

  function hashHue(str) {
    let h = 0;
    for (let i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) % 360;
    return h;
  }

  /* ---------------------------------------------------------------- localized content access */
  function nickOf(a) {
    if (!a) return '?';
    if (a.nickKey && SEED.authors[a.nickKey]) {
      const src = SEED.authors[a.nickKey];
      return src[L()] || src.ko;
    }
    return a.nick || '?';
  }
  function pText(p) {
    const x = p.texts ? pickText(p.texts) : null;
    return { title: x && x.title ? x.title : p.title, desc: x && x.desc ? x.desc : p.desc, tags: (x && x.tags) || p.tags || [] };
  }
  const pTitle = (p) => pText(p).title;
  const pDesc = (p) => pText(p).desc;
  const pTags = (p) => pText(p).tags;
  function cmText(cm) {
    const x = cm.texts ? pickText(cm.texts) : null;
    return x || cm.text;
  }
  function challengeOf() {
    const c = state.challenge;
    const x = c.texts ? pickText(c.texts) : null;
    return {
      title: (x && x.title) || c.title || '',
      sub: x ? (x.sub || '') : (c.en || ''),
      desc: (x && x.desc) || c.desc || '',
      tag: (x && x.tag) || c.tag || ''
    };
  }

  function saveNow() {
    if (window.__prismNoSave) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      if (!saveNow.warned) {
        saveNow.warned = true;
        toast(t('toast.storage'), '', 'danger');
      }
    }
  }
  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 120);
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.v !== 2 || !Array.isArray(parsed.posts)) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  /* ---------------------------------------------------------------- seed */
  function seedState() {
    const now = Date.now();
    const authorOf = (k) => {
      const a = SEED.authors[k];
      return { nickKey: k, nick: a.ko, handle: a.handle, level: a.level, hue: a.hue };
    };
    const mkComment = (cm) => ({
      id: uid(), author: authorOf(cm.author), text: cm.texts.ko, texts: cm.texts,
      type: cm.type || 'general', createdAt: now - (cm.h ?? 2) * 3600e3,
      likes: cm.likes || 0, liked: false,
      replies: (cm.replies || []).map((r) => ({
        id: uid(), author: authorOf(r.author), text: r.texts.ko, texts: r.texts,
        createdAt: now - (r.h ?? 1) * 3600e3
      }))
    });

    const posts = SEED.posts.map((src) => {
      const ko = src.texts.ko;
      return {
        id: 'p_' + uid(), key: src.key, author: authorOf(src.author), mine: false, promptPublic: true,
        copies: src.copies || 0, cheers: { ...src.cheers }, me: {}, bookmarked: false,
        votes: src.votes || 0, voted: false, picked: !!src.picked,
        comments: (src.comments || []).map(mkComment),
        tags: ko.tags.slice(), title: ko.title, desc: ko.desc, texts: src.texts,
        views: src.views ?? null, createdAt: now - src.h * 3600e3,
        tool: src.tool, category: src.category, image: src.image, prompt: src.prompt
      };
    });

    return {
      v: 2,
      onboarded: false,
      user: {
        nickname: '', handle: '', level: 1, demoLevel: null, joined: Date.now(),
        interests: [], hue: 158, commentsMade: 0, reactionsGiven: 0, votesMade: 0,
        notificationsOn: true
      },
      posts,
      challenge: {
        id: 'ch_1', texts: SEED.challenge.texts, tag: SEED.challenge.texts.ko.tag,
        endAt: Date.now() + SEED.challenge.endsInDays * 86400e3,
        participants: SEED.challenge.participants, createdBy: 'q'
      },
      follows: [],
      notifications: SEED.notifications.map((n) => ({
        id: uid(), icon: n.icon, at: Date.now() - n.minutesAgo * 60e3, read: n.read, texts: n.texts
      })),
      ui: { tab: 'feed', filter: 'all', query: '', sort: 'new' }
    };
  }

  /* ---------------------------------------------------------------- state */
  let state = load();
  if (!state) state = seedState();

  const ui = {
    detailId: null, replyTo: null, commentType: 'general', draft: '',
    upload: { title: '', desc: '', prompt: '', tool: '', category: 'image', image: '', promptPublic: true, tags: '' },
    challengeForm: false, resetArmed: false
  };
  let obTools = new Set();

  /* ---------------------------------------------------------------- derived */
  const myPosts = () => state.posts.filter((p) => p.mine);
  const currentLevel = () => Number(state.user.demoLevel || earnedLevel());
  const isDemo = () => !!state.user.demoLevel;

  function earnedLevel() {
    const s = stats();
    if (s.upvotes >= 30) return 3;
    if (s.prompts >= 3) return 2;
    return 1;
  }

  function stats() {
    const mine = myPosts();
    const upvotes = mine.reduce((a, p) => a + p.cheers.fire + p.cheers.bulb + p.cheers.clap + p.votes, 0);
    return {
      prompts: mine.length,
      upvotes,
      comments: state.user.commentsMade || 0,
      reactions: state.user.reactionsGiven || 0,
      bookmarks: state.posts.filter((p) => p.bookmarked).length,
      votesMade: state.user.votesMade || 0
    };
  }

  function xp() {
    const s = stats();
    return s.prompts * 120 + s.upvotes * 20 + s.comments * 20 + s.reactions * 3 + s.votesMade * 30;
  }

  function levelProgress() {
    const lv = currentLevel();
    const s = stats();
    if (lv === 1) return { pct: clamp((s.prompts / 3) * 100, 0, 100), label: t('prog.lv1.label', { n: s.prompts }), next: t('prog.lv1.next'), hint: t('prog.lv1.hint') };
    if (lv === 2) return { pct: clamp((s.upvotes / 30) * 100, 0, 100), label: t('prog.lv2.label', { n: nf(s.upvotes) }), next: t('prog.lv2.next'), hint: t('prog.lv2.hint') };
    if (lv === 3) return { pct: 100, label: t('prog.lv3.label'), next: t('prog.lv3.next'), hint: t('prog.lv3.hint') };
    return { pct: 100, label: t('prog.lv4.label'), next: t('prog.lv4.next'), hint: t('prog.lv4.hint') };
  }

  const isPro = () => !!state.user.proPass;
  const can = (k) => (isPro() && (k === 'prompt' || k === 'copy')) || !!PERMS[currentLevel()][k];

  function lvBadge(level, extra = '') {
    const l = lvOf(level);
    return `<span class="badge lv${l.id} ${extra}"><span class="b-emoji">${l.emoji}</span>Lv.${l.id} ${l.name}</span>`;
  }

  function avatar(a, cls = '') {
    const nick = nickOf(a);
    const hue = a?.hue ?? hashHue(nick);
    return `<span class="avatar ${cls} ${a?.me ? 'me' : ''}" style="--h:${hue}">${esc(nick.slice(0, 1))}</span>`;
  }

  function meAuthor() {
    return { nick: state.user.nickname || t('common.me'), handle: state.user.handle || '@me', level: currentLevel(), hue: state.user.hue, me: true };
  }

  /* ---------------------------------------------------------------- init */
  function init() {
    applyStatic();
    mountShells();
    bindEvents();
    renderAll();
    loadDailyFeed();
    syncRemotePosts();
    if (!state.onboarded) showOnboarding();
    else hideOnboarding();
  }

  function applyStatic() {
    document.documentElement.lang = I18N.meta().htmlLang;
    document.title = t('app.title');
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', t('app.desc'));
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    renderLangBtn();
  }

  function mountShells() {
    $('#feed-root').innerHTML = `
      <div class="feed-hero" id="feed-hero"></div><div id="feed-challenge"></div><div id="feed-promo"></div><div id="feed-daily"></div><div class="feed-toolbar"><div class="search" role="search"><svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4.2 4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><input id="feed-search" type="search" placeholder="${esc(t('feed.searchPh'))}" autocomplete="off" aria-label="${esc(t('aria.feedSearch'))}"><button class="clear" data-act="clear-search" aria-label="${esc(t('aria.clearSearch'))}" hidden></button></div><div class="chips" id="feed-chips" role="tablist" aria-label="${esc(t('aria.catFilter'))}"></div><div class="feed-tools"><span class="feed-count" id="feed-count"></span><div class="sort-toggle" id="feed-sort" aria-label="${esc(t('aria.sort'))}"><button data-act="sort" data-s="new">${esc(t('sort.new'))}</button><button data-act="sort" data-s="pop">${esc(t('sort.pop'))}</button></div></div></div><div id="feed-list"></div>`;

    $('#explore-root').innerHTML = `
      <div class="page-head"><span class="eyebrow">EXPLORE</span><h2>${esc(t('explore.head'))}</h2><p>${esc(t('explore.sub'))}</p></div><div class="search" role="search"><svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4.2 4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><input id="explore-search" type="search" placeholder="${esc(t('explore.searchPh'))}" autocomplete="off" aria-label="${esc(t('aria.exploreSearch'))}"><button class="clear" data-act="clear-search" aria-label="${esc(t('aria.clearSearch'))}" hidden></button></div><div id="explore-results" hidden></div><div id="explore-main"></div>`;

    $('#ranks-root').innerHTML = '<div id="ranks-inner"></div>';
    $('#my-root').innerHTML = '<div id="my-inner"></div>';
    $('#desk-levels').innerHTML = [1, 2, 3, 4].map((n) => {
      const l = lvOf(n);
      return `<div class="row">${lvBadge(n)}<span>${esc(l.short)}</span></div>`;
    }).join('');
  }

  /* ------------------------------------------------- daily feed (매일 자동 업데이트)
     data/community-feed.json 은 GitHub Actions(scripts/update_feed.py)가 매일
     공개 소스(Hugging Face · GitHub · Hacker News)에서 모아 커밋한다.
     배포본은 저장소의 최신 파일을 읽고, 실패하면 배포 시 포함된 같은 파일로 돌아간다. */
  const DAILY_FEED_URLS = [
    'https://raw.githubusercontent.com/CM-jccho/prism-community/main/data/community-feed.json',
    'data/community-feed.json'
  ];
  const DAILY_KINDS = ['model', 'tool', 'prompt', 'art', 'news'];
  let dailyFeed = null;
  let dailyFeedState = 'idle'; // idle | loading | ready | failed
  let dailyOpen = false;

  function dailyKindLabel(kind) {
    const key = 'daily.kind.' + (DAILY_KINDS.includes(kind) ? kind : 'news');
    const v = t(key);
    return v === key ? kind : v;
  }

  function dailyDate(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
  }

  async function loadDailyFeed() {
    if (dailyFeedState === 'loading' || dailyFeedState === 'ready') return;
    dailyFeedState = 'loading';
    for (const url of DAILY_FEED_URLS) {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) continue;
        const data = await res.json();
        if (!data || !Array.isArray(data.items) || !data.items.length) continue;
        dailyFeed = data;
        dailyFeedState = 'ready';
        renderDailyFeed();
        return;
      } catch (e) { /* 다음 주소 시도 */ }
    }
    dailyFeedState = 'failed';
    renderDailyFeed();
  }

  function dailyItems() {
    if (!dailyFeed || !Array.isArray(dailyFeed.items)) return [];
    return dailyFeed.items.filter((it) => it && it.title && it.url);
  }

  /* 종류별로 번갈리며 골라 첫 화면에 모델·작품·소식이 섞이게 한다. */
  function dailyPick(items, limit) {
    const buckets = {};
    items.forEach((it) => {
      const k = DAILY_KINDS.includes(it.kind) ? it.kind : 'news';
      (buckets[k] = buckets[k] || []).push(it);
    });
    const out = [];
    for (let round = 0; out.length < limit; round += 1) {
      let added = false;
      for (const k of DAILY_KINDS) {
        const b = buckets[k];
        if (b && b[round]) {
          out.push(b[round]);
          added = true;
          if (out.length >= limit) break;
        }
      }
      if (!added) break;
    }
    return out;
  }

  function renderDailyFeed() {
    const root = $('#feed-daily');
    if (!root) return;
    const all = dailyItems();
    if (!all.length) { root.innerHTML = ''; return; }
    const shown = dailyPick(all, dailyOpen ? 18 : 6);
    const updated = dailyDate(dailyFeed.updatedAt);
    root.innerHTML = `
      <section class="daily" aria-label="${esc(t('daily.title'))}"><header class="daily-head"><span class="daily-tag"><span class="pulse"></span>${esc(t('daily.tag'))}</span><strong>${esc(t('daily.title'))}</strong>${updated ? `<span class="daily-upd">${esc(t('daily.updated', { date: updated }))}</span>` : ''}
        </header><p class="daily-sub">${esc(t('daily.sub'))}</p><ul class="daily-list">${shown.map((it) => `
            <li class="daily-item"><a href="${esc(it.url)}" target="_blank" rel="noopener noreferrer"><span class="daily-kind k-${esc(it.kind || 'news')}">${esc(dailyKindLabel(it.kind))}</span><span class="daily-body"><b>${esc(it.title)}</b>${it.desc ? `<span>${esc(it.desc)}</span>` : ''}
                </span><span class="daily-meta">${esc(it.source || '')}${dailyDate(it.publishedAt) ? ` · ${dailyDate(it.publishedAt)}` : ''}</span></a></li>`).join('')}
        </ul>${all.length > 6 ? `<button class="daily-more" type="button" data-act="daily-more">${esc(dailyOpen ? t('daily.less') : t('daily.more', { n: Math.min(all.length, 18) }))}</button>` : ''}
      </section>`;
  }

  /* --------------------------------------------- Supabase 연동(실제 방문자 공유)
     supabase.js 의 PRISM_SB 가 설정되어 있을 때만 동작한다.
     주소·anon 키가 비어 있으면 아래 함수는 전부 즉시 빠지고 로컬 상태 그대로 남는다. */
  const sb = () => (window.PRISM_SB && window.PRISM_SB.ready() ? window.PRISM_SB : null);

  async function syncRemotePosts() {
    const api = sb();
    if (!api) return;
    try {
      const rows = await api.listPosts(60);
      if (!rows || !rows.length) return;
      const seen = new Set(state.posts.map((p) => p.id));
      const fresh = rows.filter((p) => p && p.id && !seen.has(p.id));
      if (!fresh.length) return;
      state.posts = fresh.concat(state.posts);
      renderFeed();
      renderExplore();
      renderRanks();
      renderMy();
    } catch (e) {
      console.warn('[PRISM] 서버의 글을 불러오지 못했습니다', e);
    }
  }

  async function syncRemoteComments(p) {
    const api = sb();
    if (!api || !p || !p.remoteId) return;
    try {
      p.comments = await api.listComments(p.remoteId);
      if (ui.detailId === p.id) refreshDetail();
    } catch (e) {
      console.warn('[PRISM] 서버의 댓글을 불러오지 못했습니다', e);
    }
  }

  function pushRemotePost(post) {
    const api = sb();
    if (!api) return;
    api.insertPost(post).then((row) => {
      if (!row) return;
      post.remoteId = row.remoteId;
      save();
    }).catch((e) => {
      console.warn('[PRISM] 글을 서버에 올리지 못했습니다', e);
      toast(t('toast.sbFail'), '', 'danger');
    });
  }

  function pushRemoteComment(p, cm, text, type) {
    const api = sb();
    if (!api || !p.remoteId) return;
    api.insertComment(p.remoteId, (cm.author && cm.author.nick) || 'guest', text, type).then((row) => {
      if (row) cm.remoteId = row.remoteId;
    }).catch((e) => {
      console.warn('[PRISM] 댓글을 서버에 올리지 못했습니다', e);
      toast(t('toast.sbFail'), '', 'danger');
    });
  }

  function pushRemoteLike(postId) {
    const api = sb();
    if (!api) return;
    api.likePost(postId).catch((e) => console.warn('[PRISM] 좋아요를 서버에 반영하지 못했습니다', e));
  }

  /* ---------------------------------------------------------------- renders */
  function renderAll() {
    renderTopbar();
    renderFeed();
    renderExplore();
    renderMarket();
    renderRanks();
    renderMy();
  }

  function renderLangBtn() {
    const meta = I18N.meta();
    const code = $('#lang-code');
    if (code) code.textContent = meta.short;
    const btn = $('#lang-btn');
    if (btn) btn.setAttribute('aria-label', t('aria.lang'));
    $$('#lang-menu .lang-opt').forEach((o) => {
      const on = o.dataset.lang === meta.code;
      o.classList.toggle('is-on', on);
      o.setAttribute('aria-selected', String(on));
    });
    $$('.ob-lang').forEach((o) => {
      const on = o.dataset.oblang === meta.code;
      o.classList.toggle('is-on', on);
      o.setAttribute('aria-pressed', String(on));
    });
  }

  function renderTopbar() {
    const nick = state.user.nickname || '·';
    const el = $('#top-avatar-txt');
    if (el) el.textContent = nick.slice(0, 1);
    const av = $('.top-avatar');
    if (av) av.style.setProperty('--h', state.user.hue || 158);
    const hasUnread = state.notifications.some((n) => !n.read);
    $('#bell-btn').classList.toggle('has-dot', hasUnread && state.user.notificationsOn !== false);
  }

  function renderFeed() {
    const lv = currentLevel();
    const lp = levelProgress();
    const l = lvOf(lv);
    $('#feed-hero').innerHTML = `
      <div class="hello">${t('feed.hello', { nick: esc(state.user.nickname || t('common.creator')) })} ${isDemo() ? `<span class="badge demo">${esc(t('badge.demo'))}</span>` : ''}</div><h2>${t('feed.title')}</h2><button class="level-strip" data-act="tab" data-tab="ranks"><span class="ls-emoji">${l.emoji}</span><span class="ls-main"><span class="ls-top"><span>Lv.${l.id} ${l.name}</span><span class="ls-pct">${Math.round(lp.pct)}%</span></span><span class="ls-sub">${esc(lp.hint)}</span><span class="bar"><i style="width:${lp.pct}%"></i></span></span></button>`;

    renderChallengeBanner();
    renderFeedPromo();
    renderDailyFeed();
    renderChips();
    renderFeedList();
  }

  function challengeDays() {
    return Math.max(1, Math.ceil((state.challenge.endAt - Date.now()) / 86400e3));
  }

  function renderChallengeBanner() {
    const c = state.challenge;
    const x = challengeOf();
    $('#feed-challenge').innerHTML = `
      <button class="challenge" data-act="challenge"><span class="ch-tag"><span class="pulse"></span>${esc(t('challenge.tag'))}</span><strong>${esc(x.title)}${x.sub ? `<em>${esc(x.sub)}</em>` : ''}</strong><p>${esc(x.desc)}</p><span class="ch-foot"><span>${esc(t('challenge.joiners', { n: nf(c.participants) }))}</span><span>D-${challengeDays()}</span><span class="ch-go">${esc(t('challenge.cta'))}</span></span></button>`;
  }

  function renderFeedPromo() {
    const el = $('#feed-promo');
    if (!el) return;
    if (isPro()) { el.innerHTML = ''; return; }
    el.innerHTML = `
      <button class="feed-promo" data-act="open-market"><span class="fp-tag">${esc(t('feedPromo.tag'))}</span><span class="fp-main"><b>${esc(t('feedPromo.title'))}</b><span>${esc(t('feedPromo.sub'))}</span></span><span class="fp-go">${esc(t('feedPromo.cta'))} ›</span></button>`;
  }

  function renderChips() {
    const counts = { all: state.posts.length };
    CATS.forEach((c) => { counts[c.id] = state.posts.filter((p) => p.category === c.id).length; });
    const items = [{ id: 'all', name: t('chip.all') }, ...CATS.map((c) => ({ id: c.id, name: catName(c) }))];
    $('#feed-chips').innerHTML = items.map((c) => `
      <button class="chip ${state.ui.filter === c.id ? 'is-on' : ''}" data-act="filter" data-f="${c.id}" role="tab" aria-selected="${state.ui.filter === c.id}">${esc(c.name)}<span class="n">${counts[c.id]}</span></button>`).join('');
    $$('#feed-sort button').forEach((b) => {
      b.classList.toggle('is-on', b.dataset.s === state.ui.sort);
      b.textContent = t(b.dataset.s === 'new' ? 'sort.new' : 'sort.pop');
    });
  }

  function searchable(p) {
    const x = pText(p);
    const tags = Object.values(p.texts || {}).flatMap((v) => v.tags || []).concat(p.tags || []);
    return [
      x.title, x.desc, p.title, p.desc, p.prompt, nickOf(p.author), p.author.handle,
      toolName(toolOf(p.tool)), catName(catOf(p.category)), tags.join(' ')
    ].join(' ').toLowerCase();
  }

  function filteredPosts() {
    const q = state.ui.query.trim().toLowerCase();
    let list = state.posts.filter((p) => state.ui.filter === 'all' || p.category === state.ui.filter);
    if (q) list = list.filter((p) => searchable(p).includes(q));
    if (state.ui.sort === 'pop') {
      list = list.slice().sort((a, b) => (b.votes + b.cheers.fire) - (a.votes + a.cheers.fire));
    }
    return list;
  }

  function renderFeedList() {
    const list = filteredPosts();
    const q = state.ui.query.trim();
    const fs = $('#feed-search');
    if (fs) {
      if (fs.value !== q) fs.value = q;
      fs.placeholder = t('feed.searchPh');
    }
    $('.search .clear', $('#screen-feed'))?.toggleAttribute('hidden', !q);
    const countEl = $('#feed-count');
    if (countEl) countEl.textContent = cnt('feed.count', list.length);
    $('#feed-list').innerHTML = list.length
      ? list.map(postCard).join('')
      : `<div class="empty"><div class="big"></div>${q ? t('feed.emptyQuery', { q: esc(q) }) : esc(t('feed.emptyCat'))}<br><button class="btn small" style="margin-top:14px" data-act="clear-search">${esc(t('common.viewAll'))}</button></div>`;
  }

  function reactionCount(p) {
    return p.cheers.fire + p.cheers.bulb + p.cheers.clap;
  }

  function postCard(p) {
    const tl = toolOf(p.tool);
    const c = catOf(p.category);
    const locked = lockedFor(p);
    const isMine = !!p.mine;
    const following = state.follows.includes(p.author.handle);
    const commentCount = p.comments.reduce((a, cm) => a + 1 + (cm.replies?.length || 0), 0);
    const title = pTitle(p);
    return `
    <article class="post" data-post="${p.id}"><header class="post-head">${avatar(p.author)}
        <div class="who"><div class="post-name"><span class="nick">${esc(nickOf(p.author))}</span>${lvBadge(p.author.level)}
            ${isMine ? `<span class="badge demo">${esc(t('common.me'))}</span>` : ''}
          </div><div class="post-meta"><span>${esc(toolName(tl))}</span><i></i><span>${esc(catName(c))}</span><i></i><span>${timeAgo(p.createdAt)}</span></div></div>${!isMine ? `<button class="follow-btn ${following ? 'is-on' : ''}" data-act="follow" data-handle="${esc(p.author.handle)}">${esc(following ? t('post.following') : t('post.follow'))}</button>` : ''}
      </header><div class="media" data-act="open" data-id="${p.id}" role="button" tabindex="0" aria-label="${esc(t('post.openAria', { title }))}"><img src="${p.image}" alt="${esc(title)}" loading="lazy"><span class="cat-chip">${c.emoji} ${esc(catName(c))}</span>${p.picked ? `<span class="pick-chip">${esc(t('post.pick'))}</span>` : ''}
        ${p.category === 'video' ? '<span class="play-btn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg></span>' : ''}
        <span class="media-tool">${esc(toolName(tl))}</span>${p.views ? `<span class="media-views">▶ ${esc(nf(p.views))}</span>` : ''}
      </div><h3 class="post-title" data-act="open" data-id="${p.id}">${esc(title)}</h3><p class="post-desc">${esc(pDesc(p))}</p><div class="prompt-box ${locked ? 'is-locked' : ''}"><div class="prompt-head"><span class="prompt-label">PROMPT</span><span class="prompt-model">${esc(toolName(tl))} · ${esc(locked ? t('post.locked') : t('post.original'))}</span></div><p class="prompt-text">${esc(p.prompt)}</p>${locked ? `<span class="lock-veil"><span class="lock-pill"><span class="lk"></span>${esc(t('post.lockPill'))}</span></span>` : ''}
      </div>${locked && p.promptPublic ? `<div class="unlock-row"><button data-act="open-ranks">${esc(t('unlock.level'))}</button><span class="or">${esc(t('unlock.or'))}</span><button data-act="open-market" data-focus="pro">${esc(t('unlock.buy'))}</button></div>` : ''}

      <div class="post-actions">${['fire', 'bulb', 'clap'].map((k) => `
          <button class="act ${p.me[k] ? 'is-on' : ''}" data-act="react" data-id="${p.id}" data-k="${k}" aria-pressed="${!!p.me[k]}"><span class="emoji">${k === 'fire' ? '' : k === 'bulb' ? '' : ''}</span><span>${nf(p.cheers[k])}</span></button>`).join('')}
        <button class="act" data-act="open" data-id="${p.id}" aria-label="${esc(cnt('aria.commentCount', commentCount))}"><svg viewBox="0 0 24 24" fill="none"><path d="M20 12a7.5 7.5 0 0 1-11 6.6L4.5 20l1.2-4A7.5 7.5 0 1 1 20 12Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg><span>${commentCount}</span></button><span class="spacer"></span><button class="act bm ${p.bookmarked ? 'is-on' : ''}" data-act="bookmark" data-id="${p.id}" aria-label="${esc(t('aria.bookmark'))}" aria-pressed="${!!p.bookmarked}"><svg viewBox="0 0 24 24" fill="${p.bookmarked ? 'currentColor' : 'none'}"><path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-4-6 4V5.5a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></button><button class="act" data-act="share" data-id="${p.id}" aria-label="${esc(t('aria.share'))}"><svg viewBox="0 0 24 24" fill="none"><path d="M12 15V4m0 0L8.5 7.5M12 4l3.5 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 13v5.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button></div></article>`;
  }

  /* ---------------------------------------------------------------- explore */
  function renderExplore() {
    const q = state.ui.query.trim();
    const es = $('#explore-search');
    if (es) {
      if (es.value !== q) es.value = q;
      es.placeholder = t('explore.searchPh');
    }
    $('.search .clear', $('#screen-explore'))?.toggleAttribute('hidden', !q);
    $('#explore-results').hidden = !q;
    $('#explore-main').hidden = !!q;

    if (q) {
      const list = state.posts.filter((p) => searchable(p).includes(q.toLowerCase()));
      $('#explore-results').innerHTML = `
        <div class="section-head" style="margin-top:16px"><h3>${esc(t('explore.results'))} <span class="muted" style="font-size:12px">${list.length}</span></h3><button class="link" data-act="clear-search">${esc(t('explore.clear'))}</button></div>${list.length ? list.map((p) => `
          <button class="result-row" data-act="open" data-id="${p.id}"><img src="${p.image}" alt="" loading="lazy"><span class="rr-main"><b>${esc(pTitle(p))}</b><span>${esc(nickOf(p.author))} · ${esc(toolName(toolOf(p.tool)))} · ${timeAgo(p.createdAt)}</span></span><span class="badge lv${p.author.level}">${LEVELS[p.author.level].emoji} Lv.${p.author.level}</span></button>`).join('') : `<div class="empty"><div class="big"></div>${esc(t('explore.noMatch'))}</div>`}`;
      return;
    }

    const tags = EXPLORE_TAG_KEYS
      .map((k) => state.posts.find((p) => p.key === k))
      .filter(Boolean)
      .map((p) => pTags(p)[0])
      .filter(Boolean);
    const tagCount = (tag) => state.posts.filter((p) => searchable(p).includes(tag.replace('#', '').toLowerCase())).length;
    const picked = state.posts.filter((p) => p.picked).slice(0, 4);
    const newest = state.posts.slice(0, 4);

    $('#explore-main').innerHTML = `
      <div class="section-head"><h3>${esc(t('explore.tags'))}</h3><span class="link">${esc(t('explore.weekly'))}</span></div><div class="tag-cloud">${tags.map((tg) => `<button class="tag" data-act="tag" data-tag="${esc(tg)}">${esc(tg)} <span class="h">${tagCount(tg)}</span></button>`).join('')}
      </div><div class="section-head"><h3>${esc(t('explore.tools'))}</h3></div><div class="tool-grid">${TOOLS.slice(0, 8).map((tl) => {
          const n = state.posts.filter((p) => p.tool === tl.id).length;
          return `<button class="tool-tile" data-act="tool" data-tool="${tl.id}"><span class="tl" style="background:${tl.color}">${tl.mark}</span><span class="tt"><b>${esc(toolName(tl))}</b><span>${esc(cnt('explore.toolWorks', n))}</span></span></button>`;
        }).join('')}
      </div><div class="section-head"><h3>${esc(t('explore.cats'))}</h3></div><div class="cat-grid">${CATS.map((c) => {
          const n = state.posts.filter((p) => p.category === c.id).length;
          return `<button class="cat-card c-${c.id}" data-act="cat" data-cat="${c.id}"><span class="cemoji" style="font-size:18px">${c.emoji}</span><span><b>${esc(catName(c))}</b><br><span>${esc(cnt('explore.catWorks', n))}</span></span><span class="arrow">↗</span></button>`;
        }).join('')}
      </div><div class="section-head"><h3>${esc(t('explore.picked'))}</h3><button class="link" data-act="tab" data-tab="ranks">${esc(t('explore.pickCriteria'))}</button></div><div class="grid-2">${picked.map((p) => `
          <button class="tile" data-act="open" data-id="${p.id}"><img src="${p.image}" alt="${esc(pTitle(p))}" loading="lazy"><span class="cap">${esc(pTitle(p))}<small>${esc(nickOf(p.author))} ·  ${nf(p.cheers.fire)}</small></span></button>`).join('')}
      </div><div class="section-head"><h3>${esc(t('explore.new'))}</h3></div>${newest.map((p) => `
        <button class="result-row" data-act="open" data-id="${p.id}"><img src="${p.image}" alt="" loading="lazy"><span class="rr-main"><b>${esc(pTitle(p))}</b><span>${esc(toolName(toolOf(p.tool)))} · ${timeAgo(p.createdAt)} · ${esc(catName(catOf(p.category)))}</span></span><span class="chev" style="color:#4A5365">›</span></button>`).join('')}
    `;
  }

  /* ---------------------------------------------------------------- market */
  function productCard(x, i) {
    const k = 'shop.p' + (i + 1);
    return `
      <article class="shop-card"><div class="shop-cover"><img src="${x.img}" alt="${esc(t(k + '.name'))}" loading="lazy"><span class="shop-tag">${esc(t('shop.early'))}</span>${x.pro ? `<span class="shop-pro">${esc(t('badge.pro'))}</span>` : ''}
        </div><div class="shop-body"><h3>${esc(t(k + '.name'))}</h3><p class="shop-desc">${esc(t(k + '.desc'))}</p><div class="shop-inc">${esc(t('market.includes'))}</div><ul class="shop-list">${[1, 2, 3].map((n) => `<li>${esc(t(k + '.i' + n))}</li>`).join('')}
          </ul><div class="shop-price"><span class="now">${esc(krw(x.price))}</span><span class="was">${esc(t('shop.was'))} ${esc(krw(x.list))}</span><span class="off">${esc(t('shop.off', { p: shopOff(x) }))}</span></div><a class="btn primary block shop-cta" href="${x.url}" target="_blank" rel="noopener noreferrer">${esc(t(k + '.cta'))} ↗</a>${x.freeUrl ? `<a class="shop-free" href="${x.freeUrl}" target="_blank" rel="noopener noreferrer">${esc(t(k + '.free'))} ↗</a>` : ''}
          <div class="shop-fine">${esc(t('shop.digital'))} · ${esc(t('shop.external'))}</div></div></article>`;
  }

  function renderMarket() {
    const root = $('#market-root');
    if (!root) return;
    const pro = isPro();
    root.innerHTML = `
      <div class="page-head"><span class="eyebrow">MARKET</span><h2>${esc(t('market.head'))}</h2><p>${esc(t('market.sub'))}</p></div><section class="pro-card ${pro ? 'is-on' : ''}" id="pro-pass" aria-label="${esc(t('pro.title'))}"><div class="pro-top"><span class="pro-badge">${esc(t('pro.tag'))}</span><span class="pro-status ${pro ? 'on' : ''}"><i></i>${esc(pro ? t('pro.on') : t('pro.off'))}</span></div><h3>${esc(t('pro.title'))}</h3><p class="pro-desc">${esc(t('pro.desc'))}</p><ul class="pro-list">${[1, 2, 3].map((n) => `<li><span class="pi">${n === 1 ? '' : n === 2 ? '' : ''}</span><span class="pt"><b>${esc(t('pro.b' + n + 't'))}</b><span>${esc(t('pro.b' + n + 's'))}</span></span></li>`).join('')}
        </ul><a class="btn primary block" href="${SHOP[0].url}" target="_blank" rel="noopener noreferrer">${esc(t('pro.buy'))} ↗</a><div class="pro-price">${esc(t('pro.priceLine', { p: krw(SHOP[0].price), l: krw(SHOP[0].list) }))}</div><button class="btn ghost block pro-level" data-act="tab" data-tab="ranks"><span class="pl-main">${esc(t('pro.level'))}</span><span class="pl-sub">${esc(t('pro.levelSub'))}</span></button><div class="pro-links"><a class="pro-free" href="${SHOP[0].freeUrl}" target="_blank" rel="noopener noreferrer">${esc(t('pro.preview'))} ↗</a><button class="link-btn" data-act="pro-demo">${esc(pro ? t('pro.demoOff') : t('pro.demoOn'))}</button></div><p class="pro-demo-note">${esc(t('pro.demoNote'))}</p></section><div class="section-head"><h3>${esc(t('market.shop'))}</h3><span class="link">${esc(t('market.shopSub'))}</span></div><div class="shop-grid">${SHOP.map(productCard).join('')}</div><div class="section-head"><h3>${esc(t('market.trustTitle'))}</h3></div><section class="trust-card">${[1, 2, 3, 4].map((n) => `<div class="trust-row"><span class="ti">${['', '', '↩', 'ℹ'][n - 1]}</span><p>${esc(t('market.trust' + n))}</p></div>`).join('')}
      </section><p class="market-legal">${esc(t('market.legal'))}</p><section class="roadmap"><span class="rm-tag">${esc(t('market.roadmapTag'))}</span><h3>${esc(t('market.roadmapTitle'))}</h3><p>${esc(t('market.roadmapDesc'))}</p></section>`;
  }

  /* ---------------------------------------------------------------- ranks */
  function leaderboard() {
    const map = new Map();
    state.posts.forEach((p) => {
      const key = p.mine ? '__me' : p.author.handle;
      if (!map.has(key)) {
        map.set(key, {
          key, author: p.mine ? meAuthor() : p.author, works: 0, score: 0, rec: 0, mine: !!p.mine, prev: 0
        });
      }
      const row = map.get(key);
      row.works += 1;
      row.rec += p.cheers.fire + p.cheers.bulb + p.cheers.clap + p.votes;
      row.score += p.votes * 2 + p.cheers.fire + p.cheers.bulb + p.cheers.clap;
    });
    return Array.from(map.values()).sort((a, b) => b.score - a.score);
  }

  function renderRanks() {
    const lv = currentLevel();
    const l = lvOf(lv);
    const lp = levelProgress();
    const s = stats();
    const myScore = leaderboard().find((r) => r.mine);
    const board = leaderboard().slice(0, 5);
    const best = state.posts.slice().sort((a, b) => b.votes - a.votes).slice(0, 4);
    const c = state.challenge;
    const cx = challengeOf();
    const dash = 2 * Math.PI * 35;

    $('#ranks-inner').innerHTML = `
      <div class="page-head"><span class="eyebrow">LEVELS & RANKING</span><h2>${esc(t('ranks.head'))}</h2><p>${esc(t('ranks.sub'))}</p></div><section class="level-card" aria-label="${esc(t('ranks.myLevelAria'))}"><div class="level-top"><div class="ring"><svg viewBox="0 0 84 84"><defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2BE3A5"/><stop offset="1" stop-color="#38BDF8"/></linearGradient></defs><circle cx="42" cy="42" r="35" stroke="rgba(43,227,165,.16)" stroke-width="6" fill="none"/><circle cx="42" cy="42" r="35" stroke="url(#ringGrad)" stroke-width="6" fill="none" stroke-linecap="round"
                stroke-dasharray="${dash.toFixed(1)}" stroke-dashoffset="${(dash * (1 - lp.pct / 100)).toFixed(1)}"/></svg><span class="ring-emoji">${l.emoji}</span></div><div class="lvl-meta"><div class="lv-title">MY LEVEL ${isDemo() ? `<span class="badge demo">${esc(t('ranks.demoSwitched'))}</span>` : ''}</div><h3>Lv.${l.id} ${l.name}${L() === 'en' ? '' : `<span class="badge lv${l.id}">${l.emoji} ${esc(l.label)}</span>`}</h3><div class="lv-desc">${esc(l.desc)}</div></div></div><div class="lvl-progress"><div class="lp-row"><span>${esc(lp.next)}</span><b>${esc(lp.label)}</b></div><div class="bar"><i style="width:${lp.pct}%"></i></div><div class="xp-row"><span class="xp-chip">${esc(t('ranks.xp', { n: nf(xp()) }))}</span><span class="xp-chip">${esc(t('ranks.prompts', { n: s.prompts }))}</span><span class="xp-chip">${esc(t('ranks.wroteComments', { n: s.comments }))}</span></div></div><div class="demo-box"><span class="dl"><b>${esc(t('ranks.demoSwitch'))}</b>${esc(t('ranks.demoSub'))}</span><div class="demo-seg" role="group" aria-label="${esc(t('ranks.demoSwitch'))}">${[1, 2, 3, 4].map((n) => `<button data-act="demo" data-lv="${n}" class="${Number(state.user.demoLevel) === n ? 'is-on' : ''}" title="Lv.${n} ${LEVELS[n].name}">${LEVELS[n].emoji}</button>`).join('')}
            <button data-act="demo" data-lv="auto" class="auto ${!isDemo() ? 'is-on' : ''}">${esc(t('ranks.auto'))}</button></div></div></section><div class="section-head"><h3>${esc(t('ranks.benefits'))}</h3><span class="link">${esc(t('ranks.immediate'))}</span></div><section class="benefit" aria-label="${esc(t('ranks.benefitAria'))}"><div class="benefit-row head"><span class="bh" style="text-align:left">${esc(t('ranks.permission'))}</span>${[1, 2, 3, 4].map((n) => `<span class="bh">${LEVELS[n].emoji}<br>Lv.${n}</span>`).join('')}
        </div>${BENEFITS.map((b) => `
          <div class="benefit-row"><span class="feat"><span class="fi2">${b.icon}</span>${esc(t('benefit.' + b.key))}</span>${[1, 2, 3, 4].map((n) => `<span class="cell ${n >= b.min ? 'on' : 'lock'} ${n === lv ? 'cur' : ''}">${n >= b.min ? '' : '·'}</span>`).join('')}
          </div>`).join('')}
        <div class="benefit-note">${esc(t('ranks.benefitNote'))}</div></section><div class="section-head"><h3>${esc(t('ranks.weeklyTop'))}</h3><span class="link">${esc(t('ranks.monday'))}</span></div><section aria-label="${esc(t('ranks.boardAria'))}">${board.map((r, i) => `
          <div class="board-row ${r.mine ? 'me' : ''}"><span class="rank r${i + 1}">${i + 1}</span>${avatar(r.author, 'sm')}
            <span class="who"><span class="nm">${esc(nickOf(r.author))} ${lvBadge(r.author.level)}${r.mine ? `<span class="badge demo">${esc(t('common.me'))}</span>` : ''}</span><span class="sub">${esc(cnt('ranks.boardSub', r.works, { w: r.works, r: nf(r.rec) }))}</span></span><span class="score"><b>${nf(r.score)}</b><span class="delta">+${(i + 2)}</span></span></div>`).join('')}
        ${myScore && !board.some((r) => r.mine) ? `
          <div class="board-row me"><span class="rank">—</span>${avatar(meAuthor(), 'sm')}
            <span class="who"><span class="nm">${esc(state.user.nickname)} ${lvBadge(lv)}<span class="badge demo">${esc(t('common.me'))}</span></span><span class="sub">${esc(cnt('ranks.mySub', myScore.works, { w: myScore.works, s: nf(myScore.score) }))}</span></span><span class="score"><b>${nf(myScore.score)}</b><span>${esc(t('ranks.thisWeek'))}</span></span></div>` : ''}
      </section><div class="section-head"><h3>${esc(t('ranks.best'))}</h3><span class="link">${esc(can('vote') ? t('ranks.canVote') : t('ranks.voteFrom3'))}</span></div><section aria-label="${esc(t('ranks.bestAria'))}">${best.map((p, i) => `
          <div class="best-row"><span class="rank r${i + 1}">${i + 1}</span><img src="${p.image}" alt="" loading="lazy"><span class="best-main"><b>${esc(pTitle(p))}</b><span>${esc(nickOf(p.author))} · ${esc(toolName(toolOf(p.tool)))}</span></span><button class="vote-btn ${p.voted ? 'is-on' : ''}" data-act="vote" data-id="${p.id}">${p.voted ? '' : ''} ${nf(p.votes)}</button></div>`).join('')}
      </section><div class="section-head"><h3>${esc(t('ranks.weeklyChallenge'))}</h3><span class="link">D-${challengeDays()}</span></div><section class="challenge-block" id="challenge-block">${ui.challengeForm ? `
          <h4>${esc(t('ranks.newForm'))} <em>CURATOR</em></h4><input class="f-input" id="ch-title" placeholder="${esc(t('ranks.chTitlePh'))}" maxlength="20" style="margin-top:10px"><textarea class="f-input" id="ch-desc" placeholder="${esc(t('ranks.chDescPh'))}" style="margin-top:8px;min-height:70px"></textarea><div class="cb-foot"><button class="btn small ghost" data-act="challenge-cancel">${esc(t('common.cancel'))}</button><button class="btn small primary" data-act="challenge-save">${esc(t('ranks.create'))}</button></div>` : `
          <h4>${esc(cx.title)} ${cx.sub ? `<em>${esc(cx.sub)}</em>` : ''}</h4><p>${esc(cx.desc)}</p><div class="cb-foot"><span class="tiny">${esc(t('ranks.statLine', { n: nf(c.participants), d: challengeDays() }))}</span><button class="btn small" data-act="challenge-join">${esc(t('ranks.join'))}</button>${can('challenge') ? `<button class="btn small dark" data-act="challenge-new">${esc(t('ranks.newChallenge'))}</button>` : `<span class="tiny" title="${esc(t('ranks.curatorOnly'))}"> Lv.4</span>`}
          </div>`}
      </section><p class="tiny" style="margin:14px 2px 0;line-height:1.6;color:var(--txt-3)">${esc(t('ranks.scoreNote'))}</p>`;
  }

  /* ---------------------------------------------------------------- my */
  function renderMy() {
    const lv = currentLevel();
    const l = lvOf(lv);
    const s = stats();
    const lp = levelProgress();
    const mine = myPosts();
    const bookmarks = state.posts.filter((p) => p.bookmarked);
    const interests = state.user.interests.map((id) => toolOf(id)).filter(Boolean);

    $('#my-inner').innerHTML = `
      <div class="page-head"><span class="eyebrow">MY SPACE</span><h2>${esc(t('my.head'))}</h2><p>${esc(t('my.sub'))}</p></div><section class="profile-card"><div class="profile-top">${avatar({ nick: state.user.nickname || t('common.me'), hue: state.user.hue, me: true }, 'lg')}
          <div class="pt-main"><h2>${esc(state.user.nickname || t('common.creator'))} ${lvBadge(lv)}</h2><div class="handle">${esc(state.user.handle || '@me')} · ${esc(t('my.joined', { date: I18N.monthYear(state.user.joined) }))}</div></div></div><div class="profile-tags">${interests.length ? interests.map((x) => `<span class="tg">${esc(toolName(x))}</span>`).join('') : `<span class="tg">${esc(t('my.noInterests'))}</span>`}
          ${isPro() ? `<span class="tg pro">${esc(t('badge.pro'))}</span>` : ''}
          ${isDemo() ? `<span class="tg" style="color:#9AE6CF;border-color:rgba(43,227,165,.3)">${esc(t('my.demoUsing'))}</span>` : ''}
        </div><div class="stats"><div class="stat"><b>${s.prompts}</b><span>${esc(t('my.stat.upload'))}</span></div><div class="stat"><b>${nf(s.upvotes)}</b><span>${esc(t('my.stat.upvotes'))}</span></div><div class="stat"><b>${s.comments}</b><span>${esc(t('my.stat.comments'))}</span></div><div class="stat"><b>${s.bookmarks}</b><span>${esc(t('my.stat.bookmarks'))}</span></div></div><div class="lvl-progress"><div class="lp-row"><span>${esc(lp.next)}</span><b>${esc(lp.label)}</b></div><div class="bar"><i style="width:${lp.pct}%"></i></div></div></section><div class="section-head"><h3>${esc(t('my.posts'))}</h3><button class="link" data-act="upload">${esc(t('my.uploadBtn'))}</button></div><section class="list" style="padding:2px 12px">${mine.length ? mine.slice(0, 4).map((p) => `
          <button class="mini-post" data-act="open" data-id="${p.id}" style="width:100%;text-align:left;background:none;border:0;border-bottom:1px solid rgba(255,255,255,.05)"><img src="${p.image}" alt=""><span class="mp"><b>${esc(pTitle(p))}</b><span>${esc(toolName(toolOf(p.tool)))} · ${timeAgo(p.createdAt)} ·  ${p.cheers.fire}</span></span><span class="chev" style="color:#4A5365">›</span></button>`).join('')
          : `<div class="empty" style="padding:22px 8px"><div class="big"></div>${esc(t('my.noPosts'))}<br>${esc(can('upload') ? t('my.firstPost') : t('my.lv2Upload'))}<br><button class="btn small primary" style="margin-top:12px" data-act="upload">${esc(t('my.openUpload'))}</button></div>`}
      </section><div class="section-head"><h3>${esc(t('my.saved'))}</h3><span class="link">${bookmarks.length}</span></div><section class="list" style="padding:2px 12px">${bookmarks.length ? bookmarks.map((p) => `
          <button class="mini-post" data-act="open" data-id="${p.id}" style="width:100%;text-align:left;background:none;border:0;border-bottom:1px solid rgba(255,255,255,.05)"><img src="${p.image}" alt=""><span class="mp"><b>${esc(pTitle(p))}</b><span>${esc(nickOf(p.author))} · ${esc(toolName(toolOf(p.tool)))}</span></span><span class="chev" style="color:#4A5365">›</span></button>`).join('')
          : `<div class="empty" style="padding:20px 8px">${esc(t('my.savedEmpty'))}</div>`}
      </section><div class="section-head"><h3>${esc(t('my.settings'))}</h3></div><section class="list"><button class="list-row" data-act="open-market" data-focus="pro"><span class="li-ic"></span><span class="li-main"><b>${esc(t('my.proRow'))}</b><span>${esc(isPro() ? t('my.proOn') : t('my.proOff'))}</span></span><span class="chev">›</span></button><button class="list-row" data-act="tab" data-tab="ranks"><span class="li-ic"></span><span class="li-main"><b>${esc(t('my.demoRow'))}</b><span>${esc(t('my.current', { emoji: l.emoji, lv, name: l.name, state: isDemo() ? t('my.stateDemo') : t('my.stateAuto') }))}</span></span><span class="chev">›</span></button><div class="list-row"><span class="li-ic"></span><span class="li-main"><b>${esc(t('my.noti'))}</b><span>${esc(state.user.notificationsOn ? t('my.notiOn') : t('my.notiOff'))}</span></span><button class="switch ${state.user.notificationsOn ? 'is-on' : ''}" data-act="toggle-noti" role="switch" aria-checked="${!!state.user.notificationsOn}" aria-label="${esc(t('aria.notiToggle'))}"></button></div><button class="list-row" data-act="reset" style="color:${ui.resetArmed ? 'var(--danger)' : 'inherit'}"><span class="li-ic">${ui.resetArmed ? '' : ''}</span><span class="li-main"><b>${esc(ui.resetArmed ? t('my.resetArm') : t('my.reset'))}</b><span>${esc(ui.resetArmed ? t('my.resetSubArm') : t('my.resetSub'))}</span></span><span class="chev">${ui.resetArmed ? '!' : '›'}</span></button><div class="list-row"><span class="li-ic"></span><span class="li-main"><b>${esc(t('my.saveMode'))}</b><span>${esc(t('my.saveModeSub'))}</span></span><span class="badge demo">v1.1</span></div></section><p class="tiny" style="text-align:center;margin:22px 0 6px;color:var(--txt-3);line-height:1.7">${esc(t('my.footer'))}<br>Made for creators who show their work.
      </p>`;
  }

  /* ---------------------------------------------------------------- detail sheet */
  function lockedFor(p) {
    if (p.mine) return false;
    if (!p.promptPublic) return true;
    return !can('prompt');
  }

  function openDetail(id, opts = {}) {
    const p = state.posts.find((x) => x.id === id);
    if (!p) return;
    ui.detailId = id;
    ui.replyTo = null;
    ui.draft = '';
    ui.commentType = 'general';
    $('#sheet-detail').innerHTML = detailHTML(p);
    openSheet('detail');
    syncRemoteComments(p);
    const sc = $('#detail-scroll');
    if (sc) {
      if (opts.toBottom) sc.scrollTop = sc.scrollHeight;
      else sc.scrollTop = 0;
    }
  }

  function detailHTML(p) {
    const tl = toolOf(p.tool);
    const c = catOf(p.category);
    const locked = lockedFor(p);
    const following = state.follows.includes(p.author.handle);
    const cc = p.comments.reduce((a, cm) => a + 1 + (cm.replies?.length || 0), 0);
    const canSug = can('suggestion');
    const title = pTitle(p);
    return `
      <div class="grab-row"><span class="grab"></span></div><div class="sheet-head"><h3>${esc(t('detail.head'))}</h3><span class="sub">${esc(toolName(tl))} · ${esc(catName(c))}</span><button class="sheet-close" data-act="close-sheet" aria-label="${esc(t('aria.close'))}"></button></div><div class="sheet-scroll" id="detail-scroll"><div class="detail-media"><img src="${p.image}" alt="${esc(title)}">${p.picked ? `<span class="pick-chip">${esc(t('post.pick'))}</span>` : ''}
          ${p.category === 'video' ? '<span class="play-btn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg></span>' : ''}
        </div><div class="detail-author">${avatar(p.author)}
          <div class="who"><div class="nm">${esc(nickOf(p.author))} ${lvBadge(p.author.level)} ${p.mine ? `<span class="badge demo">${esc(t('common.me'))}</span>` : ''}</div><div class="mt">${esc(p.author.handle)} · ${timeAgo(p.createdAt)}${p.views ? ' · ▶ ' + esc(nf(p.views)) : ''}</div></div>${!p.mine ? `<button class="follow-btn ${following ? 'is-on' : ''}" data-act="follow" data-handle="${esc(p.author.handle)}">${esc(following ? t('post.following') : t('post.follow'))}</button>` : ''}
        </div><h2 class="detail-title">${esc(title)}</h2><p class="detail-desc">${esc(pDesc(p))}</p>${pTags(p).length ? `<div class="detail-tags">${pTags(p).map((g) => `<span>${esc(g)}</span>`).join('')}</div>` : ''}

        <div class="prompt-card"><div class="pc-head"><span class="prompt-label">PROMPT</span><span class="badge demo">${esc(p.promptPublic ? t('detail.public') : t('detail.private'))}</span><span class="pm">${esc(toolName(tl))}</span></div>${locked
            ? `<div class="pc-body is-locked" aria-hidden="true">${esc(p.prompt)}</div><div class="pc-lock"><span style="font-size:19px"></span><span class="t"><b>${esc(p.promptPublic ? t('detail.lockBuilder') : t('detail.lockPrivate'))}</b><br>${esc(p.promptPublic ? t('detail.lockBuilderSub') : t('detail.lockPrivateSub'))}</span>${p.promptPublic ? `<div class="lock-actions"><button class="btn small primary" data-act="open-ranks">${esc(t('unlock.level'))}</button><button class="btn small ghost" data-act="open-market" data-focus="pro">${esc(t('unlock.buy'))}</button></div>` : ''}
               </div>`
            : `<div class="pc-body" id="pc-text">${esc(p.prompt)}</div>`}
          <div class="pc-foot"><span class="copies">${esc(t('detail.copies', { n: nf(p.copies) }))}</span><span class="spacer"></span>${!p.promptPublic && !p.mine ? '' : `
              <button class="btn small ${locked ? '' : 'primary'}" data-act="copy" data-id="${p.id}">${esc(locked ? t('detail.copyLocked') : t('detail.copy'))}</button><button class="btn small ${can('remix') ? 'dark' : 'ghost'}" data-act="remix" data-id="${p.id}">${esc(can('remix') ? t('detail.remix') : t('detail.remixLocked'))}</button>`}
          </div></div><div class="reactions">${[['fire', '', 'react.fire'], ['bulb', '', 'react.bulb'], ['clap', '', 'react.clap']].map(([k, e, lb]) => `
            <button class="reaction ${p.me[k] ? 'is-on' : ''}" data-act="react" data-id="${p.id}" data-k="${k}" aria-pressed="${!!p.me[k]}"><span class="e">${e}</span><span class="c">${nf(p.cheers[k])}</span><span class="lb">${esc(t(lb))}</span></button>`).join('')}
        </div><div class="detail-actions"><button class="act bm ${p.bookmarked ? 'is-on' : ''}" data-act="bookmark" data-id="${p.id}" aria-pressed="${!!p.bookmarked}"><svg viewBox="0 0 24 24" fill="${p.bookmarked ? 'currentColor' : 'none'}"><path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-4-6 4V5.5a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>${esc(p.bookmarked ? t('detail.saved') : t('detail.save'))}
          </button><button class="act" data-act="share" data-id="${p.id}"><svg viewBox="0 0 24 24" fill="none"><path d="M12 15V4m0 0L8.5 7.5M12 4l3.5 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 13v5.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>${esc(t('detail.share'))}
          </button><button class="act" data-act="open-ranks"><svg viewBox="0 0 24 24" fill="none"><path d="M5 19V11M12 19V6M19 19v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>${esc(t('detail.myLevel'))}
          </button></div><div class="vote-card"><span class="vi"></span><span class="vm"><b>${esc(t('detail.vote'))}</b><span>${esc(can('vote') ? t('detail.voteSub') : t('detail.voteSubLocked'))}</span></span><button class="vote-btn ${p.voted ? 'is-on' : ''}" data-act="vote" data-id="${p.id}">${p.voted ? '' : can('vote') ? '' : ''} ${nf(p.votes)}</button></div>${can('pick') ? `
          <div class="curator-card"><span class="vi" style="width:34px;height:34px;border-radius:11px;display:grid;place-items:center;background:rgba(192,132,252,.14);font-size:15px;flex:none"></span><span class="vm"><b>${esc(t('curator.tools'))}</b><span>${esc(p.picked ? t('curator.isPicked') : t('curator.canPick'))}</span></span><button class="btn small ${p.picked ? 'dark' : ''}" data-act="pick" data-id="${p.id}">${esc(p.picked ? t('curator.unpick') : t('curator.pick'))}</button></div>` : ''}

        <div class="comments-head"><h4>${esc(t('comments.title'))}</h4><span class="n">${cc}</span><span class="my-lv">${lvBadge(currentLevel())}</span></div><div id="comments">${p.comments.length ? p.comments.map((cm) => commentHTML(p, cm)).join('') : `<div class="empty" style="padding:22px 6px">${esc(t('comments.empty'))}</div>`}
        </div></div><div class="sheet-foot"><div class="composer"><div class="cmp-box">${ui.replyTo ? `<div class="cmp-reply">↩ <b>${esc(t('comments.replyTo', { nick: ui.replyTo.nick }))}</b> <button data-act="cancel-reply" aria-label="${esc(t('aria.cancelReply'))}"></button></div>` : ''}
            <textarea id="cmp-text" rows="1" maxlength="400" placeholder="${esc(ui.replyTo ? t('comments.phReply') : canSug ? t('comments.phSuggest') : t('comments.phGeneral'))}" aria-label="${esc(t('aria.commentInput'))}">${esc(ui.draft)}</textarea><div class="cmp-tools"><div class="type-seg" role="group" aria-label="${esc(t('aria.commentType'))}"><button data-act="type" data-type="general" class="${ui.commentType === 'general' ? 'is-on' : ''}">${esc(t('comments.typeGeneral'))}</button><button data-act="type" data-type="suggestion" class="${ui.commentType === 'suggestion' ? 'is-on' : ''}" ${canSug ? '' : `disabled title="Lv.2 Builder"`}>${esc(canSug ? t('comments.typeSuggest') : t('comments.typeSuggestLocked'))}</button></div><span class="cmp-hint">${esc(canSug ? t('comments.hint') : t('comments.hintLocked'))}</span></div></div><button class="cmp-send" data-act="send-comment" aria-label="${esc(t('aria.send'))}"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5 19 5l-4.2 14.5-3.3-6-6.5-1Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></button></div></div>`;
  }

  function commentHTML(p, cm) {
    const sug = cm.type === 'suggestion';
    return `
      <div class="comment">${avatar(cm.author, 'sm')}
        <div class="c-main"><div class="c-head"><b>${esc(nickOf(cm.author))}</b>${lvBadge(cm.author.level)}
            ${sug ? `<span class="c-tag">${esc(t('comments.suggestTag'))}</span>` : ''}
            <time>${timeAgo(cm.createdAt)}</time></div><p class="c-text">${esc(cmText(cm))}</p><div class="c-acts"><button class="${cm.liked ? 'on' : ''}" data-act="comment-like" data-pid="${p.id}" data-cid="${cm.id}">${cm.liked ? '' : ''} ${cm.likes || ''}</button><button data-act="reply" data-pid="${p.id}" data-cid="${cm.id}">${esc(t('comments.reply'))}</button></div>${(cm.replies || []).length ? `<div class="replies">${cm.replies.map((r) => `
              <div class="reply">${avatar(r.author, 'xs')}
                <div class="r-main"><div class="r-head"><b>${esc(nickOf(r.author))}</b>${lvBadge(r.author.level)}<time>${timeAgo(r.createdAt)}</time></div><p>${esc(cmText(r))}</p></div></div>`).join('')}
          </div>` : ''}
        </div></div>`;
  }

  function refreshDetail() {
    const p = state.posts.find((x) => x.id === ui.detailId);
    if (!p) return;
    const sc = $('#detail-scroll');
    const top = sc ? sc.scrollTop : 0;
    const ta = $('#cmp-text');
    if (ta) ui.draft = ta.value;
    $('#sheet-detail').innerHTML = detailHTML(p);
    const sc2 = $('#detail-scroll');
    if (sc2) sc2.scrollTop = top;
    const ta2 = $('#cmp-text');
    if (ta2) {
      ta2.value = ui.draft;
      autosize(ta2);
      if (ui.focusComposer) { ta2.focus(); ui.focusComposer = false; }
    }
  }

  function autosize(t) {
    t.style.height = 'auto';
    t.style.height = Math.min(82, t.scrollHeight) + 'px';
  }

  /* ---------------------------------------------------------------- upload sheet */
  function openUpload() {
    const sheet = $('#sheet-upload');
    sheet.innerHTML = uploadHTML();
    sheet.classList.toggle('is-compact', !can('upload'));
    openSheet('upload');
  }

  function uploadHTML() {
    const lv = currentLevel();
    if (!can('upload')) {
      const s = stats();
      return `
        <div class="grab-row"><span class="grab"></span></div><div class="sheet-head"><h3>${esc(t('up.head'))}</h3><span class="sub">Lv.${lv} ${LEVELS[lv].name}</span><button class="sheet-close" data-act="close-sheet" aria-label="${esc(t('aria.close'))}"></button></div><div class="sheet-scroll"><div class="upload-lock"><div class="ul-ic"></div><h4>${esc(t('up.lockTitle'))}</h4><p>${esc(t('up.lockDesc'))}</p><ul class="checklist"><li><span class="ck ${s.prompts >= 3 ? 'done' : ''}">${s.prompts >= 3 ? '' : ''}</span>${esc(t('up.step1', { n: s.prompts }))}</li><li><span class="ck ${s.prompts >= 3 ? 'done' : ''}">${s.prompts >= 3 ? '' : ''}</span>${esc(t('up.step2'))}</li><li><span class="ck">·</span>${esc(t('up.step3'))}</li></ul></div><div style="display:flex;gap:8px;margin-top:18px"><button class="btn ghost" style="flex:1" data-act="close-sheet">${esc(t('up.browse'))}</button><button class="btn primary" style="flex:1" data-act="demo-and-upload">${esc(t('up.enable'))}</button></div><p class="form-hint" style="text-align:center;margin-top:12px">${t('up.demoHint')}</p></div>`;
    }

    const u = ui.upload;
    const selectedTool = TOOLS.find((x) => x.id === u.tool);
    const samples = ART.slice(0, 6);
    return `
      <div class="grab-row"><span class="grab"></span></div><div class="sheet-head"><h3>${esc(t('up.head'))}</h3><span class="sub">Lv.${lv} ${LEVELS[lv].name} · ${esc(state.user.nickname)}</span><button class="sheet-close" data-act="close-sheet" aria-label="${esc(t('aria.close'))}"></button></div><div class="sheet-scroll"><div class="form-block"><div class="form-label"><span>${esc(t('up.imageLabel'))}<span class="req">*</span></span><small>${esc(t('up.imageHint'))}</small></div><div class="drop ${u.image ? 'has-img' : ''}" ${u.image ? '' : 'data-act="pick-file"'} role="button" tabindex="0" aria-label="${esc(t('aria.pickImage'))}">${u.image
              ? `<img src="${u.image}" alt="${esc(t('up.previewAlt'))}"><span class="overlay"><span>${esc(u.image.startsWith('data:') ? t('up.myImage') : t('up.sampleArt'))}</span><b data-act="pick-file">${esc(t('up.otherImage'))}</b></span>`
              : `<span class="di"></span><b>${esc(t('up.dropTap'))}</b><span>${esc(t('up.dropSub'))}</span>`}
          </div><input type="file" id="up-file" accept="image/*" hidden><div class="samples">${samples.map((src) => `<button class="sample ${u.image === src ? 'is-on' : ''}" data-act="pick-sample" data-src="${src}" aria-label="${esc(t('aria.samplePick'))}"><img src="${src}" alt=""></button>`).join('')}
          </div></div><div class="form-block"><div class="form-label"><span>${esc(t('up.titleLabel'))}<span class="req">*</span></span><small>${(u.title || '').length}/40</small></div><input class="f-input" data-up="title" maxlength="40" placeholder="${esc(t('up.titlePh'))}" value="${esc(u.title)}"></div><div class="form-block"><div class="form-label"><span>${esc(t('up.category'))}</span></div><div class="seg" role="group" aria-label="${esc(t('aria.category'))}">${CATS.map((c) => `<button class="${u.category === c.id ? 'is-on' : ''}" data-act="up-cat" data-cat="${c.id}">${c.emoji} ${esc(catName(c))}</button>`).join('')}
          </div></div><div class="form-block"><div class="form-label"><span>${esc(t('up.tool'))}<span class="req">*</span></span><small>${selectedTool ? esc(toolName(selectedTool)) : esc(t('up.pickOne'))}</small></div><div class="tool-pick" role="group" aria-label="${esc(t('aria.tool'))}">${TOOLS.map((x) => `<button class="${u.tool === x.id ? 'is-on' : ''}" data-act="up-tool" data-tool="${x.id}"><span class="td" style="background:${x.color}"></span>${esc(toolName(x))}</button>`).join('')}
          </div></div><div class="form-block"><div class="form-label"><span>${esc(t('up.promptLabel'))}<span class="req">*</span></span><small>${esc(cnt('up.chars', (u.prompt || '').length))}</small></div><textarea class="f-input" data-up="prompt" placeholder="${esc(t('up.promptPh'))}">${esc(u.prompt)}</textarea><p class="form-hint">${esc(t('up.promptHint'))}</p></div><div class="form-block"><div class="form-label"><span>${esc(t('up.descLabel'))}</span><small>${(u.desc || '').length}/300</small></div><textarea class="f-input" data-up="desc" maxlength="300" placeholder="${esc(t('up.descPh'))}">${esc(u.desc)}</textarea></div><div class="form-block"><div class="switch-row"><span class="sm"><b>${esc(t('up.public'))}</b><span>${esc(u.promptPublic ? t('up.publicOn') : t('up.publicOff'))}</span></span><button class="switch ${u.promptPublic ? 'is-on' : ''}" data-act="up-public" role="switch" aria-checked="${!!u.promptPublic}" aria-label="${esc(t('aria.public'))}"></button></div></div><p class="form-hint">${t('up.submitHint')}</p></div><div class="sheet-foot"><button class="btn primary block" data-act="submit-upload">${esc(t('up.submit'))}</button></div>`;
  }

  /* ---------------------------------------------------------------- notify sheet */
  function notifyHTML() {
    const list = state.notifications;
    return `
      <div class="grab-row"><span class="grab"></span></div><div class="sheet-head"><h3>${esc(t('noti.head'))}</h3><span class="sub">${esc(cnt('noti.unread', list.filter((n) => !n.read).length))}</span><button class="sheet-close" data-act="close-sheet" aria-label="${esc(t('aria.close'))}"></button></div><div class="sheet-scroll">${list.map((n) => `<div class="notif ${n.read ? '' : 'unread'}"><span class="ni">${n.icon}</span><span class="nm"><b>${esc(pickText(n.texts) || n.text)}</b><span>${timeAgo(n.at)}</span></span></div>`).join('')}
        <p class="tiny" style="margin-top:16px;color:var(--txt-3);line-height:1.6">${esc(t('noti.note'))}</p></div><div class="sheet-foot"><button class="btn block" data-act="read-all">${esc(t('noti.readAll'))}</button></div>`;
  }

  function openNotify() {
    $('#sheet-notify').innerHTML = notifyHTML();
    openSheet('notify');
    state.notifications.forEach((n) => { n.read = true; });
    save();
    renderTopbar();
  }

  /* ---------------------------------------------------------------- sheets core */
  function openSheet(name) {
    $$('.sheet').forEach((s) => s.classList.remove('is-open'));
    $('#scrim').classList.add('is-open');
    const el = $('#sheet-' + name);
    el.classList.add('is-open');
    el.dataset.name = name;
    el.style.transform = '';
    document.body.classList.add('sheet-open');
  }

  function closeSheet() {
    $$('.sheet.is-open').forEach((s) => { s.classList.remove('is-open'); s.style.transform = ''; });
    $('#scrim').classList.remove('is-open');
    document.body.classList.remove('sheet-open');
    ui.detailId = null;
    ui.replyTo = null;
    ui.draft = '';
  }

  /* ---------------------------------------------------------------- language */
  function openLangMenu() {
    const m = $('#lang-menu');
    if (!m) return;
    m.hidden = false;
    $('#lang-btn')?.setAttribute('aria-expanded', 'true');
  }
  function closeLangMenu() {
    const m = $('#lang-menu');
    if (!m || m.hidden) return;
    m.hidden = true;
    $('#lang-btn')?.setAttribute('aria-expanded', 'false');
  }
  function toggleLangMenu() {
    const m = $('#lang-menu');
    if (!m) return;
    if (m.hidden) openLangMenu(); else closeLangMenu();
  }
  function setLanguage(code) {
    closeLangMenu();
    if (!I18N.setLang(code)) return;
    const toastWrap = $('#toasts');
    if (toastWrap) toastWrap.innerHTML = '';
    applyStatic();
    mountShells();
    renderAll();
    if (!state.onboarded) {
      renderObTools();
      $('#ob-nick').value = state.user.nickname || '';
    }
    if (ui.detailId) refreshDetail();
    const up = $('#sheet-upload');
    if (up.classList.contains('is-open')) up.innerHTML = uploadHTML();
    const nt = $('#sheet-notify');
    if (nt.classList.contains('is-open')) nt.innerHTML = notifyHTML();
    save();
  }

  /* ---------------------------------------------------------------- actions */
  function switchTab(id) {
    state.ui.tab = id;
    $$('.screen').forEach((s) => s.classList.toggle('is-active', s.dataset.screen === id));
    $$('#tabbar .tab').forEach((x) => x.classList.toggle('is-active', x.dataset.tab === id));
    $('#screen-' + id).scrollTop = 0;
    if (id === 'ranks') renderRanks();
    if (id === 'market') renderMarket();
    if (id === 'my') renderMy();
    if (id === 'explore') renderExplore();
    save();
  }

  function react(id, k) {
    const p = state.posts.find((x) => x.id === id);
    if (!p) return;
    if (p.me[k]) {
      p.cheers[k] = Math.max(0, p.cheers[k] - 1);
      delete p.me[k];
    } else {
      p.cheers[k] += 1;
      p.me[k] = true;
      state.user.reactionsGiven = (state.user.reactionsGiven || 0) + 1;
      if (k === 'fire' && p.remoteId) pushRemoteLike(p.remoteId);
    }
    save();
    renderFeedList();
    const chip = document.querySelector(`[data-act="react"][data-id="${id}"][data-k="${k}"] .emoji`);
    if (chip) { chip.classList.remove('pop'); void chip.offsetWidth; chip.classList.add('pop'); }
    if (ui.detailId === id) refreshDetail();
    renderRanks();
    renderMy();
  }

  function toggleBookmark(id) {
    const p = state.posts.find((x) => x.id === id);
    if (!p) return;
    p.bookmarked = !p.bookmarked;
    save();
    renderFeedList();
    renderMy();
    if (ui.detailId === id) refreshDetail();
    toast(p.bookmarked ? t('toast.saveAdd') : t('toast.saveRemove'), p.bookmarked ? '' : '↩');
  }

  async function sharePost(id) {
    const p = state.posts.find((x) => x.id === id);
    if (!p) return;
    const url = location.href.split('#')[0] + '#post-' + p.id;
    const ok = await copyText(url);
    toast(ok ? t('toast.linkCopied') : t('toast.shareLink', { url: '#post-' + p.id }), ok ? '' : '');
  }

  function follow(handle) {
    if (!handle) return;
    const i = state.follows.indexOf(handle);
    if (i >= 0) { state.follows.splice(i, 1); toast(t('toast.followCancel', { handle }), '↩'); }
    else { state.follows.push(handle); toast(t('toast.followed', { handle }), ''); }
    save();
    renderFeedList();
    if (ui.detailId) refreshDetail();
  }

  /* ---------------------------------------------------------------- comments */
  function sendComment() {
    const p = state.posts.find((x) => x.id === ui.detailId);
    if (!p) return;
    const ta = $('#cmp-text');
    const text = (ta?.value || '').trim();
    if (!text) { ta?.focus(); toast(t('toast.needText'), ''); return; }

    const author = meAuthor();
    const type = can('suggestion') && ui.commentType === 'suggestion' ? 'suggestion' : 'general';
    const cm = { id: uid(), author, text, type, createdAt: Date.now(), likes: 0, liked: false, replies: [], mine: true };
    const isReply = !!ui.replyTo;

    if (ui.replyTo) {
      const parent = p.comments.find((c) => c.id === ui.replyTo.cid);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push({ id: uid(), author, text, createdAt: Date.now(), mine: true });
      }
    } else {
      p.comments.unshift(cm);
    }
    if (!isReply) pushRemoteComment(p, cm, text, type);
    state.user.commentsMade = (state.user.commentsMade || 0) + 1;
    ui.draft = '';
    ui.replyTo = null;
    beforeAfterLevel(() => {
      save();
      renderFeedList();
      renderMy();
      if (ui.detailId) {
        refreshDetail();
        const sc = $('#detail-scroll');
        if (sc) sc.scrollTop = sc.scrollHeight;
      }
      renderRanks();
    });
    toast(can('suggestion') && type === 'suggestion' ? t('toast.suggestion') : t('toast.comment'), '');
  }

  function likeComment(pid, cid) {
    const p = state.posts.find((x) => x.id === pid);
    if (!p) return;
    for (const c of p.comments) {
      if (c.id === cid) { c.liked = !c.liked; c.likes = Math.max(0, (c.likes || 0) + (c.liked ? 1 : -1)); break; }
      const r = (c.replies || []).find((x) => x.id === cid);
      if (r) break;
    }
    save();
    refreshDetail();
  }

  /* ---------------------------------------------------------------- vote / pick / remix */
  function vote(id) {
    if (!can('vote')) { toast(t('toast.voteLocked'), ''); openRanks(); return; }
    const p = state.posts.find((x) => x.id === id);
    if (!p) return;
    p.voted = !p.voted;
    p.votes = Math.max(0, p.votes + (p.voted ? 1 : -1));
    if (p.voted) state.user.votesMade = (state.user.votesMade || 0) + 1;
    save();
    renderRanks();
    renderFeedList();
    renderMy();
    if (ui.detailId === id) refreshDetail();
    toast(p.voted ? t('toast.voted') : t('toast.voteCancel'), p.voted ? '' : '↩');
  }

  function pick(id) {
    if (!can('pick')) { toast(t('toast.pickLocked'), ''); return; }
    const p = state.posts.find((x) => x.id === id);
    if (!p) return;
    p.picked = !p.picked;
    save();
    renderAll();
    if (ui.detailId === id) refreshDetail();
    toast(p.picked ? t('toast.picked') : t('toast.unpicked'), '');
  }

  function remix(id) {
    if (!can('remix')) { toast(t('toast.remixLocked'), ''); openRanks(); return; }
    const p = state.posts.find((x) => x.id === id);
    if (!p) return;
    ui.upload = {
      title: pTitle(p) + t('remix.suffix'),
      desc: t('remix.origin', { nick: nickOf(p.author), title: pTitle(p) }) + '\n\n',
      prompt: p.prompt, tool: p.tool, category: p.category, image: p.image, promptPublic: true,
      tags: pTags(p).join(' ')
    };
    closeSheet();
    setTimeout(() => { openUpload(); toast(t('toast.remixStart'), ''); }, 180);
  }

  /* ---------------------------------------------------------------- upload flow */
  function pickFile() {
    $('#up-file')?.click();
  }

  async function handleFile(e) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) { toast(t('toast.imageOnly'), '', 'danger'); return; }
    if (f.size > 8 * 1024 * 1024) { toast(t('toast.tooBig'), '', 'danger'); return; }
    try {
      const data = await fileToDataURL(f, 1000);
      ui.upload.image = data;
      $('#sheet-upload').innerHTML = uploadHTML();
      toast(t('toast.imageLoaded'), '');
    } catch (err) {
      toast(t('toast.imageFail'), '', 'danger');
    }
  }

  function fileToDataURL(file, max) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * scale);
          c.height = Math.round(img.height * scale);
          const ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          resolve(c.toDataURL('image/jpeg', 0.82));
        } catch (err) { URL.revokeObjectURL(url); reject(err); }
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode failed')); };
      img.src = url;
    });
  }

  function submitUpload() {
    if (!can('upload')) { toast(t('toast.uploadLocked'), ''); return; }
    const u = ui.upload;
    const errors = [];
    if (!u.image) errors.push(['image', t('err.image')]);
    if (!u.tool) errors.push(['tool', t('err.tool')]);
    if ((u.title || '').trim().length < 2) errors.push(['title', t('err.title')]);
    if ((u.prompt || '').trim().length < 10) errors.push(['prompt', t('err.prompt')]);
    if (errors.length) {
      toast(errors[0][1], '', 'danger');
      const el = $(`[data-up="${errors[0][0]}"]`);
      if (el) { el.classList.add('err', 'shake'); el.focus(); setTimeout(() => el.classList.remove('shake'), 450); }
      return;
    }

    const post = {
      id: 'p_' + uid(), mine: true, author: meAuthor(), tool: u.tool, category: u.category,
      title: u.title.trim(), desc: u.desc.trim() || t('post.shared'), prompt: u.prompt.trim(),
      image: u.image, promptPublic: !!u.promptPublic, copies: 0, votes: 0, voted: false,
      picked: false, bookmarked: false, cheers: { fire: 0, bulb: 0, clap: 0 }, me: {},
      comments: [], tags: [challengeOf().tag], views: null, createdAt: Date.now()
    };

    const before = earnedLevel();
    state.posts.unshift(post);
    state.challenge.participants += 1;
    save();
    ui.upload = { title: '', desc: '', prompt: '', tool: '', category: 'image', image: '', promptPublic: true, tags: '' };
    closeSheet();
    switchTab('feed');
    state.ui.filter = 'all';
    state.ui.query = '';
    state.ui.sort = 'new';
    renderFeed();
    renderExplore();
    renderRanks();
    renderMy();
    $('#screen-feed').scrollTop = 0;
    toast(t('toast.uploaded'), '');
    pushRemotePost(post);

    const after = earnedLevel();
    if (after > before && !isDemo()) {
      setTimeout(() => levelUpToast(after), 700);
    } else if (!isDemo() && currentLevel() < 2) {
      const left = Math.max(0, 3 - stats().prompts);
      setTimeout(() => toast(left ? t('toast.promptsLeft', { n: left }) : t('toast.promptsAll'), ''), 900);
    }
  }

  function levelUpToast(lv) {
    const l = LEVELS[lv];
    toast(t('toast.levelUp', { emoji: l.emoji, lv, name: l.name, short: t('level.' + lv + '.short') }), '', 'gold', 4200);
  }

  function beforeAfterLevel(fn) {
    const before = earnedLevel();
    fn();
    const after = earnedLevel();
    if (after > before && !isDemo()) {
      setTimeout(() => levelUpToast(after), 500);
      renderAll();
    }
  }

  function setDemo(lv) {
    if (lv === 'auto') {
      state.user.demoLevel = null;
      toast(t('toast.autoLevel'), '');
    } else {
      const n = clamp(Number(lv), 1, 4);
      state.user.demoLevel = n;
      toast(t('toast.demoLevel', { n, name: LEVELS[n].name }), LEVELS[n].emoji);
    }
    save();
    renderAll();
    if (ui.detailId) refreshDetail();
  }

  function openRanks() {
    closeSheet();
    switchTab('ranks');
    setTimeout(() => {
      $('#screen-ranks').scrollTo({ top: 0, behavior: 'smooth' });
    }, 120);
  }

  function openMarket(focus) {
    closeSheet();
    switchTab('market');
    setTimeout(() => {
      const el = focus === 'pro' ? $('#pro-pass') : null;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('flash');
        setTimeout(() => el.classList.remove('flash'), 1600);
      } else {
        $('#screen-market').scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 140);
  }

  function setPro(on) {
    state.user.proPass = !!on;
    save();
    renderAll();
    if (ui.detailId) refreshDetail();
    toast(on ? t('toast.proOn') : t('toast.proOff'), on ? '' : '');
  }

  function openChallenge() {
    switchTab('ranks');
    setTimeout(() => {
      const el = $('#challenge-block');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('flash');
        setTimeout(() => el.classList.remove('flash'), 1500);
      }
    }, 180);
  }

  function saveChallenge() {
    const title = $('#ch-title')?.value.trim();
    const desc = $('#ch-desc')?.value.trim();
    if (!title) { toast(t('toast.needChTitle'), ''); $('#ch-title')?.focus(); return; }
    const tag = '#' + title.replace(/\s+/g, '');
    const texts = {};
    ['ko', 'en', 'zh', 'ja'].forEach((code) => { texts[code] = { title, sub: '', desc: desc || '', tag }; });
    state.challenge = {
      id: 'ch_' + uid(), texts, tag,
      endAt: Date.now() + 7 * 86400e3, participants: 0, createdBy: state.user.nickname
    };
    ui.challengeForm = false;
    save();
    renderRanks();
    renderFeed();
    toast(t('toast.challengeCreated'), '');
  }

  function challengeJoin() {
    if (!can('upload')) { toast(t('toast.joinLocked'), ''); openUpload(); return; }
    openUpload();
    setTimeout(() => toast(t('toast.joinTag', { tag: challengeOf().tag }), ''), 350);
  }

  /* ---------------------------------------------------------------- onboarding */
  function showOnboarding() {
    const ob = $('#onboard');
    ob.hidden = false;
    $('#ob-nick').value = state.user.nickname || '';
    obTools = new Set(state.user.interests || []);
    renderObTools();
    setTimeout(() => { if (window.innerWidth > 420) $('#ob-nick').focus(); }, 350);
  }

  function hideOnboarding() {
    $('#onboard').hidden = true;
  }

  function renderObTools() {
    $('#ob-tools').innerHTML = TOOLS.map((x) => `
      <button class="tool-chip ${obTools.has(x.id) ? 'is-on' : ''}" data-act="ob-tool" data-tool="${x.id}"><span class="dot" style="background:${x.color}"></span>${esc(toolName(x))}
      </button>`).join('');
  }

  function startOnboarding() {
    const nick = $('#ob-nick').value.trim();
    const nEl = $('#ob-nick');
    const tHint = $('#ob-tools-hint');
    if (nick.length < 2) {
      nEl.classList.add('err', 'shake');
      $('#ob-nick-hint').textContent = t('ob.errNick');
      $('#ob-nick-hint').classList.add('err');
      setTimeout(() => nEl.classList.remove('shake'), 450);
      nEl.focus();
      return;
    }
    if (obTools.size < 1) {
      tHint.textContent = t('ob.errTools');
      tHint.classList.add('err');
      $('#ob-tools').classList.add('shake');
      setTimeout(() => $('#ob-tools').classList.remove('shake'), 450);
      return;
    }
    state.user.nickname = nick;
    state.user.handle = '@' + nick.replace(/\s+/g, '').toLowerCase();
    state.user.interests = Array.from(obTools);
    state.user.hue = hashHue(nick);
    state.onboarded = true;
    save();
    hideOnboarding();
    renderAll();
    setTimeout(() => toast(t('ob.welcome', { nick }), '', 'gold', 3200), 250);
  }

  /* ---------------------------------------------------------------- misc */
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* fall through */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (e) { return false; }
  }

  async function copyPrompt(id) {
    const p = state.posts.find((x) => x.id === id);
    if (!p) return;
    if (lockedFor(p)) { toast(t('toast.copyLocked'), ''); openRanks(); return; }
    const ok = await copyText(p.prompt);
    if (ok) {
      p.copies += 1;
      save();
      if (ui.detailId === id) refreshDetail();
      renderFeedList();
      toast(t('toast.copied'), '');
    } else {
      const box = $('#pc-text');
      if (box) {
        const r = document.createRange();
        r.selectNodeContents(box);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
      }
      toast(t('toast.copySelect'), '');
    }
  }

  let toastTimer = new Map();
  function toast(msg, icon = '', kind = '', ms = 2600) {
    const wrap = $('#toasts');
    if (!wrap) return;
    const el = document.createElement('div');
    el.className = 'toast ' + kind;
    el.innerHTML = `<span class="ti">${icon}</span><span>${esc(msg)}</span>`;
    wrap.appendChild(el);
    while (wrap.children.length > 3) wrap.firstElementChild.remove();
    const tm = setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 300);
      toastTimer.delete(el);
    }, ms);
    toastTimer.set(el, tm);
  }

  function resetDemo() {
    if (!ui.resetArmed) {
      ui.resetArmed = true;
      renderMy();
      toast(t('toast.resetArm'), '', 'danger', 3400);
      setTimeout(() => { if (ui.resetArmed) { ui.resetArmed = false; renderMy(); } }, 4000);
      return;
    }
    window.__prismNoSave = true;
    clearTimeout(saveTimer);
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    location.reload();
  }

  /* ---------------------------------------------------------------- events */
  function bindEvents() {
    document.addEventListener('click', (e) => {
      const obLang = e.target.closest('.ob-lang');
      if (obLang) {
        setLanguage(obLang.dataset.oblang);
        return;
      }
      const langOpt = e.target.closest('#lang-menu .lang-opt');
      if (langOpt) {
        setLanguage(langOpt.dataset.lang);
        return;
      }
      if (e.target.closest('#lang-btn')) {
        toggleLangMenu();
        return;
      }
      if (!e.target.closest('#lang-wrap')) closeLangMenu();

      const el = e.target.closest('[data-act]');
      if (!el) return;
      const act = el.dataset.act;
      const id = el.dataset.id;
      switch (act) {
        case 'tab': switchTab(el.dataset.tab); break;
        case 'upload': openUpload(); break;
        case 'close-sheet': closeSheet(); break;
        case 'open': openDetail(id); break;
        case 'react': react(id, el.dataset.k); break;
        case 'bookmark': toggleBookmark(id); break;
        case 'share': sharePost(id); break;
        case 'follow': follow(el.dataset.handle); break;
        case 'copy': copyPrompt(id); break;
        case 'remix': remix(id); break;
        case 'vote': vote(id); break;
        case 'pick': pick(id); break;
        case 'filter':
          state.ui.filter = el.dataset.f;
          renderChips();
          renderFeedList();
          save();
          break;
        case 'sort':
          state.ui.sort = el.dataset.s;
          renderChips();
          renderFeedList();
          save();
          break;
        case 'clear-search':
          state.ui.query = '';
          $('#feed-search').value = '';
          $('#explore-search').value = '';
          renderFeedList();
          renderExplore();
          break;
        case 'tag':
          state.ui.query = el.dataset.tag.replace('#', '');
          state.ui.filter = 'all';
          switchTab('feed');
          renderFeed();
          break;
        case 'tool':
          state.ui.query = toolName(toolOf(el.dataset.tool));
          switchTab('feed');
          state.ui.filter = 'all';
          renderFeed();
          break;
        case 'cat':
          state.ui.filter = el.dataset.cat;
          state.ui.query = '';
          switchTab('feed');
          renderFeed();
          break;
        case 'comment-like': likeComment(el.dataset.pid, el.dataset.cid); break;
        case 'reply': {
          const p = state.posts.find((x) => x.id === el.dataset.pid);
          const cm = p?.comments.find((x) => x.id === el.dataset.cid);
          if (cm) {
            const ta = $('#cmp-text');
            if (ta) ui.draft = ta.value;
            ui.replyTo = { cid: cm.id, nick: nickOf(cm.author) };
            ui.focusComposer = true;
            refreshDetail();
            $('#cmp-text')?.focus();
          }
          break;
        }
        case 'cancel-reply':
          ui.replyTo = null;
          refreshDetail();
          break;
        case 'type':
          if (el.dataset.type === 'suggestion' && !can('suggestion')) {
            toast(t('toast.suggestLocked'), '');
            break;
          }
          ui.commentType = el.dataset.type;
          refreshDetail();
          break;
        case 'send-comment': sendComment(); break;
        case 'demo': setDemo(el.dataset.lv); break;
        case 'demo-and-upload':
          setDemo(2);
          openUpload();
          toast(t('toast.demoAndUpload'), '');
          break;
        case 'open-ranks': openRanks(); break;
        case 'open-market': openMarket(el.dataset.focus); break;
        case 'pro-demo': setPro(!isPro()); break;
        case 'challenge': openChallenge(); break;
        case 'daily-more': dailyOpen = !dailyOpen; renderDailyFeed(); break;
        case 'challenge-join': challengeJoin(); break;
        case 'challenge-new': ui.challengeForm = true; renderRanks(); break;
        case 'challenge-cancel': ui.challengeForm = false; renderRanks(); break;
        case 'challenge-save': saveChallenge(); break;
        case 'notify': openNotify(); break;
        case 'read-all':
          state.notifications.forEach((n) => { n.read = true; });
          save();
          renderTopbar();
          closeSheet();
          toast(t('toast.readAll'), '');
          break;
        case 'toggle-noti':
          state.user.notificationsOn = !state.user.notificationsOn;
          save();
          renderMy();
          renderTopbar();
          toast(state.user.notificationsOn ? t('toast.notiOn') : t('toast.notiOff'), state.user.notificationsOn ? '' : '');
          break;
        case 'reset': resetDemo(); break;
        case 'pick-file': pickFile(); break;
        case 'pick-sample':
          ui.upload.image = el.dataset.src;
          $('#sheet-upload').innerHTML = uploadHTML();
          break;
        case 'up-cat':
          ui.upload.category = el.dataset.cat;
          $('#sheet-upload').innerHTML = uploadHTML();
          break;
        case 'up-tool':
          ui.upload.tool = el.dataset.tool;
          $('#sheet-upload').innerHTML = uploadHTML();
          break;
        case 'up-public':
          ui.upload.promptPublic = !ui.upload.promptPublic;
          $('#sheet-upload').innerHTML = uploadHTML();
          break;
        case 'submit-upload': submitUpload(); break;
        case 'ob-tool':
          if (obTools.has(el.dataset.tool)) obTools.delete(el.dataset.tool);
          else obTools.add(el.dataset.tool);
          renderObTools();
          if (obTools.size) {
            $('#ob-tools-hint').textContent = t('ob.toolsHint');
            $('#ob-tools-hint').classList.remove('err');
          }
          break;
        case 'onboard-start': startOnboarding(); break;
        default: break;
      }
    });

    document.addEventListener('input', (e) => {
      const el = e.target;
      if (el.id === 'feed-search' || el.id === 'explore-search') {
        state.ui.query = el.value;
        $('#feed-search').value = el.value;
        $('#explore-search').value = el.value;
        renderFeedList();
        renderExplore();
        return;
      }
      if (el.id === 'cmp-text') {
        ui.draft = el.value;
        autosize(el);
        return;
      }
      if (el.dataset && el.dataset.up) {
        ui.upload[el.dataset.up] = el.value;
      }
    });

    document.addEventListener('change', (e) => {
      if (e.target.id === 'up-file') handleFile(e);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!$('#lang-menu').hidden) { closeLangMenu(); return; }
        closeSheet();
        return;
      }
      if (e.target.id === 'cmp-text' && e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendComment();
        return;
      }
      if (e.target.id === 'ob-nick' && e.key === 'Enter') {
        e.preventDefault();
        startOnboarding();
      }
      if ((e.target.dataset?.act === 'open' || e.target.getAttribute?.('role') === 'button') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.target.click();
      }
    });

    // drag to dismiss
    let drag = null;
    document.addEventListener('pointerdown', (e) => {
      const g = e.target.closest('.grab-row');
      if (!g) return;
      const sheet = g.closest('.sheet');
      drag = { sheet, y: e.clientY, dy: 0 };
      sheet.classList.add('dragging');
    });
    document.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dy = Math.max(0, e.clientY - drag.y);
      drag.dy = dy;
      drag.sheet.style.transform = `translateY(${dy}px)`;
    });
    document.addEventListener('pointerup', () => {
      if (!drag) return;
      const { sheet, dy } = drag;
      sheet.classList.remove('dragging');
      sheet.style.transform = '';
      if (dy > 100) closeSheet();
      drag = null;
    });
    document.addEventListener('pointercancel', () => {
      if (!drag) return;
      drag.sheet.classList.remove('dragging');
      drag.sheet.style.transform = '';
      drag = null;
    });

    window.addEventListener('beforeunload', () => { clearTimeout(saveTimer); saveNow(); });

    renderObTools();
    if (!state.onboarded) $('#ob-nick').value = state.user.nickname || '';
  }

  /* expose a small read-only handle for QA */
  window.PRISM_DEMO = {
    get state() { return state; },
    get lang() { return L(); },
    setLang: (code) => setLanguage(code),
    setPro: (on) => setPro(on),
    version: '1.2.0'
  };

  init();
})();
