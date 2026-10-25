# Cyberdeck UI · 项目方案

> 从 20_HackerEnglish 项目中提取的"黑客工作站"风格 UI 组件库，做成独立开源的 UI 演示型项目。

## 一、项目定位

**一句话**：一套赛博朋克 / 黑客终端风格的 React UI 组件库 + 在线演示站（Showcase），让任何人几分钟内搭出 eDEX-UI 质感的界面。

- **类型**：UI 演示型开源项目（Showcase 优先，npm 包为可选二期）
- **核心卖点**：
  1. 完整的"黑客美学"设计系统：CRT 扫描线、网格背景、开机序列、文字乱码解码（Scramble）、打字机光标等，目前市面上同类型 React 组件库几乎没有
  2. 开箱即用：复制组件 / npm 安装即可用，不绑定任何业务
  3. 演示站即文档：每个组件一个 Demo 页 + 源码展示，类似 daisyUI / Aceternity UI 的体验
- **目标用户**：想做黑客风个人主页、数据大屏、CTF 工具站、赛博朋克游戏 UI、终端风 Blog 的前端开发者

## 二、项目名

**推荐：Cyberdeck UI**

- **Cyberdeck（赛博甲板）** 是黑客文化中的经典词——源自《神经漫游者》，指黑客使用的便携式 hacking 控制台，与本项目"黑客工作站"的定位完全吻合
- 名字自带社区认知度（r/cyberdeck 社区有数十万成员），便于传播
- npm 包名 `cyberdeck-ui`、域名 `cyberdeck-ui` 均简短可用
- 目录名：`27_CyberdeckUI`

**备选名**（如果Cyberdeck UI 被占用或不满意）：

| 名称 | 含义 | 特点 |
|------|------|------|
| HackDeck | 黑客甲板 | 顺口，直白 |
| NeonTerm | 霓虹终端 | 强调视觉风格 |
| TermForge | 终端锻造 | 强调"构建"感 |
| ScrambleUI | 乱码解码 | 取自招牌动效组件 |

## 三、技术栈

沿用原项目已验证的组合，去掉业务依赖：

| 依赖 | 用途 | 原项目保留 |
|------|------|:---:|
| Next.js 14 (App Router) | 框架 + 演示站 | ✅ |
| React 18 | — | ✅ |
| Tailwind CSS 3 | 原子样式 | ✅ |
| TypeScript | — | ✅ |
| clsx | 类名合并 | ✅ |
| ~~zustand~~ | 业务状态 | ❌ 改为组件 props + demo 内部 useState |
| ~~framer-motion~~ | 仅 1 处使用 | ❌ 用 CSS 动画替代（现有动效本就是纯 CSS） |
| ~~supabase / siwe / tts 等~~ | 业务功能 | ❌ |

设计原则：**组件零第三方依赖、零业务耦合**，只依赖 React + clsx + globals.css 主题层。

## 四、目录结构

```
27_CyberdeckUI/
├── docs/                    # 方案与文档
│   └── PLAN.md
├── frontend/                # 演示站 + 组件库
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # 根布局（扫描线 + 网格背景 + 字体）
│   │   │   ├── page.tsx             # 首页：Hero + 特性 + 组件总览
│   │   │   ├── globals.css          # ★ 主题核心（从原项目提取精炼）
│   │   │   └── components/
│   │   │       └── <Component>/     # 每个组件一个演示页 /components/clock
│   │   ├── components/
│   │   │   ├── widgets/             # ★ 从原项目提取：12 个小部件
│   │   │   ├── edex/                # ★ 面板 / 动效 / 结构组件
│   │   │   └── showcase/            # 演示站专用：DemoCard、CodeBlock、SideNav 等
│   │   └── fonts/                   # GeistMono（等宽字体，黑客风核心）
│   ├── tailwind.config.ts
│   └── package.json
└── README.md                # 开源门面：README.md（英文）+ README.zh-CN.md（中文），双文件语言切换模式
```

## 五、组件清单（抽取来源映射）

