<div align="center">

# Cyberdeck UI

**赛博朋克 / 黑客工作站风格的 React UI 组件库 —— CRT 扫描线、开机序列、乱码解码动效、实时遥测小部件。**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![CI](https://github.com/abitfox/cyberdeck-ui/actions/workflows/ci.yml/badge.svg)](./.github/workflows/ci.yml)

[English](./README.md)

</div>

---

> ▶ **在线演示：[www.hackerenglish.com](https://www.hackerenglish.com)** —— 用这套组件库搭建的完整黑客工作站。

几分钟搭出 eDEX-UI 质感的界面：带系统遥测的黑客桌面、可交互终端、线框地球仪、CRT 覆盖层，以及一整套开机序列演出。所有组件基于 React 18 + Tailwind，纯 props 驱动，零业务逻辑、零重型依赖（没有 three.js、没有 framer-motion、没有状态库）。

<div align="center">
  <img src="docs/media/workstation.png" alt="Cyberdeck UI 工作站" width="860" />
</div>

<p align="center"><sub>完整工作站 —— 系统遥测 · 可交互终端 · 任务面板 · 数据流 · 机械键盘</sub></p>

## 特性

- **完整工作站演示** —— 一整块拼装好的黑客桌面（系统面板 / 可交互终端 / 任务面板 / 数据流 / 机械键盘），首页一键进入（`/workstation`）。
- **20+ 组件** —— `ScrambleText`、`BootOverlay`、`PanelFrame`、`Globe`、`CPUWave`、`AudioWave`、`DataStreamPanel`、`TaskCountdown`、`Keyboard`、`AgentQ`、`Modal` 等，每个组件都有在线演练场（Demo / Code 双页签）。
- **CSS 变量主题** —— 所有颜色、辉光、发丝线都是变量；覆盖 `:root` 即可整站换色。
- **组件零依赖** —— 只依赖 `react` + `clsx`；图形纯手绘 canvas，音效由 Web Audio 实时合成（不需要音频资源）。
- **移动端适配** —— dvh 动态视口、触控行为适配、响应式工作站布局。

## 截图预览

| 开机序列 | 首页 |
| --- | --- |
| ![开机序列](docs/media/boot-sequence.png) | ![首页](docs/media/home-hero.png) |

| 演练场 · 遥测小部件 | 演练场 · ScrambleText |
| --- | --- |
| ![遥测演练场](docs/media/components-telemetry.png) | ![ScrambleText 演练场](docs/media/components-scramble-text.png) |

## 快速开始

```bash
npm install
npm run dev
# 打开 http://localhost:3000
```

- `/` —— 首页（含标志性开机序列）
- `/workstation` —— 完整黑客工作站演示
- `/components/*` —— 各组件演练场

## 使用组件

按需复制即可 —— 组件都在 `frontend/src` 下、相互独立：

```
src/
├── app/globals.css            # 整套设计系统（CSS 变量 + 工具类）
├── components/
│   ├── widgets/               # 仪表小部件（Clock、Funds、CPUWave …）
│   ├── edex/                  # 面板与动效（PanelFrame、ScrambleText、BootOverlay …）
│   └── workstation/           # 组装好的工作站演示面板
└── lib/                       # 可选辅助：音效引擎、特效/全屏开关
```

```tsx
import { PanelFrame } from "@/components/edex/panel-frame";
import { ScrambleText } from "@/components/edex/scramble-text";

<PanelFrame leftLabel="SYSTEM" rightLabel="DECK-07">
  <ScrambleText text="ALL SYSTEMS NOMINAL" speed={40} />
</PanelFrame>
```

页面根节点加上 `booted` 类即可驱动 `.boot-seq` / `.key-in` 错峰进场动画；
`<html>` 上加 `edex-scanlines hacker-bg` 获得扫描线 + 网格背景。

## 组件索引

| 分组 | 组件 |
| --- | --- |
| 文字动效 | `ScrambleText`（乱码解码打字机） |
| 面板 | `PanelFrame`、`DataStreamPanel`、`Modal`（popup / intro 两种进场） |
| 状态小部件 | `Clock`、`NetworkStatus`、`SystemStatus`、`Funds`、`ProcessTable`、`NFTCard`、`AgentQ` |
| 遥测 | `CPUWave`、`AudioWave`、`DataStream`、`TaskCountdown`、`LineGraph` |
| 特效 | `BootOverlay`、`Globe`、`ShaderBackground`（WebGL） |
| 输入 | `Keyboard`、`VirtualKeyboard`、`.hairline` 输入框样式 |

演练场源码见 `frontend/src/app/components/*`。

## 目录结构

```
27_CyberdeckUI/
├── docs/            # 方案与实施记录
├── frontend/        # Next.js 14 演示站 + 组件库
└── LICENSE          # MIT（附 eDEX-UI 溯源说明）
```

## 许可

[MIT](./LICENSE) —— 视觉语言启发自（部分衍生自）[eDEX-UI](https://github.com/GitSquared/edex-ui)（MIT）。内置 Share Tech Mono 字体采用 SIL OFL 许可。
