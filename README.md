# PRISM — AI 창작 · 프롬프트 커뮤니티 (모바일 퍼스트 데모)

AI로 만든 결과물을 올리면, **등급이 다른 크리에이터들이 프롬프트·개선 제안·피드백으로 이어 붙이는** 커뮤니티 웹앱입니다.
빌드 서버도, CDN도, 로그인 서버도 없이 **`index.html` 하나만 열면 100% 동작**합니다.

> **v1.2 — 수익화 버전.** 마켓 탭에서 실제 판매 중인 래피드 상품 2종을 연결하고, Lv.1 사용자가 잠긴 프롬프트를 "레벨업" 또는 "세팅 팩 구매"로 열 수 있는 동선을 넣었습니다. 결제는 외부(래피드) 링크로만 연결되며, 앱 안에서는 어떤 결제도 일어나지 않습니다.

- 모바일 390~430px에 최적화된 앱형 UI, 데스크톱에서는 중앙 폰 프레임 + 가이드 패널
- 다크 글래스 UI · Pretendard(로컬 번들) · 인라인 SVG 아이콘 · 로컬 SVG 아트워크
- 등급(Seed → Builder → Master → Curator)별 권한이 실제로 잠기고 열립니다
- **마켓**: 래피드 실상품 2종 · Pro 패스(프롬프트 언락) · 가격/구성/환불 투명 표기
- 업로드·댓글·리액션·북마크·리믹스·투표·큐레이터 픽이 모두 `localStorage`에 저장됩니다

---

## 1. 실행 방법

**가장 간단하게**

```
ai-community-site/index.html 을 브라우저로 연다
```

파일을 더블클릭하면 끝입니다. 외부 요청이 0건이라 오프라인에서도 그대로 뜹니다.

**로컬 서버로 열고 싶다면**

```bash
cd ai-community-site
python3 -m http.server 8080
# http://localhost:8080
```

**배포**

폴더를 그대로 올리면 됩니다. 빌드 단계가 없습니다.

- **GitHub Pages (현재 경로)**: 저장소 `CM-jccho/prism-community`의 `main` 브랜치 루트에 이 폴더 내용이 올라가 있습니다. 저장소 Settings → Pages → Source `Deploy from a branch` → `main` / `/(root)` → Save를 한 번 누르면 `https://cm-jccho.github.io/prism-community/`에서 열립니다.
- Vercel: 프로젝트 Root Directory를 이 폴더로 지정 → Deploy
- Netlify: 폴더를 드래그 앤 드롭

---

## 2. 첫 화면 (온보딩)

1. **닉네임** 입력 (2~14자)
2. **관심 AI 툴** 1개 이상 선택 (Claude, ChatGPT, Midjourney, Sora, Kling, Cursor, Runway, Suno, n8n …)
3. **시작하기** → `🌱 Lv.1 Seed`로 가입 완료

로그인 서버가 없는 데모이므로 입력값은 브라우저에만 저장됩니다. 다시 열면 온보딩은 건너뜁니다.

---

## 3. 등급과 권한

| 권한 | 🌱 Lv.1 Seed | ⚡ Lv.2 Builder | 🔥 Lv.3 Master | 👑 Lv.4 Curator |
|---|:---:|:---:|:---:|:---:|
| 작품 감상 · 공감 리액션 | ✓ | ✓ | ✓ | ✓ |
| 일반 의견 댓글 | ✓ | ✓ | ✓ | ✓ |
| 프롬프트 원문 열람 | · | ✓ | ✓ | ✓ |
| 프롬프트 복사 | · | ✓ | ✓ | ✓ |
| 프롬프트 개선 제안 댓글 | · | ✓ | ✓ | ✓ |
| 작품 업로드 | · | ✓ | ✓ | ✓ |
| 리믹스(포크) 게시 | · | · | ✓ | ✓ |
| 베스트 프롬프트 투표 | · | · | ✓ | ✓ |
| 큐레이터 픽 지정 | · | · | · | ✓ |
| 주간 챌린지 개설 | · | · | · | ✓ |