### 1. 主题层（globals.css 提炼）— 项目的灵魂

| 模块 | 原来源 | 说明 |
|------|--------|------|
| CSS 变量色板 | globals.css `:root` | 背景/主色/成功/警告/错误/金色 + 三级文字色 |
| `.hacker-bg` 网格背景 | 同上 | 32px 网格，fixed 伪元素 |
| `.edex-scanlines` CRT 扫描线 | 同上 | repeating-linear-gradient 覆盖层 |
| `.widget` / `.widget-title` 面板外壳 | 同上 | 所有面板的通用容器 |
| 动效全家桶 | 同上 | `blink` `breathe` `eq-bounce` `type-caret` `page-enter` `boot-seq`（开机序列）`popup-panel-in` `key-in`（键盘错位进场） |
| `.hairline` 发丝输入框下划线 | 同上 | 0.5px 视觉线 + focus 语义色 |
| 自定义滚动条 | 同上 | — |

### 2. 基础小部件（`components/widgets/`，多数纯展示）

| 组件 | 原来源 | 耦合处理 |
|------|--------|----------|
| Clock | widgets/Clock.tsx | ✅ 零耦合，直接搬 |
| DataStream | widgets/DataStream.tsx | ✅ 直接搬 |
| NetworkStatus / SystemStatus | 同上 | ✅ 直接搬 |
| VirtualKeyboard | widgets/VirtualKeyboard.tsx | ✅ 直接搬 |
| CPUWave / AudioWave | 同上 | 改 store → props |
| Funds / NFTCard / ProcessTable / TaskCountdown / AgentQ | 同上 | 改 store → props（每个 <100 行，工作量小） |

### 3. 面板与结构组件（`components/edex/`）

| 组件 | 原来源 | 说明 |
|------|--------|------|
| PanelFrame | edex/panel-frame.tsx | ✅ 面板框架，最核心的结构组件 |
| ScrambleText | edex/scramble-text.tsx | ✅ 招牌动效：乱码→解码文字 |
| LineGraph | edex/line-graph.tsx | ✅ 实时折线图 |
| Globe | edex/globe.tsx | ✅ 纯 canvas 地球仪（无 three.js 依赖） |
| Keyboard | edex/keyboard.tsx | 开机错位动画键盘 |
| BootOverlay | edex/boot-overlay.tsx | 开机序列覆盖层 |
| DataStreamPanel | edex/datastream-panel.tsx | 数据流面板 |
| TerminalPanel | edex/terminal-panel.tsx | 终端面板（剥离业务命令，保留壳 + mock 输出） |
| SystemPanel | edex/system-panel.tsx | 系统监控面板（剥离业务数据源） |

### 4. 交互组件（从 `components/terminal/` 提炼通用部分）

| 组件 | 说明 |
|------|------|
| Modal（源自 Popup.tsx） | 弹窗壳：遮罩渐显 + 面板缩放浮入 + 音效钩子（可选） |
| IntroModal | "加密包解压弹入"式高规格进场弹窗 |
| HairlineInput | 发丝下划线输入框封装 |

> 业务组件（drill、story、auth、placement 等）**不搬**，与英语学习业务强耦合。

## 六、实施阶段

### M1 · 骨架搭建（先跑通）
1. 新建 Next.js 项目（可整包复制 frontend 后删除业务代码，最快）
2. 移植 globals.css 主题层，清理业务注释，加英文注释
3. 移植 layout + 字体 + 扫描线/网格背景
4. 首页 Hero：ScrambleText 打字 + BootOverlay 开机序列 —— **首页即活广告**

### M2 · 组件移植
1. 按上面清单搬组件，逐个去 store 耦合、改 props API
2. 每个组件建立 `/components/<name>` 演示页：可交互 Demo + 参数表 + 源码
3. showcase 基础设施：SideNav 导航、DemoCard（demo/源码切换）、ThemeShowcase（色板页）

