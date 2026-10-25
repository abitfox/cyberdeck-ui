# HackerEnglish 可独立开源资产盘点报告

> 目的：系统梳理 20_HackerEnglish 项目中可提取为独立开源项目的资产，评估独立性、通用性与抽取成本，给出分级建议和路线图。
> 已完成的两次抽取（不在本报告重复展开）：**26_ScrambleType**（ScrambleText 乱码解码组件，npm 已发包）、**27_CyberdeckUI**（eDEX 风格 UI 组件库 + 工作站演示站）。

---

## 一、评估维度

| 维度 | 说明 |
|------|------|
| **独立性** | 与业务（英语学习 / Web3 / Supabase）的耦合程度，抽取需要改多少代码 |
| **通用性** | 目标用户群体的规模——是"所有前端"还是"少数做同类产品的人" |
| **差异化** | 与现有开源方案（npm/GitHub）竞争时的独特卖点 |
| **维护成本** | API 面大小、依赖更新、issue 负担 |
| **重叠度** | 与 26/27 两个已有项目是否重复 |

**分级**：🟢 强推荐（值得尽快做）／ 🟡 可做（有价值但需要包装或抽象）／ 🔴 不建议（留在原项目）

---

## 二、候选总览

| # | 候选 | 代码位置 | 规模 | 分级 | 建议形态 |
|---|------|----------|------|:----:|----------|
| 1 | 配置驱动 UI 音效引擎 | `lib/sfx.ts` + `public/sounds.json` + `public/sound-lab.html` | ~355 行 + 配置 | ✅ 已建 28_SoundCue | npm 包 |
| 2 | WebGL 氛围动态背景 | `components/shader-background.tsx` + `lib/fx.ts` | ~385 行 | ✅ 已建 29_ShaderAmbient | npm 包 |
| 3 | EdgeTTS 缓存播放管线 | `lib/tts.ts` + `tts-client.ts` + `azure-tts.ts` + `scripts/pregen-tts.mjs` | ~700 行 | ✅ 已建 30_EdgeTts | npm 包（server + client 双入口） |
| 4 | 剧情导演引擎（节点图叙事） | `lib/director.ts` + `story-yaml.ts` + `story-seed-s1.json` | ~500 行 + schema | ✅ 已建 31_StoryDirector | npm 包 + 可视化编辑器（远期） |
| 5 | 黑客风终端模拟器 | `components/terminal/Terminal.tsx` + `lib/commands.ts` | ~1400 行 | 🟡 | 并入 27_CyberdeckUI 作为旗舰组件 |
| 6 | 训练评分引擎（题型 + Levenshtein） | `lib/mission-engine.ts` + `mission-data.ts` 类型层 | ~700 行 | 🟡 | npm 包（教育赛道） |
| 7 | RollingNumber 数字滚动 | `components/edex/system-panel.tsx` 内 | ~30 行 | 🟡 | 微型包 或 并入 27 |
| 8 | eDEX-UI Next.js 起步模板 | `template/edex-ui` + 27 组件 | 模板仓库 | 🟡 | 作为 27 的官方 example 仓库 |
| 9 | 背景音乐单例引擎 | `lib/bgm.ts` | 119 行 | 🔴 | 太薄，并入 #1 或 27 |
| 10 | SIWE 认证 / 云同步 / 商务 | `lib/siwe-server.ts` `cloud-sync.ts` `commerce.ts` 等 | ~800 行 | 🔴 | 深度耦合 Supabase，成熟方案多 |
| 11 | NFT 智能合约 | `contracts/contracts/*.sol` | 2 个合约 | 🔴 | 业务专属 + 需审计 |
| 12 | 双语 i18n hook / 错误规整 | `lib/lang.ts` `err.ts` | ~190 行 | 🔴 | 太小，价值不足以撑一个项目 |

---

## 三、逐项详评

### 1. 🟢 配置驱动 UI 音效引擎（建议名：`soundcue` / `ui-sfx`）

**是什么**：一个纯 Web Audio 的 UI 音效系统——所有音效（打字 tick、按键点击、开机 blip/sweep、弹窗、成功/失败……）由 JSON 配置描述（振荡器/噪声层、频率滑音、滤波器、采样混合、节流间隔），运行时首次出声前异步拉取配置，内置同源 fallback。附 `sound-lab.html` 试听台，改配置刷新即生效，全站换音不动代码。

