"use client";

import { useEffect, useRef, useState } from "react";
import { playTypeTick } from "@/lib/sfx";

/** 乱码字符池：解码感来自这些随机符号逐步"落定"为真实文本 */
const GLYPHS = "!<>-_\\/[]{}=+*^?#%&@$01";

/** 超过此长度的文本不做乱码（总时长 ≈ 字符数×speed，长文会解码半天且高频重渲染闪烁） */
const SCRAMBLE_MAX_CHARS = 200;

/** 自适应加速：解码总时长上限（ms），短文本不受影响，中长文本按长度提速 */
const SCRAMBLE_MAX_DURATION = 1600;

interface ScrambleTextProps {
  text: string;
  /** 启动延迟（ms），用于多行文字错峰节奏 */
  delay?: number;
  /** 每 tick 间隔（ms），越小节奏越快 */
  speed?: number;
  /** 每个字符落定前额外乱码跳动的 tick 数区间——越大解码感越明显 */
  churn?: [number, number];
  /** 解码期间播放打字音效（全局节流，多行并行也安全） */
  sound?: boolean;
  className?: string;
  /** false 时不启动（配合开机序列的 stage 控制） */
  active?: boolean;
}

/**
 * 乱码打字机 v2：字符从左到右依序"落定"，但每个字符在落定前
 * 会以随机乱码跳动一段随机时长（churn 区间），形成有质感的解码波。
 * 初始渲染用等宽空格占位，宽度稳定不跳动。
 */
export function ScrambleText({
  text,
  delay = 0,
  speed = 34,
  churn = [3, 8],
  sound = false,
  className,
  active = true,
}: ScrambleTextProps) {
  const chars = Array.from(text);
  const longText = chars.length > SCRAMBLE_MAX_CHARS;
  const [out, setOut] = useState<string>(() =>
    longText ? text : "\u00A0".repeat(chars.length),
  );
  const churnRef = useRef(churn);
  churnRef.current = churn;
  const soundRef = useRef(sound);
  soundRef.current = sound;

  useEffect(() => {
    if (!active) return;
    const n = chars.length;
    if (n === 0 || longText) {
      setOut(text);
      return;
    }

    /* 自适应速度：短文本按 speed 走；中长文本提速，总解码时长封顶 ~1.6s
     * （如 100 字符 @speed20 原本 2.2s+churn → 16ms/帧 1.6s 内完成，肉眼更快更稳） */
    const effSpeed = Math.max(4, Math.min(speed, Math.ceil(SCRAMBLE_MAX_DURATION / n)));

    // 预生成每个字符的落定帧：整体从左到右推进，个体带随机抖动
    const [lo, hi] = churnRef.current;
    const settle: number[] = [];
    for (let i = 0; i < n; i++) {
      settle.push(i + lo + Math.floor(Math.random() * (hi - lo + 1)));
    }
    const maxFrame = Math.max(...settle);

    let frame = 0;
    let timer: number | undefined;
    const starter = window.setTimeout(() => {
      timer = window.setInterval(() => {
        frame += 1;
        if (frame > maxFrame) {
          setOut(text);
          window.clearInterval(timer);
          return;
        }
        if (soundRef.current) playTypeTick();
        let s = "";
        for (let i = 0; i < n; i++) {
          s +=
            frame >= settle[i]
              ? chars[i]
              : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setOut(s);
      }, effSpeed);
    }, delay);

    return () => {
      window.clearTimeout(starter);
      if (timer) window.clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, delay, speed, active]);

  return <span className={className}>{out}</span>;
}