### M3 · 打磨与开源化
1. README：GIF 演示图（用录制工具截开机序列/ScrambleText 动效）、安装方式（复制源码 or npm）
2. License 选择：MIT（需确认原项目 eDEX-UI 主题溯源部分的许可兼容性，见下）
3. GitHub Actions CI（lint + build）、种子徽章
4. （可选二期）打包为 npm 包 `cyberdeck-ui`：组件以复制即用为主，npm 为辅

### 发布渠道
- 演示站：GitHub Pages 或 Vercel（Next.js 导出静态站即可，组件全部客户端渲染）
- 传播：reddit r/cyberdeck、r/reactjs、V2EX、掘金、X

## 七、风险与注意点

1. **许可溯源**：原项目 globals.css 注明主题"源自 template/edex-ui"。eDEX-UI 是开源项目，移植前需核对其许可证（及其对衍生的要求），在 NOTICE / README 中注明来源与致谢。这是开源前必须做的一步。
2. **命名冲突**：发布 npm / GitHub 前检索 `cyberdeck-ui` 是否已被占用，被占用则启用备选名。
3. **TTS / 音效等业务功能**：`lib/sfx.ts`（音效）如需保留，抽成可选 hook，默认静音。
4. **移动端适配**：原项目有 dvh/触摸适配 CSS（`.h-dvh-safe` 等），一并搬入主题层。

## 八、成功标准

- [ ] `npm run dev` 打开首页，10 秒内能看到开机序列 + 乱码解码动效
- [ ] ≥ 20 个组件各有独立演示页，Demo 可交互、源码可复制
- [ ] 组件代码零业务耦合、零 zustand 依赖
- [ ] README 有动效 GIF，Star 转化路径清晰（demo 站顶部放 GitHub 链接）

---

## 九、实施记录（更新于 2026-10-24）

M1 + M2 主体已完成并通过构建与浏览器实测：

- 主题层 / 布局 / 字体已移植，英文注释；组件全部去 store 耦合，改为 props API
- 演示站共 18 个静态路由：首页 Hero + 12 个组件演示页 + `/workstation`
- 原版三个业务面板（Terminal / System / Mission）按原布局用 mock 数据重建，
  位于 `src/components/workstation/`；`/workstation` 复刻原版 workstation 双行布局
  （上区 SYSTEM | TERMINAL | MISSION，下区 DATASTREAM | KEYBOARD+控制行），
  含完整开机序列 + Web Audio 音效，sessionStorage 会话内跳过重放
- 首页只保留 Hero 与入口按钮（ENTER WORKSTATION / BROWSE COMPONENTS / GITHUB），
  原型预览区移入 workstation 页
- 修复项：canvas 中 CSS 变量不生效（AudioWave/CPUWave 改 getComputedStyle 取色）、
  SideNav 桌面态纵向排列、终端输入 Enter 改 onKeyDown 直接触发（弃用无按钮表单隐式提交）

待办（M3）：README + GIF、License 核对（eDEX-UI 溯源）、CI、npm 包（可选）。

### M3 完成情况（2026-10-24 第二批）

- ✅ 许可核对：eDEX-UI（GitSquared/edex-ui）为 MIT，与本项目兼容；LICENSE 采用 MIT 并附溯源说明
- ✅ README：中英双语（中文优先）+ docs/media 五张演示截图（首页 / 开机序列 / 工作站 / 组件演示 ×2）
- ✅ CI：.github/workflows/ci.yml（npm ci → tsc → lint → build）
- ✅ ESLint 配置（.eslintrc.json，next/core-web-vitals），lint 零告警
- ✅ .gitignore

### 剩余待办（发布前）

- [x] 2026-10-25 仓库已建：github.com/abitfox/cyberdeck-ui，README/SideNav 占位链接已替换
- [ ] 部署演示站（推荐 Vercel；GitHub Pages 需改 next.config 为 output:"export" 并加 basePath）
- [x] 2026-10-25 名称检索：GitHub 无占用（npm 发布前仍需检索）
- [ ] （可选二期）npm 打包 cyberdeck-ui
