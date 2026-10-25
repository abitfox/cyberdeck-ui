/* 全站音效引擎 —— 配置驱动版。
 *
 * 所有音效参数集中在 public/sounds.json：
 *   - slots:   音效位 → 预设 ID 的映射（改这里即可全局换音，刷新生效）
 *   - presets: 全部候选音效预设（group 归属音效位，sound-lab.html 据此分组试听）
 * 运行时首次出声前异步拉取 /sounds.json，拉取成功前先用内置 DEFAULT（内容同源）。
 * 试听工具：/sound-lab.html
 *
 * 预设 schema：
 *   layer = {
 *     kind: "osc" | "noise",        // 振荡器 或 噪声爆发
 *     wave: "sine"|"square"|"sawtooth"|"triangle",   // osc 专用
 *     freq, freqEnd?,               // 频率（Hz），freqEnd 存在则线性滑向终点
 *     at?,                          // 相对音效起点的偏移（秒）
 *     dur,                          // 时长（秒）
 *     gain, attack?,                // 峰值音量、起音时间（秒）
 *     filter?: { type, freq, freqEnd?, q? }   // 可选双二阶滤波器
 *   }
 */

type OscWave = "sine" | "square" | "sawtooth" | "triangle";

interface Layer {
  kind?: "osc" | "noise";
  wave?: OscWave;
  /** 振荡器频率（Hz）；noise 层可省略（滤波频率放 filter.freq） */
  freq?: number;
  freqEnd?: number;
  at?: number;
  dur: number;
  gain: number;
  attack?: number;
  filter?: { type: string; freq: number; freqEnd?: number; q?: number };
}

interface Preset {
  name: string;
  group: string;
  /** 同一音效位两次触发的最小间隔（ms），用于打字类高频音效 */
  throttle?: number;
  /** 采样文件路径（public/ 下，如 "/mechanical-keyboard-44701.mp3"）；存在则忽略 layers */
  sample?: string;
  /** 采样截取起始偏移（秒），用于从长录音中取出单击瞬态 */
  sampleOffset?: number;
  /** 截取时长（秒），缺省播到文件结尾 */
  sampleDur?: number;
  /** 采样音量（0-1） */
  sampleGain?: number;
  /** 播放速率随机抖动幅度（0-1，默认 0.06），连发时避免每次一模一样 */
  jitter?: number;
  layers: Layer[];
}

interface SoundConfig {
  /** 全局主音量倍率（1 = 预设原始音量，2 = 翻倍；压缩器兜底防爆音） */
  masterVolume?: number;
  slots: Record<string, string>;
  presets: Record<string, Preset>;
}

/* ============ 音效位与预设总表（与 public/sounds.json 同源） ============ */