- **자동 승급**: 프롬프트 3개 업로드 → Builder, 받은 추천 30개 → Master (액션 직후 골드 토스트로 알림)
- **데모 등급 스위치**: `등급·랭킹` 탭의 내 등급 카드에서 `🌱 ⚡ 🔥 👑 / 자동`을 눌러 즉시 전환.
  전환하면 배지에 `데모` 표시가 붙고, `자동`을 누르면 활동 기반으로 돌아갑니다. (업로드 화면의 잠금 안내에서도 `Lv.2 켜고 업로드` 가능)
- 등급이 낮으면 카드·상세의 프롬프트가 **블러 + 자물쇠 안내**로 잠기고, 투표·리믹스·픽 버튼도 잠금 상태로 표시됩니다.

---

## 4. 화면과 기능

### 피드
- 상단: 인사말 + 내 등급 진행 바, 이번 주 챌린지 배너, 검색, 카테고리 필터(전체/이미지/앱·툴/영상/자동화), 최신·인기 정렬
- 스크롤하면 검색·필터 바가 상단에 고정됩니다
- 카드: 작성자 등급 배지 · 툴 · 카테고리 · 시간, 큐레이터 픽 배지, 프롬프트 미리보기(등급 미달 시 잠금), 🔥💡👏 리액션, 댓글 수, 북마크, 공유, 팔로우

### 작품 상세 (바텀시트)
- 결과물 · 작성자 · 제목 · 설명 · 태그
- 프롬프트 카드: **원클릭 복사**, 공개/비공개 표시, 복사 횟수, 리믹스(포크)
- 리액션 3종 토글, 저장·공유, **베스트 프롬프트 투표**(Lv.3+), **큐레이터 픽**(Lv.4)
- 댓글/답글: 등급 배지 표시, `💬 의견` / `💡 프롬프트 개선 제안`(Lv.2+) 유형 선택, 답글, 좋아요
- 하단 고정 입력창, `Shift+Enter` 줄바꿈, `Enter` 등록

### 업로드 (＋ 버튼)
- 결과물 이미지: 샘플 아트워크 6종 선택 **또는 파일 업로드**(자동 리사이즈 → JPEG)
- 제목, 카테고리, AI 툴, 사용한 프롬프트, 설명, 프롬프트 공개 여부
- 올리면 즉시 피드 최상단 반영 +120 XP, 챌린지 참여 수 증가
- Lv.1에서 열면 잠금 안내와 함께 `Lv.2 켜고 업로드` 데모 버튼 제공

### 탐색
- 검색(작품·프롬프트·크리에이터·툴·태그), 지금 뜨는 태그, 툴별 모아보기, 카테고리, 큐레이터 픽 그리드, 새로 올라온 작품

### 등급·랭킹
- 내 등급 카드: 등급 링, 다음 등급까지 진행 바, 활동 XP, 데모 등급 스위치
- 등급별 혜택 비교표(현재 등급 열 강조)
- 주간 인기 크리에이터 랭킹(내 순위 포함), 베스트 프롬프트 투표 순위
- 주간 챌린지 현황 · 참여하기, **Lv.4는 새 챌린지 개설 폼**

### 마이
- 프로필 카드(아바타·등급·가입일·관심 툴, Pro 배지), 활동 통계 4종, 등급 진행 바
- 내 작품 / 저장한 작품 목록
- 설정: **Pro 패스 상태·마켓 이동**, 데모 등급 전환, 알림 토글, **데모 데이터 초기화**(두 번 눌러 확인), 저장 방식 안내

### 마켓 (수익화 허브)
- **Pro 패스 카드**: Lv.1 Seed의 프롬프트 잠금을 두 가지로 엽니다 — ① 활동으로 Lv.2 (무료) ② MOA Hive 세팅 팩 구매 후 언락. 결제 버튼은 래피드 상품 페이지로 새 탭에서 열립니다.
  - "데모에서 Pro 체험 켜기"는 **실제 결제 없이 이 브라우저에서만** 잠금을 풀어 보는 데모 스위치입니다(라벨에 명시).
- **크리에이터 상점**: 판매 중인 실상품 2종
  | 상품 | 가격 | 링크 |
  |---|---|---|
  | MOA Hive — AI 팀 세팅 팩 (업종 6종·프롬프트 50개) | 9,900원 (정가 29,000원, 66% 할인) | https://www.latpeed.com/products/VTtxq |
  | 무쇠팬 도감 — The Cast Iron Field Guide (한·영 PDF 20p) | 4,900원 (정가 9,900원, 51% 할인) | https://www.latpeed.com/products/8q7nI |