**代码位置与规模**：`lib/sfx.ts`（355 行，引擎核心）+ `public/sounds.json`（presets/slots 配置）+ `public/sound-lab.html`（试听工具，直接可用）。

**为什么值得抽**：
- 市面上 UI 音效方案要么要音频文件（freesound 手动拼），要么是游戏引擎级（Howler）。**"JSON 配置描述音效 + 纯合成 + 自带试听台"** 这个组合没有现成竞品。
- `sound-lab.html` 本身就是杀手级 demo——放进 README 一截图就有说服力。
- 通用性极广：任何终端风 UI、游戏化应用、表单交互反馈。

**耦合点**：几乎没有——引擎是纯浏览器 API，已验证零业务引用（27 已搬走一次）。

**抽取方案**：core（引擎 + 类型）+ react（`useSfx()` hook + `<SfxProvider>`）；`sounds.json` 变成默认预设集，支持用户传入覆盖。试听台做成文档站页面。

**工作量**：低（1~2 天）。维护成本低（无依赖、API 面小）。

---

### 2. 🟢 WebGL 氛围动态背景（建议名：`shader-ambient` / `gridglow`）

**是什么**：单 canvas 三层动画背景——闪烁网格 + 鼠标跟随圆点涟漪场 + 上浮粒子，raw WebGL 片元着色器实现，无 three.js。自带完整性能保护：DPR 上限 2、low-power 上下文降级、离屏暂停、`prefers-reduced-motion` 降级、FX 开关（关 = 定格一帧，GPU 归零但背景仍在）。

**代码位置与规模**：`components/shader-background.tsx`（313 行）+ `lib/fx.ts`（72 行，开关状态机 + localStorage 持久化 + 移动端默认关）。

**为什么值得抽**：
- 暗色科技风落地页的"氛围背景"是真实需求，现有方案普遍是 three.js demo 级（重、无降级策略）。本组件**性能保护策略齐全**是最大差异点。
- 颜色/强度/网格密度全部参数化（CONFIG 已收口），抽取时改为 props 即可。

**耦合点**：仅 `lib/fx`（一并搬走，做成可选 hook）。

**抽取方案**：`<ShaderAmbience color intensity gridLines vignette mouseInteractive />` + `useFxPreference()` hook。

**工作量**：低（1 天）。

---

### 3. 🟢 EdgeTTS 缓存播放管线（建议名：`edge-tts-pipeline` / `tts-cache`）

**是什么**：一套"免费 TTS 生产级化"的完整方案：
- **服务端**：`sha1(voice+text)` 为键 → 查缓存表 → 命中返回存储直链（302）；未命中 → MsEdgeTTS websocket 合成 mp3 → 上传对象存储 → 写索引。全局共享缓存（不含用户数据），**同一句话永远只合成一次**。
- **客户端**：全局单例播放 + 会话内存 LRU blob 预取（题目链路从每句 2~3 秒等待降到 ≈0ms）+ 全局播放状态订阅（波形动画等 UI 可消费）。
- **批量工具**：`pregen-tts.mjs` 离线预生成整个题库音频；`audio-inventory.ts` 音色槽位管理（教学/常规/反派 槽位自动归类 + 默认音色推荐）。

**代码位置与规模**：`lib/tts.ts`（85）+ `tts-client.ts`（176）+ `azure-tts.ts`（131）+ `scripts/pregen-tts.mjs` + `lib/audio-inventory.ts`（223），合计 ~700 行。

**为什么值得抽**：
- msedge-tts 本身免费但**每次实时合成慢且不稳**；本方案用"缓存 + 预取"把它做成了生产可用，省掉 Azure/Google 账单。
- 语言学习、播客、无障碍、新闻朗读类应用都是目标用户。
- 现有竞品要么是 CLI 工具（edge-tts python），要么是裸 SDK 封装，**没有"缓存 + 预取 + 播放状态管理"整套交付**。

**耦合点**：Supabase（Storage + 缓存表）——需抽象成 `StorageAdapter` / `CacheAdapter` 接口（Supabase 作默认实现，本地 FS / S3 作参考实现）。

**抽取方案**：monorepo 双入口 `edge-tts-pipeline/server`（Next.js route handler 工厂）+ `/client`（播放器 + 预取 hook）。