const DEFAULT_CONFIG: SoundConfig = {
  masterVolume: 1,
  slots: {
    typeTick: "T6",
    keyClick: "K1",
    terminalPrint: "P1",
    bootBlip: "B1",
    bootSweep: "S1",
    bootEngage: "E1",
    uiClick: "C2",
    panelExpand: "X1",
    taskPass: "W1",
    taskFail: "W2",
  },
  presets: {
    T1: { name: "硬朗电传嗒", group: "typeTick", throttle: 40, layers: [{ kind: "noise", filter: { type: "bandpass", freq: 4000, q: 2 }, dur: 0.018, gain: 0.07, attack: 0.001 }, { kind: "osc", wave: "square", freq: 1900, dur: 0.012, gain: 0.02, attack: 0.001 }] },
    T2: { name: "经典终端哔", group: "typeTick", throttle: 40, layers: [{ kind: "osc", wave: "square", freq: 1040, dur: 0.022, gain: 0.025, attack: 0.004 }] },
    T3: { name: "软滴答", group: "typeTick", throttle: 40, layers: [{ kind: "osc", wave: "sine", freq: 1250, freqEnd: 850, dur: 0.03, gain: 0.03, attack: 0.003 }] },
    T4: { name: "上扬泡泡", group: "typeTick", throttle: 40, layers: [{ kind: "osc", wave: "sine", freq: 420, freqEnd: 820, dur: 0.028, gain: 0.035, attack: 0.003 }] },
    T5: { name: "老式电传连响", group: "typeTick", throttle: 35, layers: [{ kind: "osc", wave: "square", freq: 1560, dur: 0.014, gain: 0.028, attack: 0.001 }, { kind: "noise", filter: { type: "highpass", freq: 6000, q: 1 }, dur: 0.01, gain: 0.02, attack: 0.001 }] },
    T6: { name: "机械键盘采样·单击", group: "typeTick", throttle: 40, sample: "/mechanical-keyboard-44701.mp3", sampleOffset: 0.08, sampleDur: 0.16, sampleGain: 0.6, layers: [] },
    K1: { name: "机械青轴（现行）", group: "keyClick", layers: [{ kind: "noise", filter: { type: "bandpass", freq: 3200, q: 0.9 }, dur: 0.03, gain: 0.1, attack: 0.001 }, { kind: "osc", wave: "sine", freq: 170, freqEnd: 110, dur: 0.03, gain: 0.08, attack: 0.001 }] },
    K2: { name: "薄膜轻触", group: "keyClick", layers: [{ kind: "noise", filter: { type: "bandpass", freq: 2100, q: 1.2 }, dur: 0.015, gain: 0.05, attack: 0.001 }, { kind: "osc", wave: "sine", freq: 240, dur: 0.012, gain: 0.03, attack: 0.001 }] },
    K3: { name: "复古打字机", group: "keyClick", layers: [{ kind: "noise", filter: { type: "bandpass", freq: 1400, q: 0.8 }, dur: 0.04, gain: 0.14, attack: 0.001 }, { kind: "osc", wave: "sine", freq: 120, freqEnd: 70, dur: 0.05, gain: 0.12, attack: 0.001 }] },
    K4: { name: "电子哔键", group: "keyClick", layers: [{ kind: "osc", wave: "square", freq: 2100, dur: 0.015, gain: 0.035, attack: 0.002 }] },
    K5: { name: "机械键盘采样·单击", group: "keyClick", throttle: 55, sample: "/mechanical-keyboard-44701.mp3", sampleOffset: 0.08, sampleDur: 0.16, sampleGain: 0.7, layers: [] },
    P1: { name: "六连上行 tick（现行）", group: "terminalPrint", layers: [{ kind: "osc", wave: "square", freq: 880, at: 0, dur: 0.04, gain: 0.028, attack: 0.003 }, { kind: "osc", wave: "square", freq: 940, at: 0.075, dur: 0.04, gain: 0.028, attack: 0.003 }, { kind: "osc", wave: "square", freq: 1000, at: 0.15, dur: 0.04, gain: 0.028, attack: 0.003 }, { kind: "osc", wave: "square", freq: 1060, at: 0.225, dur: 0.04, gain: 0.028, attack: 0.003 }, { kind: "osc", wave: "square", freq: 1120, at: 0.3, dur: 0.04, gain: 0.028, attack: 0.003 }, { kind: "osc", wave: "square", freq: 1180, at: 0.375, dur: 0.04, gain: 0.028, attack: 0.003 }] },
    P2: { name: "打印头扫描", group: "terminalPrint", layers: [{ kind: "noise", filter: { type: "bandpass", freq: 2600, q: 1.5 }, at: 0, dur: 0.04, gain: 0.05, attack: 0.003 }, { kind: "noise", filter: { type: "bandpass", freq: 2600, q: 1.5 }, at: 0.06, dur: 0.04, gain: 0.05, attack: 0.003 }, { kind: "noise", filter: { type: "bandpass", freq: 2600, q: 1.5 }, at: 0.12, dur: 0.04, gain: 0.05, attack: 0.003 }, { kind: "noise", filter: { type: "bandpass", freq: 2600, q: 1.5 }, at: 0.18, dur: 0.04, gain: 0.05, attack: 0.003 }] },
    P3: { name: "双音滴-滴", group: "terminalPrint", layers: [{ kind: "osc", wave: "sine", freq: 1320, at: 0, dur: 0.05, gain: 0.04, attack: 0.005 }, { kind: "osc", wave: "sine", freq: 990, at: 0.08, dur: 0.06, gain: 0.04, attack: 0.005 }] },
    P4: { name: "下行数据滴", group: "terminalPrint", layers: [{ kind: "osc", wave: "square", freq: 1500, at: 0, dur: 0.035, gain: 0.028, attack: 0.003 }, { kind: "osc", wave: "square", freq: 1100, at: 0.06, dur: 0.035, gain: 0.028, attack: 0.003 }, { kind: "osc", wave: "square", freq: 820, at: 0.12, dur: 0.04, gain: 0.028, attack: 0.003 }] },
    B1: { name: "下滑电子音（现行）", group: "bootBlip", layers: [{ kind: "osc", wave: "sine", freq: 1240, freqEnd: 620, dur: 0.12, gain: 0.06, attack: 0.01 }] },
    B2: { name: "短促方波笛", group: "bootBlip", layers: [{ kind: "osc", wave: "square", freq: 990, dur: 0.06, gain: 0.04, attack: 0.005 }] },
    B3: { name: "上扬水滴", group: "bootBlip", layers: [{ kind: "osc", wave: "sine", freq: 700, freqEnd: 1500, dur: 0.1, gain: 0.05, attack: 0.005 }] },
    S1: { name: "锯齿功率上扫（现行）", group: "bootSweep", layers: [{ kind: "osc", wave: "sawtooth", freq: 140, freqEnd: 980, dur: 0.55, gain: 0.07, attack: 0.02, filter: { type: "lowpass", freq: 900, freqEnd: 4200, q: 1 } }] },
    S2: { name: "纯净正弦上滑", group: "bootSweep", layers: [{ kind: "osc", wave: "sine", freq: 220, freqEnd: 920, dur: 0.5, gain: 0.08, attack: 0.02 }] },
    S3: { name: "五度和弦展开", group: "bootSweep", layers: [{ kind: "osc", wave: "sine", freq: 330, at: 0, dur: 0.5, gain: 0.05, attack: 0.02 }, { kind: "osc", wave: "sine", freq: 495, at: 0.06, dur: 0.45, gain: 0.045, attack: 0.02 }, { kind: "osc", wave: "sine", freq: 660, at: 0.12, dur: 0.4, gain: 0.04, attack: 0.02 }] },
    E1: { name: "低频冲击+金属ping（现行）", group: "bootEngage", layers: [{ kind: "osc", wave: "sine", freq: 95, freqEnd: 42, dur: 0.3, gain: 0.16, attack: 0.008 }, { kind: "osc", wave: "sine", freq: 1560, at: 0.06, dur: 0.22, gain: 0.05, attack: 0.006 }] },
    E2: { name: "深空嗡鸣落地", group: "bootEngage", layers: [{ kind: "osc", wave: "sine", freq: 60, dur: 0.5, gain: 0.14, attack: 0.01 }, { kind: "osc", wave: "sine", freq: 220, freqEnd: 180, dur: 0.4, gain: 0.05, attack: 0.01 }] },
    E3: { name: "金属钟鸣", group: "bootEngage", layers: [{ kind: "osc", wave: "sine", freq: 880, dur: 0.8, gain: 0.06, attack: 0.003 }, { kind: "osc", wave: "sine", freq: 884, dur: 0.8, gain: 0.05, attack: 0.003 }, { kind: "osc", wave: "sine", freq: 1320, at: 0.02, dur: 0.6, gain: 0.03, attack: 0.003 }] },
    C1: { name: "短促方波哔", group: "uiClick", layers: [{ kind: "osc", wave: "square", freq: 660, dur: 0.04, gain: 0.04, attack: 0.003 }] },
    C2: { name: "柔和双音滴", group: "uiClick", layers: [{ kind: "osc", wave: "sine", freq: 520, freqEnd: 760, dur: 0.06, gain: 0.05, attack: 0.004 }] },
    C3: { name: "机械咔哒", group: "uiClick", layers: [{ kind: "noise", filter: { type: "bandpass", freq: 1500, q: 2 }, dur: 0.02, gain: 0.08, attack: 0.001 }, { kind: "osc", wave: "sine", freq: 900, dur: 0.015, gain: 0.02, attack: 0.001 }] },
    X1: { name: "快速上滑展开", group: "panelExpand", layers: [{ kind: "osc", wave: "sine", freq: 300, freqEnd: 900, dur: 0.12, gain: 0.06, attack: 0.008 }] },
    X2: { name: "气流-pop", group: "panelExpand", layers: [{ kind: "noise", filter: { type: "highpass", freq: 1200, q: 1 }, dur: 0.08, gain: 0.05, attack: 0.002 }, { kind: "osc", wave: "sine", freq: 520, freqEnd: 900, at: 0.06, dur: 0.08, gain: 0.05, attack: 0.004 }] },
    X3: { name: "双泡泡", group: "panelExpand", layers: [{ kind: "sine" as const, wave: "sine" as const, freq: 380, freqEnd: 700, dur: 0.08, gain: 0.05, attack: 0.004 } as unknown as Layer, { kind: "osc", wave: "sine", freq: 520, freqEnd: 980, at: 0.07, dur: 0.08, gain: 0.05, attack: 0.004 } as unknown as Layer] },
    W1: { name: "破译成功·上行确认", group: "taskPass", layers: [{ kind: "osc", wave: "sine", freq: 660, dur: 0.09, gain: 0.055, attack: 0.004 }, { kind: "osc", wave: "sine", freq: 880, at: 0.09, dur: 0.09, gain: 0.055, attack: 0.004 }, { kind: "osc", wave: "sine", freq: 1320, at: 0.18, dur: 0.26, gain: 0.05, attack: 0.004 }, { kind: "osc", wave: "triangle", freq: 2640, at: 0.2, dur: 0.16, gain: 0.018, attack: 0.004 }] },
    W2: { name: "破译失败·拒绝低鸣", group: "taskFail", layers: [{ kind: "osc", wave: "square", freq: 220, freqEnd: 116, dur: 0.3, gain: 0.05, attack: 0.006, filter: { type: "lowpass", freq: 900, freqEnd: 420, q: 1.2 } }, { kind: "osc", wave: "square", freq: 180, freqEnd: 96, at: 0.16, dur: 0.26, gain: 0.04, attack: 0.006, filter: { type: "lowpass", freq: 720, freqEnd: 360, q: 1.2 } }] },
  },
};