- **가격·구성 투명 표기**: VAT 포함 결제 금액, 정가/할인가 병기, 디지털 파일·실물 배송 없음, 다운로드 전 환불 가능, PRISM은 판매자가 아니라 링크 안내 커뮤니티임을 명시
- **다음 단계 안내**: 큐레이터 프롬프트 마켓(준비 중) — 지금은 등급·리믹스로만 참여

### 잠금 해제 전환 동선
- 피드 카드: 잠긴 프롬프트 아래 `레벨업으로 열기 · 또는 · 세팅 팩으로 즉시 언락`
- 작품 상세: 잠금 안내 안에 같은 두 버튼
- 피드 상단: Lv.1에게만 보이는 한 줄 `PRO` 프로모 스트립(Pro 체험 중이면 사라짐)
- 마켓 CTA로 넘어가면 Pro 카드가 화면에 맞춰 스크롤되고 1.6초 강조 표시

---

## 5. 다국어 (KO · EN · ZH · JA)

상단 헤더의 **🌐 KO** 칩(온보딩 화면에서는 오른쪽 위 언어 버튼)을 눌러 **한국어 / English / 中文 / 日本語**를 즉시 전환합니다.
선택 언어는 `localStorage`의 `prism.lang`에 저장되어 새로고침·재방문 후에도 유지되고, `<html lang>`과 문서 제목도 함께 바뀝니다.

**바뀌는 것** — 네비게이션·탭 이름(피드/탐색/**마켓**/등급·랭킹/마이), 온보딩, 등급명과 권한 비교표(Seed/Builder/Master/Curator + 각 언어 표기), 챌린지 배너, 검색·필터·정렬, 업로드/상세/알림 시트의 모든 라벨·버튼·플레이스홀더·`aria-label`, 리액션 이름, 댓글 입력창, 토스트 메시지, 데스크톱 가이드 패널, **마켓 화면 전체(Pro 패스·상품명·구성·가격 표기·환불/법적 고지)**, 샘플 작품 12편의 제목·설명·태그·댓글·작성자 표시 이름까지.

**바뀌지 않는 것** — 사용자가 입력한 닉네임과 작품 텍스트(원문 그대로), 프롬프트 원문(영문 프롬프트는 번역하지 않음), `@핸들`, PRISM 로고. 숫자·날짜·상대시간은 언어에 맞게 바뀝니다(`1.2K` / `1.2만` / `1.2万`, `42m ago` / `42분 전` / `42分钟前` / `42分前`). 가격은 KO에서 `9,900원`, 그 외 언어에서 `₩9,900`으로 표기합니다.

| 파일 | 역할 |
|---|---|
| `i18n.js` | `KO` / `EN` / `ZH` / `JA` 사전, 언어 상태·저장, `t()`·숫자·상대시간 포맷 |
| `content.js` | 샘플 작품·댓글·챌린지·알림의 4개 국어 콘텐츠 |
| `index.html` | `data-i18n` / `data-i18n-html` / `data-i18n-ph` / `data-i18n-aria` 속성으로 정적 문구 연결 |
| `app.js` | 모든 렌더링 문자열을 `t('key')`로, 언어 변경 시 전체 재렌더 |

번역 키는 의미 단위(`nav.feed`, `ranks.benefits` …)이고 한국어 사전이 기본값이자 폴백입니다. 언어를 추가하려면 `i18n.js`의 `LANGS`와 사전에 항목을 넣고, `index.html`의 `#lang-menu`와 `.ob-langs`에 버튼을 하나씩 추가하면 됩니다.

---

## 6. 데이터 · 저장

- 저장 위치: 브라우저 `localStorage` — 앱 상태 `prism.demo.v2`, 선택 언어 `prism.lang` (서버 전송 없음)
- 저장 항목: 가입 정보, 등급, **Pro 체험 상태(`user.proPass`, 데모 전용)**, 업로드한 작품(이미지는 리사이즈된 data URL), 댓글·답글, 리액션, 북마크, 투표, 팔로우, 챌린지, 알림 읽음 여부
- 초기화: `마이 → 데모 데이터 초기화` 두 번 탭, 또는 브라우저 콘솔에서
  ```js
  localStorage.removeItem('prism.demo.v2'); location.reload();
  ```