**工作量**：中（3~5 天，主要是 adapter 抽象 + 文档）。

---

### 4. 🟡 剧情导演引擎（建议名：`story-director` / `nodeplay`）

**是什么**：节点图叙事引擎——剧本是 DB 里的 story_nodes 图（briefing/task/hook/gate/reward/checkpoint 六类节点词表固定），导演作为**旁路接管层**：用户执行动作（/decode /drill）先 consult 导演，命中当前节点则返回叙事台词与目标，未命中永不拦截用户（"导演不监禁玩家"）。节点 ID 跨版本稳定（s1.ch1.u1），切剧本版本不丢进度。**YAML 是唯一契约**：管理台表单 / 可视化编辑器 / AI 生成管线读写同一份 StoryDoc，支持离线 AI 生成 → 人审 diff → 导入上线，内置 lint 校验器。

**代码位置与规模**：`lib/director.ts`（293）+ `story-yaml.ts`（136）+ `story-seed-s1.json`（种子剧本）。

**为什么值得抽**：
- "旁路接管不监禁"和"节点 ID 版本稳定"是真实踩坑后的设计，文档论证完整（三轮讨论总结在 `docs/背景故事/`）。
- "图是数据，编辑器可插拔 + AI 产线友好（离线生成→人审→导入）"的定位契合当下 AI 内容生产潮流。
- 目标用户：互动小说、教育剧本、营销 onboarding 流、游戏 NPC 剧情。

**耦合点**：`mission-engine` 引用（结算口径）、DB 层（story-db）——需抽象为 `ProgressAdapter` / `NodeSource` 接口；台词载荷字段含业务枚举（Sku）需泛化。

**抽取方案**：core 纯逻辑包 + JSON Schema + 校验器；DB/存储做 adapter；远期配一个可视化节点图编辑器（独立亮点）。

**工作量**：中大（1~2 周，含泛化重构与文档）。受众比 UI 类窄，建议排后。

---

### 5. 🟡 黑客风终端模拟器 → **建议并入 27_CyberdeckUI，不独立**

`Terminal.tsx`（528 行：命令历史 ↑↓、滚动回显、多角色着色、tab 切换、音效联动）+ `commands.ts`（880 行命令注册/派发/描述）。业务命令占大半，但"**命令注册表 + 派发器 + 终端 UI**"的骨架可提炼为 headless API。

**不独立的原因**：受众与 27_CyberdeckUI 完全重合，独立发布会分散两个项目的 Star；作为 cyberdeck-ui 的旗舰组件（`<Terminal onCommand>` + `useCommandRegistry()`）反而是最好的引流页。27 里已有的简化版终端可按此升级。

---

### 6. 🟡 训练评分引擎（建议名：`drillcore` / `quiz-engine`）

**是什么**：`mission-engine.ts` 是纯函数层——文本归一化、Levenshtein 距离（≥70% 通过的模糊评分）、四种题型（听写/关键词/听选/拼写）的判分、连锁倍率曲线、单元结算规则。类型定义完整（mission-data.ts 的 CEFR/Task/Unit/Role 类型层可独立复用）。

**为什么可做**：判分纯函数零依赖，教育/刷题类项目通用；"模糊匹配阈值判分 + 题型扩展"有通用价值。

**为什么不优先**：竞品不少（各类 quiz 引擎），差异化一般；题型枚举与英语学习绑定较深，泛化需要重新设计题型接口。工作量 3~5 天。适合作为教育方向的下个项目预研，不阻塞 #1~#3。

---

### 7. 🟡 RollingNumber 数字滚动（微型包 或 并入 27）

`system-panel.tsx` 内 30 行：数值变化时 600ms ease-out 平滑数到新值，`tabular-nums` 保证宽度稳定。仪表盘通用件，竞品 react-countup 偏重。建议：先并入 27_CyberdeckUI（补个 demo 页），若使用反馈好再拆微型包。

---

### 8. 🟡 eDEX-UI Next.js 起步模板

`template/edex-ui`（原型的 Next.js 移植壳）+ 27 的组件 = "30 分钟搭一个 eDEX 风工作站"的 starter。**不独立成项目**：作为 27_CyberdeckUI 的官方 example（`examples/workstation-template`）或 GitHub template repository，给 27 引流。

---

## 四、🔴 不建议抽取的资产（留档备查）