/* ============ 上下文与配置加载 ============ */

let ctx: AudioContext | null = null;
let cfg: SoundConfig | null = null;
let cfgFetched = false;
const lastPlayed: Record<string, number> = {};

function createCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    return AC ? new AC() : null;
  } catch {
    return null;
  }
}

/** 用户手势时调用：尽早解锁音频上下文并预热采样 */
export function unlockBootAudio() {
  fetchConfig();
  if (!ctx) ctx = createCtx();
  try {
    void ctx?.resume();
  } catch {
    /* 忽略 */
  }
  preloadSamples();
}

/** 取可用上下文；仍被自动播放策略挂起则返回 null（本次静默） */
function getRunningCtx(): AudioContext | null {
  fetchConfig();
  if (!ctx) ctx = createCtx();
  return ctx && ctx.state === "running" ? ctx : null;
}

/** 异步拉取 public/sounds.json，成功后覆盖内置默认（失败保持默认，静默容错） */
function fetchConfig() {
  if (cfgFetched || typeof window === "undefined") return;
  cfgFetched = true;
  fetch("/sounds.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((j: SoundConfig | null) => {
      if (j && j.slots && j.presets) {
        cfg = j;
        applyMasterVolume();
      }
    })
    .catch(() => {
      /* 保持默认 */
    });
}

