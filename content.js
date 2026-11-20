/* ==========================================================================
   PRISM — localized sample content (KO / EN / ZH / JA)
   Author display names, post titles/descriptions/tags, comments,
   the weekly challenge and demo notifications live here.
   Prompts and handles stay as they are: they are the "source" of the work.
   ========================================================================== */
window.PRISM_SEED_DATA = (() => {
  'use strict';

  const authors = {
    yuri:   { ko: '유리',     en: 'Yuri',       zh: '尤里',     ja: 'ユリ',       handle: '@glasswork',   level: 4, hue: 162 },
    dodam:  { ko: '도담',     en: 'Dodam',      zh: '道潭',     ja: 'ドダム',     handle: '@dodam.build', level: 3, hue: 214 },
    mint:   { ko: '민트라떼', en: 'Mint Latte', zh: '薄荷拿铁', ja: 'ミントラテ', handle: '@mintlatte_',  level: 2, hue: 176 },
    code:   { ko: '코드한입', en: 'Codebite',   zh: '代码一口', ja: 'コードひとくち', handle: '@codehanip', level: 3, hue: 196 },
    haru:   { ko: '하루',     en: 'Haru',       zh: '小春',     ja: 'ハル',       handle: '@haru.arc',    level: 2, hue: 148 },
    seorin: { ko: '서린',     en: 'Seorin',     zh: '瑞琳',     ja: 'ソリン',     handle: '@seorin.draws', level: 1, hue: 330 },
    noa:    { ko: '노아',     en: 'Noa',        zh: '诺亚',     ja: 'ノア',       handle: '@noa.builds',  level: 3, hue: 266 },
    jiho:   { ko: '지호',     en: 'Jiho',       zh: '智浩',     ja: 'ジホ',       handle: '@jiho.wav',    level: 2, hue: 188 },
    q:      { ko: '큐',       en: 'Q',          zh: 'Q',        ja: 'Q',          handle: '@q_works',     level: 4, hue: 44 },
    bom:    { ko: '봄',       en: 'Bom',        zh: '春',       ja: 'ボム',       handle: '@bom.studio',  level: 2, hue: 320 },
    taeo:   { ko: '태오',     en: 'Taeo',       zh: '泰吾',     ja: 'テオ',       handle: '@taeo_dev',    level: 2, hue: 208 },
    raon:   { ko: '라온',     en: 'Raon',       zh: '拉温',     ja: 'ラオン',     handle: '@raon.art',    level: 3, hue: 8 },
    io:     { ko: '이오',     en: 'Io',         zh: '伊奥',     ja: 'イオ',       handle: '@io.studio',   level: 3, hue: 28 }
  };

  const posts = [
    {
      key: 'neon', author: 'yuri', image: 'images/art-neon-city.svg', tool: 'midjourney', category: 'image',
      picked: true, h: 0.7, copies: 1284, votes: 342, cheers: { fire: 512, bulb: 118, clap: 96 },
      views: null,
      prompt: 'cinematic night view of a Seoul backstreet after rain, dense Korean neon signage, wet asphalt mirror reflections, volumetric fog, teal and magenta color grade, 35mm lens, f/1.8, shallow depth of field, film grain --ar 4:5 --style raw --v 6.1',
      texts: {
        ko: {
          title: '네온이 내리는 도시, 밤 11시의 서울',
          desc: '비 온 뒤 골목. 간판 빛만 남기고 나머지는 전부 어둠으로 밀어봤어요. 프롬프트에서 ‘wet asphalt mirror reflections’ 한 줄이 거의 다 했다고 봅니다.',
          tags: ['#네온', '#시네마틱', '#서울']
        },
        en: {
          title: 'Neon Rain City — Seoul at 11 PM',
          desc: 'A backstreet after the rain. I kept only the sign light and pushed everything else into darkness. In the prompt, the line “wet asphalt mirror reflections” did almost all of the work.',
          tags: ['#neon', '#cinematic', '#seoul']
        },
        zh: {
          title: '霓虹落城，首尔夜里11点',
          desc: '雨后的巷子。只留下招牌的光，其余全部推进黑暗。提示词里“wet asphalt mirror reflections”这一句几乎决定了成败。',
          tags: ['#霓虹', '#电影感', '#首尔']
        },
        ja: {
          title: 'ネオンが降る街、夜11時のソウル',
          desc: '雨上がりの路地。看板の光だけを残して、あとは全部闇に押し込みました。プロンプトの「wet asphalt mirror reflections」の一行がほぼすべてを決めています。',
          tags: ['#ネオン', '#シネマティック', '#ソウル']
        }
      },
      comments: [
        {
          author: 'seorin', type: 'general', h: 0.4, likes: 12,
          texts: {
            ko: '간판 색감 진짜 미쳤다… 저장했어요 ',
            en: 'The sign colors are unreal… saved ',
            zh: '招牌的色调太绝了…已收藏 ',
            ja: '看板の色味が本当にすごい…保存しました '
          }
        },
        {
          author: 'dodam', type: 'suggestion', h: 0.5, likes: 28,
          texts: {
            ko: '`--style raw`보다 `--stylize 250`이 간판 디테일이 더 살아났어요. 렌즈는 85mm로 바꿔도 좋습니다.',
            en: '“--stylize 250” kept more sign detail than “--style raw”. Try 85mm for the lens too.',
            zh: '“--stylize 250”比“--style raw”更能保住招牌细节。镜头换成85mm也不错。',
            ja: '「--style raw」より「--stylize 250」のほうが看板のディテールが残りました。レンズは85mmに変えても良さそうです。'
          },
          replies: [{
            author: 'yuri', h: 0.3,
            texts: {
              ko: '오 85mm는 못 해봤네요. 다음 렌더에 바로 넣어볼게요 ',
              en: 'Oh, I have not tried 85mm. Putting it in the next render ',
              zh: '哦，85mm还没试过，下次渲染就用上 ',
              ja: 'お、85mmはまだ試してないです。次のレンダーですぐ入れます '
            }
          }]
        },
        {
          author: 'code', type: 'general', h: 0.6, likes: 8,
          texts: {
            ko: '이 프롬프트로 12장 뽑았는데 3장만 쓸 만했어요. 시드 고정 팁 있나요?',
            en: 'I ran 12 images from this prompt and only 3 were usable. Any tips for fixing the seed?',
            zh: '用这个提示词出了12张，只有3张能用。有固定种子的技巧吗？',
            ja: 'このプロンプトで12枚出して、使えたのは3枚でした。シード固定のコツはありますか？'
          },
          replies: [{
            author: 'yuri', h: 0.5,
            texts: {
              ko: '`--seed 448812` 고정하고 `--s 200~300` 사이로 돌리면 편차가 확 줄어요.',
              en: 'Lock “--seed 448812” and run “--s” between 200 and 300 — the variance drops a lot.',
              zh: '固定“--seed 448812”，把“--s”放在200~300之间，波动会小很多。',
              ja: '「--seed 448812」を固定して「--s」を200〜300で回すと、ばらつきがぐっと減ります。'
            }
          }]
        },
        {
          author: 'bom', type: 'general', h: 0.2, likes: 5,
          texts: {
            ko: '비 오는 날 감성 그대로네요. 바탕화면으로 씁니다 ',
            en: 'Exactly the rainy-day mood. Using it as my wallpaper ',
            zh: '雨天的氛围拿捏住了，拿来当壁纸 ',
            ja: '雨の日の雰囲気そのものですね。壁紙にします '
          }
        }
      ]
    },
    {
      key: 'flowly', author: 'dodam', image: 'images/art-app-ui.svg', tool: 'cursor', category: 'app',
      picked: true, h: 2.4, copies: 861, votes: 218, cheers: { fire: 340, bulb: 210, clap: 88 },
      views: null,
      prompt: 'Build a mobile-first revenue dashboard called Flowly. Dark UI (#0B0D12), emerald-to-cyan gradient accents, Pretendard font. One hero KPI card with a 7-day bar chart, sparkline, three revenue rows, sticky bottom CTA. Use React + Tailwind, no chart library, animate bars on mount. Text must meet WCAG AA contrast.',
      texts: {
        ko: {
          title: '주말에 만든 매출 대시보드, Flowly',
          desc: '차트 라이브러리 없이 CSS로만 막대를 그려서 번들 12KB. 프롬프트에 ‘no chart library’를 꼭 넣으세요. 접근성 조건까지 문장으로 적으면 알아서 대비를 잡아줍니다.',
          tags: ['#앱빌딩', '#대시보드', '#Cursor']
        },
        en: {
          title: 'A weekend revenue dashboard, Flowly',
          desc: 'Bars drawn in pure CSS, no chart library, 12KB bundle. Always put “no chart library” in the prompt. Write the accessibility requirement as a sentence and it picks the contrast for you.',
          tags: ['#appbuilding', '#dashboard', '#Cursor']
        },
        zh: {
          title: '周末做出来的营收看板，Flowly',
          desc: '不引图表库，纯 CSS 画柱状条，打包后 12KB。提示词里一定要写“no chart library”。把无障碍要求写成一句话，它会自己处理好对比度。',
          tags: ['#应用开发', '#看板', '#Cursor']
        },
        ja: {
          title: '週末に作った売上ダッシュボード、Flowly',
          desc: 'チャートライブラリなしでCSSだけで棒グラフを描き、バンドルは12KB。プロンプトには必ず「no chart library」を入れてください。アクセシビリティ条件を文章で書けば、コントラストまで合わせてくれます。',
          tags: ['#アプリ制作', '#ダッシュボード', '#Cursor']
        }
      },
      comments: [
        {
          author: 'yuri', type: 'general', h: 2, likes: 22,
          texts: {
            ko: '차트 라이브러리 없이 이 퀄리티면 실무에 바로 붙여도 되겠네요.',
            en: 'This quality without a chart library could go straight into production.',
            zh: '不引图表库能到这个质量，直接上生产都行。',
            ja: 'チャートライブラリなしでこの品質なら、実務にそのまま入れられますね。'
          }
        },
        {
          author: 'taeo', type: 'suggestion', h: 1.6, likes: 17,
          texts: {
            ko: '‘Accessible contrast AA’ 대신 ‘text #E5E7EB on #0B0D12, min 4.5:1’처럼 값을 직접 주면 대비가 더 정확해져요.',
            en: 'Instead of “accessible contrast AA”, give the values directly — “text #E5E7EB on #0B0D12, min 4.5:1” — and the contrast gets more precise.',
            zh: '与其写“accessible contrast AA”，不如直接给数值——“text #E5E7EB on #0B0D12, min 4.5:1”，对比度会更准。',
            ja: '「accessible contrast AA」ではなく「text #E5E7EB on #0B0D12, min 4.5:1」のように値を直接渡すと、コントラストがより正確になります。'
          },
          replies: [{
            author: 'dodam', h: 1.2,
            texts: {
              ko: '좋은 지적입니다. 다음 버전에 그대로 반영할게요!',
              en: 'Good catch. I will fold that into the next version.',
              zh: '说得好，下一版就照这个改。',
              ja: '良い指摘です。次のバージョンにそのまま反映します。'
            }
          }]
        },
        {
          author: 'mint', type: 'general', h: 0.9, likes: 6,
          texts: {
            ko: '이거 클론해서 제 앱에 붙여보고 싶어요. 코드 공개되나요?',
            en: 'I want to clone this into my own app. Is the code public?',
            zh: '想克隆下来接到我的应用里，代码会公开吗？',
            ja: 'これをクローンして自分のアプリに入れたいです。コードは公開されますか？'
          }
        }
      ]
    },
    {
      key: 'desert', author: 'mint', image: 'images/art-film.svg', tool: 'sora', category: 'video',
      picked: false, h: 4.2, copies: 402, votes: 156, cheers: { fire: 288, bulb: 74, clap: 52 },
      views: 8200,
      prompt: 'Slow dolly-in across endless desert dunes at dusk, a lone figure walking toward a giant low sun, warm amber haze, 35mm anamorphic flare, subtle wind-blown sand, cinematic grade, 24fps, 10 seconds, no text, seamless loop.',
      texts: {
        ko: {
          title: '사막의 마지막 신호',
          desc: '3번 재생성해서 나온 테이크입니다. 카메라 무브를 ‘slow dolly-in’으로 고정하니 결과가 훨씬 안정적이었어요. 10초 루프로 쓰려면 마지막 프레임을 첫 프레임과 맞춰야 합니다.',
          tags: ['#시네마틱', '#Sora', '#영상']
        },
        en: {
          title: 'The last signal in the desert',
          desc: 'This is the take after three re-rolls. Locking the camera move to “slow dolly-in” made it far more stable. For a 10-second loop, match the last frame to the first.',
          tags: ['#cinematic', '#Sora', '#video']
        },
        zh: {
          title: '沙漠里的最后信号',
          desc: '重新生成了三次才得到的这一条。把镜头运动固定为“slow dolly-in”之后稳定了很多。要做10秒循环，最后一帧必须和第一帧对上。',
          tags: ['#电影感', '#Sora', '#视频']
        },
        ja: {
          title: '砂漠の最後の信号',
          desc: '3回作り直して出てきたテイクです。カメラムーブを「slow dolly-in」に固定すると格段に安定しました。10秒ループで使うなら、最後のフレームを最初のフレームに合わせてください。',
          tags: ['#シネマティック', '#Sora', '#動画']
        }
      },
      comments: [
        {
          author: 'jiho', type: 'general', h: 3, likes: 9,
          texts: {
            ko: '24fps 고정이 영상 느낌 살리는 핵심이네요. 사운드도 직접 붙이셨나요?',
            en: 'Locking 24fps is what sells the film feel. Did you add the sound yourself too?',
            zh: '固定24fps确实是营造电影感的关键。声音也是自己配的吗？',
            ja: '24fps固定が映像らしさの核心ですね。サウンドもご自身で付けましたか？'
          }
        },
        {
          author: 'noa', type: 'suggestion', h: 2.2, likes: 11,
          texts: {
            ko: '‘lone figure’에 실루엣만 남기라고 명시하면 얼굴이 뭉개지는 문제가 줄어요. 저는 ‘backlit silhouette only’를 씁니다.',
            en: 'If you tell it to keep only a silhouette for the “lone figure”, the smeared-face problem drops. I use “backlit silhouette only”.',
            zh: '对“lone figure”明确要求只保留剪影，脸部糊掉的问题会少很多。我用的是“backlit silhouette only”。',
            ja: '「lone figure」にシルエットだけ残すよう明記すると、顔が潰れる問題が減ります。私は「backlit silhouette only」を使っています。'
          }
        }
      ]
    },
    {
      key: 'news', author: 'code', image: 'images/art-automation.svg', tool: 'n8n', category: 'automation',
      picked: false, h: 6.5, copies: 538, votes: 194, cheers: { fire: 260, bulb: 196, clap: 72 },
      views: null,
      prompt: 'Create an n8n workflow: every weekday at 06:00, fetch unread Gmail from the last 24h, send to Claude 4.5 with a 3-line Korean digest prompt, append the result to Google Sheets "daily_digest", post to Slack #daily-brief, and create a Notion page. Retry twice on failure and log errors to the Slack thread.',
      texts: {
        ko: {
          title: '매일 아침 6시, 뉴스 요약이 슬랙으로',
          desc: '3주째 돌리고 있는데 실패 0건입니다. 프롬프트에 재시도 조건과 실패 알림을 문장으로 넣은 게 컸어요. 워크플로우는 댓글에 정리해 둘게요.',
          tags: ['#자동화', '#n8n', '#생산성']
        },
        en: {
          title: 'News digest in Slack, every morning at 6',
          desc: 'Three weeks running, zero failures. Writing the retry condition and failure alert into the prompt as a sentence made the difference. I will drop the workflow in the comments.',
          tags: ['#automation', '#n8n', '#productivity']
        },
        zh: {
          title: '每天早上6点，新闻摘要进 Slack',
          desc: '已经跑了三周，零失败。关键是把重试条件和失败提醒用一句话写进了提示词。工作流我整理在评论里。',
          tags: ['#自动化', '#n8n', '#效率']
        },
        ja: {
          title: '毎朝6時、ニュース要約がSlackに届く',
          desc: '3週間動かしていて失敗ゼロです。リトライ条件と失敗通知を文章でプロンプトに入れたのが大きかった。ワークフローはコメントにまとめておきます。',
          tags: ['#自動化', '#n8n', '#生産性']
        }
      },
      comments: [
        {
          author: 'taeo', type: 'general', h: 5, likes: 6,
          texts: {
            ko: '재시도 조건이 진짜 중요하죠. 저는 3회로 해뒀어요.',
            en: 'Retry conditions really matter. I set mine to three.',
            zh: '重试条件真的很重要，我设了3次。',
            ja: 'リトライ条件は本当に大事です。私は3回にしています。'
          }
        },
        {
          author: 'yuri', type: 'general', h: 4.4, likes: 19,
          texts: {
            ko: '이거 그대로 클론해서 쓰고 싶은데 워크플로우 JSON 공유 가능할까요?',
            en: 'I would love to clone this as-is — can you share the workflow JSON?',
            zh: '想原样克隆来用，工作流 JSON 能分享吗？',
            ja: 'これをそのままクローンして使いたいのですが、ワークフローJSONを共有してもらえますか？'
          },
          replies: [{
            author: 'code', h: 4,
            texts: {
              ko: '댓글에 올려둘게요. 민감정보는 환경변수로 빼두세요!',
              en: 'I will post it in the comments. Keep secrets in environment variables!',
              zh: '我放到评论里。敏感信息记得抽到环境变量里！',
              ja: 'コメントに置いておきます。機密情報は環境変数に逃がしてください！'
            }
          }]
        },
        {
          author: 'haru', type: 'general', h: 3.6, likes: 4,
          texts: {
            ko: '아침에 이거 받으면 하루 시작이 편해질 것 같아요.',
            en: 'Getting this in the morning would make the start of the day easier.',
            zh: '早上收到这个，一天的开头会轻松很多。',
            ja: '朝これが届くと、一日の始まりが楽になりそうです。'
          }
        }
      ]
    },
    {
      key: 'glass', author: 'haru', image: 'images/art-botanical.svg', tool: 'midjourney', category: 'image',
      picked: false, h: 9, copies: 312, votes: 121, cheers: { fire: 210, bulb: 88, clap: 40 },
      views: null,
      prompt: 'translucent glass leaves growing in zero gravity, deep teal background, caustic light, macro photography, dew droplets, soft rim light, delicate veins visible, minimal composition, ultra detailed --ar 4:5 --v 6.1',
      texts: {
        ko: {
          title: '유리로 된 식물, 중력이 없는 정원',
          desc: '‘caustic light’와 ‘delicate veins visible’ 조합이 투명감을 만들어줍니다. 배경은 어둡게 두고 빛만 남기는 게 포인트예요.',
          tags: ['#투명함', '#미니멀', '#Midjourney']
        },
        en: {
          title: 'Glass plants, a garden without gravity',
          desc: 'The pair “caustic light” and “delicate veins visible” creates the transparency. Keep the background dark and leave only the light.',
          tags: ['#transparency', '#minimal', '#Midjourney']
        },
        zh: {
          title: '玻璃植物，失重的花园',
          desc: '“caustic light”和“delicate veins visible”的组合做出了通透感。关键是把背景压暗，只留下光线。',
          tags: ['#通透', '#极简', '#Midjourney']
        },
        ja: {
          title: 'ガラスの植物、重力のない庭',
          desc: '「caustic light」と「delicate veins visible」の組み合わせが透明感を作ります。背景は暗く、光だけを残すのがポイントです。',
          tags: ['#透明', '#ミニマル', '#Midjourney']
        }
      },
      comments: []
    },
    {
      key: 'storybook', author: 'seorin', image: 'images/art-storybook.svg', tool: 'claude', category: 'image',
      picked: false, h: 12, copies: 147, votes: 47, cheers: { fire: 96, bulb: 24, clap: 30 },
      views: null,
      prompt: "A warm children's picture book cover: rolling green hills at golden hour, a tiny bear waving in front of a small cottage, soft gouache texture, muted pastel palette, gentle grain, generous space at the top for a title, 4:5.",
      texts: {
        ko: {
          title: '첫 프롬프트로 만든 그림책 표지',
          desc: '아이 그림책 표지 시안이에요. 제목이 들어갈 자리를 비워달라고 한 게 정말 유용했습니다. 다음엔 본문 삽화도 같은 화풍으로 뽑아볼 거예요.',
          tags: ['#아이그림책', '#일러스트']
        },
        en: {
          title: 'A picture-book cover made with my first prompt',
          desc: 'A cover draft for a children’s book. Asking it to leave space for the title was genuinely useful. Next I will try the interior art in the same style.',
          tags: ['#kidsbook', '#illustration']
        },
        zh: {
          title: '用第一个提示词做的绘本封面',
          desc: '这是儿童绘本封面的初稿。要求它给标题留出位置，真的很有用。下一次想用同样的画风做内页插画。',
          tags: ['#儿童绘本', '#插画']
        },
        ja: {
          title: '最初のプロンプトで作った絵本の表紙',
          desc: '子どもの絵本の表紙案です。タイトルが入る余白を空けてと頼んだのが本当に役に立ちました。次は本文の挿絵も同じ画風で出してみます。',
          tags: ['#子どもの絵本', '#イラスト']
        }
      },
      comments: [
        {
          author: 'haru', type: 'general', h: 10, likes: 4,
          texts: {
            ko: '따뜻한 느낌이라 좋네요… 아이가 좋아할 것 같아요.',
            en: 'So warm… I think a child would love it.',
            zh: '感觉很温暖…孩子应该会喜欢。',
            ja: '温かい雰囲気…子どもが喜びそうです。'
          }
        }
      ]
    },
    {
      key: 'aura', author: 'noa', image: 'images/art-brand.svg', tool: 'claude', category: 'image',
      picked: true, h: 20, copies: 690, votes: 203, cheers: { fire: 312, bulb: 180, clap: 120 },
      views: null,
      prompt: 'Design a minimal identity board for a calm-technology brand named AURA. One circular mark built from a single gradient arc, wordmark with wide letterspacing, five-color palette, light grid background, dark charcoal canvas, editorial layout, Korean and English type specimen.',
      texts: {
        ko: {
          title: '12시간 브랜드 챌린지 — AURA',
          desc: '마크는 원 하나와 호 하나로만 만들었습니다. 팔레트는 5색으로 제한하고, 타이포는 자간으로만 승부했어요. 프롬프트에 ‘editorial layout’을 넣으면 여백이 살아납니다.',
          tags: ['#브랜딩', '#타이포', '#미니멀']
        },
        en: {
          title: '12-hour brand challenge — AURA',
          desc: 'The mark is one circle and one arc, nothing else. I limited the palette to five colors and let wide letterspacing do the rest. Put “editorial layout” in the prompt and the whitespace comes alive.',
          tags: ['#branding', '#type', '#minimal']
        },
        zh: {
          title: '12小时品牌挑战 — AURA',
          desc: '标志只用了一个圆和一道弧。配色限制在5色，字体只靠字距取胜。提示词里加上“editorial layout”，留白就活了。',
          tags: ['#品牌', '#字体', '#极简']
        },
        ja: {
          title: '12時間ブランドチャレンジ — AURA',
          desc: 'マークは円ひとつと弧ひとつだけで作りました。パレットは5色に絞り、タイポは字間だけで勝負。プロンプトに「editorial layout」を入れると余白が生きてきます。',
          tags: ['#ブランディング', '#タイポ', '#ミニマル']
        }
      },
      comments: [
        {
          author: 'bom', type: 'general', h: 18, likes: 14,
          texts: {
            ko: '마크 하나로 이 정도 아이덴티티가 나오는 게 신기해요.',
            en: 'Amazing that one mark carries this much identity.',
            zh: '一个标志就能撑起这样的识别度，很神奇。',
            ja: 'マークひとつでここまでのアイデンティティが出るのが不思議です。'
          }
        },
        {
          author: 'q', type: 'suggestion', h: 16, likes: 9,
          texts: {
            ko: '팔레트에서 #F8FAFC를 빼고 중간 그레이를 하나 더 넣으면 인쇄에서 안정적입니다. 좋은 작업이에요.',
            en: 'Drop #F8FAFC from the palette and add one mid-gray — it will hold up better in print. Nice work.',
            zh: '把 #F8FAFC 从配色里去掉，再加一个中间灰，印刷会更稳。很好的作品。',
            ja: 'パレットから#F8FAFCを外して中間グレーを一つ足すと、印刷で安定します。良い仕事です。'
          }
        }
      ]
    },
    {
      key: 'icons3d', author: 'bom', image: 'images/art-shapes.svg', tool: 'kling', category: 'video',
      picked: false, h: 26, copies: 233, votes: 88, cheers: { fire: 150, bulb: 62, clap: 28 },
      views: 3100,
      prompt: 'Floating 3D shapes in deep indigo space: a glossy glass torus, a matte amber cube, a chrome sphere, slow orbit camera, studio HDRI lighting, soft shadows, 8 seconds, seamless loop, product render quality.',
      texts: {
        ko: {
          title: '3D 아이콘 세트, 8초 루프로 돌리기',
          desc: '토러스 유리 재질이 생각보다 잘 나왔습니다. ‘seamless loop’와 ‘studio HDRI’를 꼭 넣고, 카메라는 orbit으로 고정하세요.',
          tags: ['#3D', '#Kling', '#아이콘']
        },
        en: {
          title: 'A 3D icon set on an 8-second loop',
          desc: 'The glass torus came out better than expected. Always include “seamless loop” and “studio HDRI”, and lock the camera to orbit.',
          tags: ['#3D', '#Kling', '#icons']
        },
        zh: {
          title: '3D图标套装，做成8秒循环',
          desc: '圆环体的玻璃材质比预想更好。一定要写“seamless loop”和“studio HDRI”，镜头固定为 orbit。',
          tags: ['#3D', '#Kling', '#图标']
        },
        ja: {
          title: '3Dアイコンセット、8秒ループで回す',
          desc: 'トーラスのガラス素材が思ったより良い感じです。「seamless loop」と「studio HDRI」は必ず入れ、カメラはorbitで固定してください。',
          tags: ['#3D', '#Kling', '#アイコン']
        }
      },
      comments: []
    },
    {
      key: 'ambient', author: 'jiho', image: 'images/art-audio.svg', tool: 'suno', category: 'video',
      picked: false, h: 31, copies: 188, votes: 104, cheers: { fire: 178, bulb: 96, clap: 44 },
      views: 5700,
      prompt: 'Generate a 3-minute ambient track: warm analog pad in D major, slow tape wow, distant rain, soft sub pulse at 62 BPM, no drums, cinematic and calm. Then create a seamless visualizer: concentric rings and a mirrored waveform on near-black, cyan-to-violet gradient.',
      texts: {
        ko: {
          title: '앰비언트 트랙 + 비주얼라이저',
          desc: '62 BPM으로 맞추니 영상 루프가 자연스럽게 이어집니다. 사운드는 Suno, 비주얼은 Kling으로 따로 뽑아 합쳤어요.',
          tags: ['#사운드', '#앰비언트', '#Suno']
        },
        en: {
          title: 'Ambient track + visualizer',
          desc: 'Locking to 62 BPM makes the video loop flow naturally. Suno for the sound, Kling for the visuals, then combined.',
          tags: ['#sound', '#ambient', '#Suno']
        },
        zh: {
          title: '氛围音乐 + 可视化',
          desc: '对齐到62 BPM，视频循环就能自然接上。声音用 Suno，画面用 Kling，分别生成后合成。',
          tags: ['#声音', '#氛围', '#Suno']
        },
        ja: {
          title: 'アンビエント曲 + ビジュアライザー',
          desc: '62 BPMに合わせると映像ループが自然につながります。音はSuno、ビジュアルはKlingで別々に作って合成しました。',
          tags: ['#サウンド', '#アンビエント', '#Suno']
        }
      },
      comments: []
    },
    {
      key: 'planet', author: 'raon', image: 'images/art-nebula.svg', tool: 'midjourney', category: 'image',
      picked: false, h: 40, copies: 451, votes: 176, cheers: { fire: 268, bulb: 122, clap: 58 },
      views: null,
      prompt: 'a ringed amber planet floating in a violet nebula, small moon below, subtle lens flare, cinematic space photography, deep shadows, ultra wide, 8k --ar 4:5 --v 6.1',
      texts: {
        ko: {
          title: '행성 하나만 남기고 다 지운 우주',
          desc: '별은 프롬프트보다 후보정으로 더 넣었어요. ‘dense starfield’를 넣으면 AI가 별을 너무 크게 그려서, 일부러 빼고 직접 얹는 편입니다.',
          tags: ['#우주', '#Midjourney', '#네온']
        },
        en: {
          title: 'A universe erased down to one planet',
          desc: 'I added most of the stars in post. With “dense starfield” the AI draws them too large, so I leave it out and place them myself.',
          tags: ['#space', '#Midjourney', '#neon']
        },
        zh: {
          title: '只留下一个行星的宇宙',
          desc: '星星大多是后期加的。加“dense starfield”AI会把星画得太大，所以我故意去掉，自己叠上去。',
          tags: ['#宇宙', '#Midjourney', '#霓虹']
        },
        ja: {
          title: '惑星ひとつだけ残して全部消した宇宙',
          desc: '星はプロンプトよりレタッチで足しました。「dense starfield」を入れるとAIが星を大きく描きすぎるので、あえて外して自分で乗せています。',
          tags: ['#宇宙', '#Midjourney', '#ネオン']
        }
      },
      comments: []
    },
    {
      key: 'poster', author: 'q', image: 'images/art-poster.svg', tool: 'midjourney', category: 'image',
      picked: false, h: 52, copies: 302, votes: 132, cheers: { fire: 206, bulb: 104, clap: 36 },
      views: null,
      prompt: 'Bold editorial poster titled "NO SIGNAL". Oversized grotesque type, amber gradient on near-black, thin horizontal rules, small circular stamp with edition number 01/50, Swiss layout, generous negative space, print grain, A2 ratio.',
      texts: {
        ko: {
          title: 'NO SIGNAL — 에디토리얼 포스터',
          desc: '타이포는 Pretendard Black, 그라디언트는 앰버 하나만 썼습니다. ‘generous negative space’를 넣으면 여백이 진짜로 생겨요.',
          tags: ['#타이포', '#포스터', '#미니멀']
        },
        en: {
          title: 'NO SIGNAL — editorial poster',
          desc: 'Pretendard Black for the type, a single amber gradient. Add “generous negative space” and the whitespace actually appears.',
          tags: ['#type', '#poster', '#minimal']
        },
        zh: {
          title: 'NO SIGNAL — 编辑风海报',
          desc: '字体用 Pretendard Black，渐变只用了琥珀色一种。写上“generous negative space”，留白就真的出来了。',
          tags: ['#字体', '#海报', '#极简']
        },
        ja: {
          title: 'NO SIGNAL — エディトリアルポスター',
          desc: 'タイポはPretendard Black、グラデーションはアンバー1色だけ。「generous negative space」を入れると余白が本当に生まれます。',
          tags: ['#タイポ', '#ポスター', '#ミニマル']
        }
      },
      comments: []
    },
    {
      key: 'portrait', author: 'io', image: 'images/art-portrait.svg', tool: 'midjourney', category: 'image',
      picked: false, h: 60, copies: 264, votes: 167, cheers: { fire: 244, bulb: 88, clap: 64 },
      views: null,
      prompt: 'editorial portrait of a person with closed eyes, warm gradient skin tones, pink and violet hair light, halftone dots, thin gold frame, 90s magazine cover aesthetic, grainy --ar 4:5 --v 6.1',
      texts: {
        ko: {
          title: '비 오는 날의 초상',
          desc: '얼굴을 지우고 빛만 남기는 방식으로 6번 시도했어요. ‘closed eyes’와 ‘halftone dots’가 분위기를 만들어줍니다.',
          tags: ['#초상', '#필름', '#Midjourney']
        },
        en: {
          title: 'Portrait on a rainy day',
          desc: 'Six attempts at erasing the face and keeping only the light. “Closed eyes” and “halftone dots” carry the mood.',
          tags: ['#portrait', '#film', '#Midjourney']
        },
        zh: {
          title: '雨天的肖像',
          desc: '用抹去脸、只留光的方式试了六次。“closed eyes”和“halftone dots”撑起了氛围。',
          tags: ['#肖像', '#胶片', '#Midjourney']
        },
        ja: {
          title: '雨の日の肖像',
          desc: '顔を消して光だけを残す方法で6回試しました。「closed eyes」と「halftone dots」が雰囲気を作ります。',
          tags: ['#肖像', '#フィルム', '#Midjourney']
        }
      },
      comments: [
        {
          author: 'haru', type: 'general', h: 50, likes: 7,
          texts: {
            ko: '눈 감은 표정이 오히려 분위기를 다 하네요. 색감 저장했어요.',
            en: 'The closed eyes carry the whole mood. Saved the palette.',
            zh: '闭眼的表情反而撑起了整个氛围，配色已收藏。',
            ja: '目を閉じた表情がむしろ雰囲気を全部作っています。色味を保存しました。'
          }
        }
      ]
    }
  ];

  const challenge = {
    endsInDays: 3,
    participants: 128,
    createdBy: 'q',
    texts: {
      ko: { title: '투명함', sub: 'Transparency', desc: '유리·물·빛처럼 비치는 질감을 AI로 표현해 보세요. 이번 주 큐레이터 픽 3작품은 피드 상단에 고정됩니다.', tag: '#투명함' },
      en: { title: 'Transparency', sub: '', desc: 'Show us glass, water, light — anything that transmits. This week’s three curator picks pin to the top of the feed.', tag: '#transparency' },
      zh: { title: '通透', sub: 'Transparency', desc: '用 AI 表现玻璃、水、光这样透过去的质感。本周3件策展人精选会固定在动态顶部。', tag: '#通透' },
      ja: { title: '透明', sub: 'Transparency', desc: 'ガラス・水・光のように透ける質感をAIで表現してみてください。今週のキュレーターピック3作品はフィード上部に固定されます。', tag: '#透明' }
    }
  };

  const notifications = [
    {
      icon: '', minutesAgo: 3, read: false,
      texts: {
        ko: '내 프롬프트에 공감 12개가 달렸어요',
        en: 'Your prompt got 12 reactions',
        zh: '你的提示词收到了12个共鸣',
        ja: 'あなたのプロンプトに共感が12件つきました'
      }
    },
    {
      icon: '', minutesAgo: 62, read: false,
      texts: {
        ko: '큐레이터 유리가 회원님의 작품을 저장했어요',
        en: 'Curator Yuri saved your work',
        zh: '策展人尤里收藏了你的作品',
        ja: 'キュレーターのユリがあなたの作品を保存しました'
      }
    },
    {
      icon: '', minutesAgo: 300, read: false,
      texts: {
        ko: '이번 주 챌린지 ‘투명함’ 마감이 3일 남았어요',
        en: 'This week’s challenge “Transparency” closes in 3 days',
        zh: '本周挑战“通透”还有3天截止',
        ja: '今週のチャレンジ「透明」の締切まであと3日です'
      }
    },
    {
      icon: '', minutesAgo: 1560, read: true,
      texts: {
        ko: '프롬프트 3개를 올리면 Builder 등급이 열려요',
        en: 'Post 3 prompts to unlock Builder',
        zh: '发布3个提示词即可解锁 Builder',
        ja: 'プロンプトを3つ投稿するとBuilderが開きます'
      }
    }
  ];

  return { authors, posts, challenge, notifications };
})();