- 저장 공간이 부족하면 토스트로 안내하고 앱은 계속 동작합니다(메모리 상태 유지)
- QA용 읽기 전용 핸들: `window.PRISM_DEMO.state`, `window.PRISM_DEMO.lang`, `window.PRISM_DEMO.setLang('en')`, `window.PRISM_DEMO.setPro(true)`
- **결제 없음**: Pro 체험은 로컬 플래그만 바꾸며, 실제 상품 구매는 마켓의 래피드 링크(외부)에서 이뤄집니다. 앱은 카드 정보를 받지 않습니다.

---

## 7. 매일 자동 업데이트되는 AI 소식 피드

피드 상단의 **"오늘의 AI 소식"** 섹션은 저장소의 `data/community-feed.json`을 읽어 그립니다. 그 파일은 GitHub Actions가 매일 09:10 KST에 공개 소스에서 실제 항목만 모아 갱신합니다.

**수집 소스 (전부 공개·무료·API 키 불필요)**

| 소스 | 엔드포인트 | 담는 것 |
|---|---|---|
| Hugging Face 모델 | `huggingface.co/api/models?sort=trendingScore` | 트렌딩 모델 12건 (좋아요·다운로드·태스크) |
| Hugging Face Daily Papers | `huggingface.co/api/daily_papers` | 오늘의 논문 10건 |
| Hugging Face Spaces | `huggingface.co/api/spaces?sort=trendingScore` | 바로 실행 가능한 데모 12건 |
| GitHub | `api.github.com/search/repositories` | 최근 2주 안에 푸시된 프롬프트/AI 저장소 16건 |
| Hacker News | `hn.algolia.com/api/v1/search` | 3일 안 포인트 40+ 스토리 10건 |

**동작 규칙**

- 항목 id는 `소스:원본id`라서 다시 돌려도 중복이 생기지 않습니다.
- 한 소스가 실패해도 나머지는 저장되고, **모든 소스가 실패하면 기존 파일을 건드리지 않고 종료코드 1**로 끝납니다(워크플로가 빈 파일을 커밋하지 않음).
- 내용이 실제로 바뀔 때만 파일을 다시 쓰고 커밋합니다.
- 사이트는 `raw.githubusercontent.com/CM-jccho/prism-community/main/data/community-feed.json`을 먼저 읽고, 실패하면 배포본에 포함된 `data/community-feed.json`으로 폴백합니다 → **재배포 없이 매일 갱신**.
- 네트워크가 없거나 JSON이 없으면 섹션만 조용히 사라지고 앱은 그대로 동작합니다.

**직접 실행**

```bash
python3 scripts/update_feed.py          # 수집 → data/community-feed.json
python3 -c "import json;d=json.load(open('data/community-feed.json'));print(d['updatedAtKst'],d['count'])"
```

**워크플로**: `.github/workflows/daily-feed.yml` (매일 09:10 KST + 수동 실행, `contents: write`, 변경분만 커밋)

> ⚠️ 이 워크플로 파일은 GitHub App의 `workflows` 권한이 없어 자동화 도구로 푸시할 수 없습니다. GitHub 웹에서 파일을 추가해야 스케줄이 켜집니다.

---

## 8. Supabase 연동 (실제 방문자가 서로의 글을 보는 커뮤니티)

지금 상태로도 앱은 완전히 동작합니다(로컬 `localStorage`). 아래 세 단계를 채우면 **모든 방문자가 같은 글·댓글을 보고 쓸 수 있는 실제 커뮤니티**가 됩니다.

1. **프로젝트 생성** — supabase.com 무료 플랜 → New project (리전: Northeast Asia (Tokyo) 권장)
2. **스키마 실행** — SQL Editor에 `supabase/schema.sql` 전체를 붙여 넣고 Run
   - `prism_posts`(작품명·프롬프트·도구·카테고리·태그·이미지·닉네임·좋아요·created_at)
   - `prism_comments`(post_id·닉네임·본문·종류·좋아요·created_at)
   - RLS: 읽기 전체 공개 · 익명 insert 허용(좋아요 0으로만) · update/delete 정책 없음 → 남의 글을 고치거나 지울 수 없음
   - 좋아요는 `security definer` RPC `prism_like_post` / `prism_like_comment`로만 +1