/* ============ 全局主音量 ============ */

let masterGain: GainNode | null = null;
let masterCtx: AudioContext | null = null;

/** 主输出总线：所有音效统一走 masterGain → 压缩器 → 扬声器。
 *  masterVolume 是全局倍率（sounds.json 顶部），压缩器防止调大后多音效叠加爆音。 */
function masterOut(c: AudioContext): AudioNode {
  if (!masterGain || masterCtx !== c) {
    masterCtx = c;
    masterGain = c.createGain();
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -12;
    comp.knee.value = 24;
    comp.ratio.value = 6;
    comp.attack.value = 0.003;
    comp.release.value = 0.12;
    masterGain.connect(comp).connect(c.destination);
    applyMasterVolume();
  }
  return masterGain;
}

function applyMasterVolume() {
  const v = Math.max(0, (cfg ?? DEFAULT_CONFIG).masterVolume ?? 1);
  if (masterGain && masterCtx) {
    masterGain.gain.setTargetAtTime(v, masterCtx.currentTime, 0.02);
  }
}

/** 运行时调主音量（0 或负数视为静音） */
export function setMasterVolume(v: number) {
  if (cfg) cfg.masterVolume = Math.max(0, v);
  applyMasterVolume();
}

function resolvePreset(slot: string): Preset | null {
  const c = cfg ?? DEFAULT_CONFIG;
  const id = c.slots[slot];
  return id ? (c.presets[id] ?? null) : null;
}

/* ============ 采样支持 ============ */

const sampleCache = new Map<string, AudioBuffer>();
const samplePending = new Set<string>();

/** 异步加载并解码采样（幂等；失败静默） */
function loadSample(c: AudioContext, url: string) {
  if (sampleCache.has(url) || samplePending.has(url)) return;
  samplePending.add(url);
  fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.arrayBuffer();
    })
    .then((ab) => c.decodeAudioData(ab))
    .then((buf) => {
      sampleCache.set(url, buf);
      samplePending.delete(url);
    })
    .catch(() => {
      samplePending.delete(url);
    });
}