| 资产 | 位置 | 原因 |
|------|------|------|
| 背景音乐单例引擎 | `lib/bgm.ts`（119 行） | HTMLAudio 单例 + 手势兜底，太薄；建议把"手势解锁自动播放"逻辑并入 #1 音效引擎作为一条 feature |
| SIWE 钱包认证 | `lib/siwe-server.ts`、`stores/auth.ts`（~800 行） | 与 Supabase 会话体系深度耦合，且同类成熟库多（siwe 官方示例、Auth.js） |
| 云同步 / 商务 | `lib/cloud-sync.ts`、`commerce.ts`、`session-reset.ts` | 业务数据模型专属 |
| NFT 合约 | `contracts/AgentBadge.sol`、`HackerScore.sol` | 业务专属、上链资产需审计、维护责任重 |
| 双语 hook / 错误规整 | `lib/lang.ts`、`err.ts` | ~190 行，价值密度不足以独立撑项目（err.ts 的 errMsg 倒是适合投递到 utils 合集类项目） |
| 任务 store / 引导 store | `stores/mission.ts`（1347 行）、`tutorial.ts`（650 行） | 产品核心逻辑本身，抽取=复制产品 |
| 摸底测验 UI | `components/placement/placement-quiz.tsx` | 业务 UI，无通用抽象 |

---

## 五、建议路线图

按"独立性 × 通用性 × 成本"排序，两个已有项目不重复：

| 优先级 | 项目 | 形态 | 理由 |
|:---:|------|------|------|
| **P0** | `soundcue`（#1 音效引擎） | npm | 成本最低、差异化最清晰、sound-lab 自带 demo；和 26/27 形成互补产品线 |
| **P0** | `shader-ambient`（#2 WebGL 背景） | npm | 1 天成本，README 一张 GIF 即可传播；可与 27 互相引用 |
| **P1** | EdgeTTS 管线（#3） | npm monorepo | 价值最高但需要 adapter 抽象；受众明确（Next.js + TTS 需求），可蹭"免费 TTS"搜索流量 |
| **P1** | 终端组件升级（#5） | 并入 27 | 增强已有项目而非新开摊子 |
| **P2** | story-director（#4） | npm + 编辑器远期 | 设计理念是卖点，但泛化工作量大、受众窄；建议先写设计文档积累 Star 预期 |
| **P2** | drillcore（#6）/ RollingNumber（#7）/ eDEX 模板（#8） | 视反馈 | 机会型，不主动投入 |

**命名约定**（延续工作区习惯）：`28_SoundCue`、`29_ShaderAmbient`、`30_EdgeTts`、`31_StoryDirector`。

**通用建议**（三次抽取验证过的流程）：先在原项目建 `/demo` 试验台验证解耦 → 复制骨架 → 去 store 耦合改 props → pnpm + tsup 打包（参考 26_ScrambleType 的工程配置）→ 演示站 + GIF → MIT + 溯源说明 → CI。

---

*生成于 2026-10-25 · 基于 20_HackerEnglish 当前代码盘点（frontend/src ~11.2k 行 + contracts + template + scripts）*


---

## 执行记录（2026-10-25）

候选 #1~#4 已按《开源项目标准》（`work/OPENSOURCE-STANDARD.md`）全部落地，每个项目均含：
tsup 双格式打包（ESM/CJS + dts）、vitest 单测、双语 README（README.md + README.zh-CN.md，
顶部语言切换）、MIT LICENSE（含溯源）、CI workflow、docs/PORTING.md 移植映射表。

| 项目 | 包名 | 入口 | 单测 | 验证 |
|------|------|------|:---:|------|
| 28_SoundCue | `soundcue` | `.`(react) + `/core` | 7 | typecheck/test/build 全绿 |
| 29_ShaderAmbient | `shader-ambient` | `.`(react) + `/core` | 3 | 同上 |
| 30_EdgeTts | `edge-tts-pipeline` | `/server` + `/client` + `.` | 8 | 同上（adapter 泛化：Storage/Cache/Synth） |
| 31_StoryDirector | `story-director` | `.`(core) + `/yaml` | 19 | 同上（SKU 泛化为 opaque string；示例剧本重写为通用科幻） |

发布前待办：GitHub 建仓 + README 徽章链接替换、npm 名称检索、`npm publish`（prepublishOnly 已串联三关）。