3. **키 연결** — `supabase.js` 맨 위 `CONFIG`에 Project URL과 **anon(publishable) 키**를 넣습니다. `service_role` 키는 절대 넣지 마세요.

```js
const CONFIG = window.PRISM_SUPABASE || {
  url: 'https://<project-ref>.supabase.co',
  anonKey: '<anon public key>'
};
```

연결되면 앱은 시작할 때 최근 글 60건을 불러와 피드에 합치고, 새 작품 업로드·댓글·🔥 좋아요를 서버에 기록합니다. 서버 호출이 실패하면 토스트로 알리고 로컬 상태는 유지합니다.

> 공개 쓰기 정책은 누구나 글을 쓸 수 있다는 뜻입니다. 스팸이 문제가 되면 Supabase Auth(익명 로그인)나 Edge Function의 rate limit을 추가하는 것을 권장합니다.

---

## 9. 파일 구조

```
ai-community-site/
├── index.html                  # 앱 셸 (탭, 시트, 온보딩 마크업, 언어 메뉴)
├── styles.css                  # 디자인 시스템 · 레이아웃 · 애니메이션
├── i18n.js                     # KO/EN/ZH/JA 사전 + 언어 전환·포맷
├── content.js                  # 샘플 작품·댓글·챌린지 4개 국어 콘텐츠
├── app.js                      # 상태 · 등급 로직 · 마켓 · 렌더링 · 인터랙션
├── supabase.js                 # (선택) Supabase REST 클라이언트 — 키가 비면 완전 무동작
├── data/community-feed.json    # 매일 자동 갱신되는 AI 소식 (워크플로가 커밋)
├── scripts/update_feed.py      # 공개 소스 수집 스크립트
├── supabase/schema.sql         # 테이블 2개 + RLS + 좋아요 RPC
├── .github/workflows/daily-feed.yml  # 매일 09:10 KST 수집·커밋 (웹에서 추가 필요)
├── favicon.svg
├── images/                     # 로컬 SVG 아트워크 12종 + 상품 커버 2종 (외부 CDN 없음)
│   ├── art-neon-city.svg       ├── art-brand.svg
│   ├── art-app-ui.svg          ├── art-shapes.svg
│   ├── art-film.svg            ├── art-audio.svg
│   ├── art-automation.svg      ├── art-storybook.svg
│   ├── art-botanical.svg       ├── art-nebula.svg
│   ├── art-portrait.svg        ├── art-poster.svg
│   ├── shop-moa-hive.svg       └── shop-cast-iron.svg
├── promo/                      # 런칭 홍보 문구 (KO/EN/ZH/JA + 발행 순서·법적 체크)
│   ├── ko.md · en.md · zh.md · ja.md
│   └── README.md
├── assets/fonts/
│   ├── PretendardVariable.woff2
│   └── OFL.txt                 # Pretendard 라이선스 (SIL Open Font License)
├── preview-feed.png            # 검증 스크린샷 (390×844 @2x, KO)
├── preview-detail.png
├── preview-ranks.png
├── preview-en.png              # 영어 화면 검수용
├── preview-en-ranks.png
└── README.md
```

---

## 10. 기술 메모

- **프레임워크 없음**: 바닐라 JS + CSS. `index.html`을 직접 열어도 동작하도록 `file://` 환경까지 고려했습니다.
- **핵심 자산 외부 요청 0건**: 아이콘은 전부 인라인 SVG, 아트워크는 로컬 SVG, 폰트는 로컬 woff2. CDN이 죽어도 깨지지 않습니다. 예외는 7장의 AI 소식 JSON 1건(실패해도 섹션만 숨김)과, Supabase 키를 넣었을 때의 글·댓글 API 호출뿐입니다.
- **모바일 퍼스트**: 390px 기준 설계, 430px까지 자연스럽게 확장, 560px 이하에서는 전체 화면.
  데스크톱(1180px+)에서는 중앙 폰 프레임과 좌우 가이드 패널이 함께 보입니다.