/** 用户手势解锁后预热全部采样（打字音在开机几秒后才触发，来得及） */
function preloadSamples() {
  const c = ctx;
  if (!c) return;
  const conf = cfg ?? DEFAULT_CONFIG;
  for (const p of Object.values(conf.presets)) {
    if (p.sample) loadSample(c, p.sample);
  }
}

/** 播放采样片段：随机抖动播放速率 + 快速衰减包络，模拟真实连打 */
function playSample(c: AudioContext, at: number, p: Preset) {
  const url = p.sample!;
  const buf = sampleCache.get(url);
  if (!buf) {
    loadSample(c, url); // 未就绪：本次静默，预热后即正常
    return;
  }
  const offset = p.sampleOffset ?? 0;
  const avail = buf.duration - offset;
  if (avail <= 0) return;
  const dur = Math.min(p.sampleDur ?? avail, avail);
  const jitter = p.jitter ?? 0.06;
  const rate = 1 + (Math.random() * 2 - 1) * jitter;
  const src = c.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = rate;
  const g = c.createGain();
  g.gain.setValueAtTime(p.sampleGain ?? 0.6, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur / rate);
  src.connect(g).connect(masterOut(c));
  src.start(at, offset, dur / rate);
}

/* ============ 合成引擎 ============ */

function renderLayer(c: AudioContext, t0: number, l: Layer) {
  const at = t0 + (l.at ?? 0);
  const attack = l.attack ?? 0.005;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(Math.max(l.gain, 0.0002), at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + l.dur);

  let node: AudioNode;
  if (l.kind === "noise") {
    const dur = l.dur + 0.05;
    const buffer = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buffer;
    src.start(at);
    node = src;
  } else {
    const osc = c.createOscillator();
    osc.type = l.wave ?? "sine";
    osc.frequency.setValueAtTime(l.freq ?? 440, at);
    if (l.freqEnd && l.freqEnd > 0) {
      osc.frequency.exponentialRampToValueAtTime(l.freqEnd, at + l.dur);
    }
    osc.start(at);
    osc.stop(at + l.dur + 0.05);
    node = osc;
  }

  if (l.filter) {
    const f = c.createBiquadFilter();
    f.type = l.filter.type as BiquadFilterType;
    f.Q.value = l.filter.q ?? 1;
    f.frequency.setValueAtTime(l.filter.freq, at);
    if (l.filter.freqEnd && l.filter.freqEnd > 0) {
      f.frequency.exponentialRampToValueAtTime(l.filter.freqEnd, at + l.dur);
    }
    node.connect(f);
    f.connect(gain);
  } else {
    node.connect(gain);
  }
  gain.connect(masterOut(c));
}

/** 按音效位播放：解析 slots → 预设 → 逐层合成（含节流） */
export function playSlot(slot: string) {
  const c = getRunningCtx();
  if (!c) return;
  const preset = resolvePreset(slot);
  if (!preset) return;
  const now = c.currentTime;
  const throttle = (preset.throttle ?? 0) / 1000;
  if (throttle > 0 && now - (lastPlayed[slot] ?? -Infinity) < throttle) return;
  lastPlayed[slot] = now;
  if (preset.sample) {
    playSample(c, now, preset);
    return;
  }
  for (const layer of preset.layers) renderLayer(c, now, layer);
}

/* ============ 对外音效接口（音效位语义化封装） ============ */

/** 打字机单字（乱码解码期间逐帧触发，slot 内置节流） */
export const playTypeTick = () => playSlot("typeTick");
/** 键盘敲击 */
export const playKeyClick = () => playSlot("keyClick");
/** 终端欢迎语行输出 */
export const playTerminalPrint = () => playSlot("terminalPrint");
/** 开机 stage1：矩形框渐显 */
export const playBootBlip = () => playSlot("bootBlip");
/** 开机 stage3：矩形扩张成终端外框 */
export const playBootSweep = () => playSlot("bootSweep");
/** 开机 stage4：覆盖层淡出露出面板外框 */
export const playBootEngage = () => playSlot("bootEngage");
/** 通用按钮点击 */
export const playUiClick = () => playSlot("uiClick");
/** 面板/环节展开显现 */
export const playPanelExpand = () => playSlot("panelExpand");
/** 答题通过（上行确认音） */
export const playTaskPass = () => playSlot("taskPass");
/** 答题失败（下行拒绝音） */
export const playTaskFail = () => playSlot("taskFail");