- **접근성**: 시맨틱 버튼, `aria-pressed`/`aria-label`, 키보드 `Esc`로 시트 닫기, `prefers-reduced-motion` 대응.
- **바텀시트**: 스크림 탭 닫기, 핸들 드래그로 닫기, 내부 스크롤과 하단 고정 입력창.

### 커스터마이징 포인트

| 바꾸고 싶은 것 | 위치 |
|---|---|
| 색상 · 라운드 · 탭 높이 | `styles.css` 맨 위 `:root` 변수 |
| 등급 이름 · 조건 · 혜택 문구 | `app.js`의 `LEVELS`, `PERMS`, `BENEFITS` |
| **마켓 상품 링크 · 가격 · 커버** | `app.js`의 `SHOP` (id·url·freeUrl·price·list·img) |
| AI 툴 목록 · 브랜드 색 | `app.js`의 `TOOLS` |
| 카테고리 | `app.js`의 `CATS` |
| 예시 작품 · 댓글 · 챌린지 (4개 국어) | `content.js`의 `PRISM_SEED_DATA` |
| UI 문구 · 번역 | `i18n.js`의 `KO` / `EN` / `ZH` / `JA` 사전 |
| 언어 목록 · 기본 언어 | `i18n.js`의 `LANGS` (`prism.lang`이 없을 때는 한국어) |
| 아트워크 | `images/*.svg` 교체 (카드가 4:5로 잘라 보여줍니다) |

---

## 11. 검증 결과 (v1.2 · 2026-11-20)

헤드리스 Chromium 자동화 **59개 체크 전부 통과**. 스크립트 `scratch/prism_verify.py`, 결과 `scratch/prism_verify_results.json`.

| 항목 | 결과 |
|---|---|
| 콘솔 에러·페이지 에러·실패한 요청 | 390×844 모바일 / 1440×900 데스크톱 모두 **0건** |
| 마켓 탭 | 열림 · Pro 카드 1 · 상품 카드 2 · `9,900원 / 4,900원` · 정가 `29,000원 / 9,900원` · 할인 `66% / 51%` |
| 외부 링크 | `latpeed.com/products/VTtxq`·`8q7nI` 원문 일치, 모두 `target="_blank" rel="noopener noreferrer"` |
| 잠금 해제 동선 | 피드 잠긴 카드 12개에 두 버튼 · 상세 잠금 안내에 두 버튼 · 버튼 → 마켓 Pro 카드 강조 스크롤 |
| Pro 데모 | 켜면 상세 프롬프트 원문 노출·잠금 UI 제거·피드 스트립 숨김, 새로고침 후 유지(`prism.demo.v2`), 끄면 복귀 |
| 언어 | KO/EN/ZH/JA 전환 시 마켓 탭·상품명·가격·고지문 전부 번역, EN/ZH/JA에 남은 한국어 0건, 잘린 텍스트 0건 |
| 레이아웃 | 문서 가로 오버플로 0(390=390, 1440=1440), 탭 라벨 5개 잘림 없음, 업로드 FAB 뷰포트 내 |
| 데스크톱 | 폰 프레임 + 좌우 가이드 패널, 가이드 6단계(마켓 포함) |

스크린샷: `browser/prism-monetized-mobile.png`, `browser/prism-monetized-desktop.png`, `browser/prism-locked-detail.png`, `browser/prism-market-{en,zh,ja}.png`, `browser/prism-market-bottom.png`

> 검증은 `python3 -m http.server`로 배포와 같은 HTTP 조건에서 수행했습니다.

기존 v1.1 검증(온보딩→업로드→리믹스→투표→챌린지 전체 플로우, 콘솔 0건)도 그대로 유지됩니다.

스크린샷: `preview-feed.png`, `preview-detail.png`, `preview-ranks.png`, `preview-en.png`, `preview-en-ranks.png`

---

## 12. 라이선스

- 코드: 이 데모 프로젝트용으로 자유롭게 수정·배포 가능
- Pretendard: Copyright (c) 2021 Kil Hyung-jin, SIL Open Font License 1.1 (`assets/fonts/OFL.txt`)
