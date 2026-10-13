"use client";

/**
 * CircularText (Originkit "Text Ring") — 원형으로 둘러 회전하는 글자. 2026-09-21 사용자 제공 코드 이식.
 *  원본 대비 변경: __OriginkitBase_* 이름을 PascalCase(CircularTextBase)로 (lowercase 이름은 hooks 린트 미적용 함정),
 *  프리셋 폰트 Roboto → 사이트 폰트(Pretendard Variable, 200 지원), 폰트 로드 후 재측정(fontTick). 나머지 로직은 원본 그대로.
 *  화면 배치는 CornerRing.tsx 가 담당한다.
 */
import * as React from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  type AnimationPlaybackControls,
} from "framer-motion";

type FontStyle = React.CSSProperties & {
  fontFamily?: string;
  fontWeight?: number | string;
  fontSize?: number | string;
  letterSpacing?: number | string;
  variant?: string;
};

type HoverEffect = "speed" | "pause" | "scale";

type TransitionValue = {
  type?: string;
  duration?: number;
  delay?: number;
  ease?: string | number[];
};

type Props = {
  words?: string[];
  separator?: string;
  diameter?: number;
  font?: FontStyle;
  color?: string;
  onHover?: HoverEffect;
  hoverScale?: number;

  hoverSpeed?: number;
  transition?: TransitionValue;
  style?: React.CSSProperties;
};

const MAX_WORDS = 10;
const DEFAULT_WORDS = ["CIRCULAR", "TEXT"];
const DEFAULT_SEPARATOR = "⁕";
const DEFAULT_DIAMETER = 320;
const MIN_LETTER_SPACING = 0;

const DEFAULT_TRANSITION: TransitionValue = {
  type: "tween",
  duration: 20,
  delay: 0,
  ease: "linear",
};

const DEFAULT_FONT: FontStyle = {
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: "24px",
  letterSpacing: "0.02em",
  lineHeight: "1em",
  textAlign: "center",
};

type Size = { width: number; height: number };

const resolveSpinDuration = (transition: TransitionValue | undefined): number => {
  const duration = transition?.duration ?? DEFAULT_TRANSITION.duration ?? 20;
  return Number.isFinite(duration) && duration > 0 ? duration : 0;
};

const resolveSpinDelay = (transition: TransitionValue | undefined): number => {
  const delay = transition?.delay ?? 0;
  return Number.isFinite(delay) && delay > 0 ? delay : 0;
};

// transform 문자열에 float 전체 정밀도(15자리+)를 그대로 넣으면 브라우저가 style 어트리뷰트를 파싱한 뒤
// CSSOM이 재직렬화하면서 자릿수를 다르게 반올림해 하이드레이션 불일치로 오탐된다 → 소수 3자리로 미리 반올림.
const round3 = (n: number): number => Math.round(n * 1000) / 1000;

const degreesPerSecond = (durationSec: number): number => {
  if (!Number.isFinite(durationSec) || durationSec <= 0) return 0;
  return 360 / durationSec;
};

const resolveHoverDuration = (hoverSpeed: number | undefined): number => {
  if (!Number.isFinite(hoverSpeed)) return 5;
  return Math.min(8, Math.max(1, hoverSpeed as number));
};

const subscribeNever = () => () => {};
// 서버 스냅샷은 항상 false, 클라이언트는 hydrate 직후부터 true → "마운트됐는가"를 setState 없이 판별
const useMounted = (): boolean =>
  useSyncExternalStore(subscribeNever, () => true, () => false);

const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const parseFontSizePx = (fontSize: FontStyle["fontSize"]): number => {
  if (typeof fontSize === "number") return fontSize;
  if (typeof fontSize === "string" && fontSize.length > 0) {
    const parsed = Number.parseFloat(fontSize);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 24;
};

const parseLetterSpacingPx = (
  letterSpacing: FontStyle["letterSpacing"],
  fontSizePx: number
): number => {
  if (typeof letterSpacing === "number") return letterSpacing;
  if (typeof letterSpacing !== "string" || letterSpacing.length === 0) return 0;

  if (letterSpacing.endsWith("em")) {
    const em = Number.parseFloat(letterSpacing);
    return Number.isFinite(em) ? em * fontSizePx : 0;
  }

  const parsed = Number.parseFloat(letterSpacing);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseFontWeight = (fontWeight: FontStyle["fontWeight"]): string => {
  if (typeof fontWeight === "number") return String(fontWeight);
  if (typeof fontWeight === "string" && fontWeight.length > 0) return fontWeight;
  return "900";
};

const parseFontFamily = (fontFamily: FontStyle["fontFamily"]): string => {
  if (typeof fontFamily === "string" && fontFamily.length > 0) {
    return fontFamily.split(",")[0]?.trim().replace(/['"]/g, "") || "sans-serif";
  }
  return "sans-serif";
};

const cleanWords = (words: string[] | undefined): string[] => {
  const cleaned = (words ?? [])
    .map((word) => word.trim())
    .filter(Boolean)
    .slice(0, MAX_WORDS);
  return cleaned.length > 0 ? cleaned : DEFAULT_WORDS;
};

const buildSegment = (words: string[], separator: string): string => {
  const glyph =
    (separator && separator.length > 0 ? separator : DEFAULT_SEPARATOR).trim() ||
    DEFAULT_SEPARATOR;
  return `${words.join(` ${glyph} `)} ${glyph} `;
};

const measureGlyphWidth = (
  letters: string[],
  fontSizePx: number,
  fontWeight: string,
  fontFamily: string,
  useCanvas: boolean
): number => {
  const widths = measureGlyphWidths(letters, fontSizePx, fontWeight, fontFamily, useCanvas);
  return widths.reduce((sum, width) => sum + width, 0);
};

// useCanvas: false 인 동안(서버 렌더 + 클라이언트 첫 렌더)에는 항상 근사치를 써서
// document 유무로 갈라지는 하이드레이션 불일치를 막는다. mounted 이후에만 canvas로 재측정.
const measureGlyphWidths = (
  letters: string[],
  fontSizePx: number,
  fontWeight: string,
  fontFamily: string,
  useCanvas: boolean
): number[] => {
  if (letters.length === 0) return [];

  if (!useCanvas || typeof document === "undefined") {
    return letters.map((letter) =>
      letter === " " ? fontSizePx * 0.35 : fontSizePx * 0.55
    );
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return letters.map((letter) =>
      letter === " " ? fontSizePx * 0.35 : fontSizePx * 0.55
    );
  }

  context.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`;
  return letters.map((letter) => {
    const glyph = letter === " " ? " " : letter;
    return context.measureText(glyph).width;
  });
};

const measureArcLength = (
  letters: string[],
  fontSizePx: number,
  fontWeight: string,
  fontFamily: string,
  letterSpacingPx: number,
  useCanvas: boolean
): number => {
  if (letters.length === 0) return 0;
  return (
    measureGlyphWidth(letters, fontSizePx, fontWeight, fontFamily, useCanvas) +
    letterSpacingPx * letters.length
  );
};

const buildFittedCircleText = (
  words: string[],
  separator: string,
  circumference: number,
  fontSizePx: number,
  fontWeight: string,
  fontFamily: string,
  preferredLetterSpacing: number,
  useCanvas: boolean
): {
  letters: string[];
  letterSpacingPx: number;
  content: string;
  angles: number[];
} => {
  const preferred = Math.max(MIN_LETTER_SPACING, preferredLetterSpacing);
  const segment = buildSegment(words, separator);
  const segmentLetters = Array.from(segment);

  if (segmentLetters.length === 0 || circumference <= 0) {
    return {
      letters: [],
      letterSpacingPx: preferred,
      content: "",
      angles: [],
    };
  }

  const segmentAtPreferred = measureArcLength(
    segmentLetters,
    fontSizePx,
    fontWeight,
    fontFamily,
    preferred,
    useCanvas
  );

  let repeats = Math.max(1, Math.ceil(circumference / Math.max(segmentAtPreferred, 1)));
  repeats = Math.min(repeats, 48);

  const solveSpacing = (glyphTotal: number, count: number): number => {
    if (count <= 0) return preferred;
    return (circumference - glyphTotal) / count;
  };

  let content = segment.repeat(repeats);
  let letters = Array.from(content);
  let glyphWidth = measureGlyphWidth(letters, fontSizePx, fontWeight, fontFamily, useCanvas);
  let letterSpacingPx = solveSpacing(glyphWidth, letters.length);

  while (letterSpacingPx < preferred && repeats > 1) {
    repeats -= 1;
    content = segment.repeat(repeats);
    letters = Array.from(content);
    glyphWidth = measureGlyphWidth(letters, fontSizePx, fontWeight, fontFamily, useCanvas);
    letterSpacingPx = solveSpacing(glyphWidth, letters.length);
  }

  if (letterSpacingPx < preferred) {
    letterSpacingPx = Math.max(MIN_LETTER_SPACING, letterSpacingPx);
  }

  const stretchLimit = Math.max(preferred * 2.5, fontSizePx * 0.75);
  while (letterSpacingPx > stretchLimit && repeats < 48) {
    const nextRepeats = repeats + 1;
    const nextContent = segment.repeat(nextRepeats);
    const nextLetters = Array.from(nextContent);
    const nextGlyphs = measureGlyphWidth(nextLetters, fontSizePx, fontWeight, fontFamily, useCanvas);
    const nextSpacing = solveSpacing(nextGlyphs, nextLetters.length);
    if (nextSpacing < preferred) break;
    repeats = nextRepeats;
    content = nextContent;
    letters = nextLetters;
    glyphWidth = nextGlyphs;
    letterSpacingPx = nextSpacing;
  }

  const widths = measureGlyphWidths(letters, fontSizePx, fontWeight, fontFamily, useCanvas);
  const totalArc =
    widths.reduce((sum, width) => sum + width, 0) + letterSpacingPx * letters.length;

  const angles: number[] = [];
  let cursor = 0;
  for (let i = 0; i < letters.length; i += 1) {
    const width = widths[i] ?? 0;
    const center = cursor + width / 2;
    angles.push(totalArc > 0 ? (center / totalArc) * 360 : 0);
    cursor += width + letterSpacingPx;
  }

  return { letters, letterSpacingPx, content, angles };
};

const DEFAULT_PROPS: Required<Omit<Props, "style">> = {
  words: DEFAULT_WORDS,
  separator: DEFAULT_SEPARATOR,
  diameter: DEFAULT_DIAMETER,
  font: DEFAULT_FONT,
  color: "#FFFFFF",
  onHover: "speed",
  hoverScale: 0.8,
  hoverSpeed: 5,
  transition: DEFAULT_TRANSITION,
};

function CircularTextBase(props: Props) {
  const {
    words = DEFAULT_PROPS.words,
    separator = DEFAULT_PROPS.separator,
    diameter = DEFAULT_PROPS.diameter,
    font = DEFAULT_PROPS.font,
    color = DEFAULT_PROPS.color,
    onHover = DEFAULT_PROPS.onHover,
    hoverScale = DEFAULT_PROPS.hoverScale,
    hoverSpeed = DEFAULT_PROPS.hoverSpeed,
    transition = DEFAULT_PROPS.transition,
    style,
  } = props;

  const frameRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({
    width: diameter,
    height: diameter,
  });

  const rotation = useMotionValue(0);
  const scale = useMotionValue(1);
  const spinRateRef = useRef(0);
  const pausedRef = useRef(false);
  const delayUntilRef = useRef(0);
  const scaleAnimRef = useRef<AnimationPlaybackControls | null>(null);

  const spinDuration = resolveSpinDuration(transition);
  const spinDelay = resolveSpinDelay(transition);

  const fontSizePx = parseFontSizePx(font?.fontSize);
  const preferredLetterSpacing = parseLetterSpacingPx(font?.letterSpacing, fontSizePx);
  const fontWeight = parseFontWeight(font?.fontWeight);
  const fontFamily = parseFontFamily(font?.fontFamily);

  const safeDiameter = Math.max(100, diameter);

  useLayoutEffect(() => {
    const node = frameRef.current;
    if (!node) return;

    const updateSize = (width: number, height: number) => {
      const nextWidth = Math.max(0, Math.floor(width));
      const nextHeight = Math.max(0, Math.floor(height));
      setSize((prev) => {
        if (prev.width === nextWidth && prev.height === nextHeight) return prev;
        if (nextWidth < 2 || nextHeight < 2) {
          return { width: safeDiameter, height: safeDiameter };
        }
        return { width: nextWidth, height: nextHeight };
      });
    };

    updateSize(node.clientWidth, node.clientHeight);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      updateSize(entry.contentRect.width, entry.contentRect.height);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [safeDiameter]);

  const maxFrameSize = Math.max(0, Math.min(size.width, size.height));
  const ringSize = maxFrameSize > 0 ? Math.min(safeDiameter, maxFrameSize) : safeDiameter;
  const radius = Math.max(8, ringSize / 2 - fontSizePx * 0.55);
  const circumference = 2 * Math.PI * radius;

  const wordList = useMemo(() => cleanWords(words), [words]);

  // 서버 렌더는 document가 없어 근사 폭을 쓰는데, 클라이언트 첫 렌더는 document가 있어 바로 canvas로 정확히 재는 바람에
  // 하이드레이션 불일치가 났다 → mounted 이전엔 클라이언트도 근사치를 쓰도록 강제(2026-09-22 픽스).
  const mounted = useMounted();

  // 웹폰트 로드 전에 잰 글리프 폭(대체 폰트, 더 넓음)으로 반복 수가 굳는 문제 → 폰트 준비되면 한 번 다시 맞춘다 (2026-09-21 이식 시 보강)
  const [fontTick, setFontTick] = useState(0);
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) setFontTick((t) => t + 1); });
    return () => { alive = false; };
  }, []);

  const fitted = useMemo(
    () =>
      buildFittedCircleText(
        wordList,
        separator,
        circumference,
        fontSizePx,
        fontWeight,
        fontFamily,
        preferredLetterSpacing,
        mounted
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fontTick: 폰트 로드 후 재측정 트리거
    [wordList, separator, circumference, fontSizePx, fontWeight, fontFamily, preferredLetterSpacing, mounted, fontTick]
  );

  const { letters, letterSpacingPx, content, angles } = fitted;

  useEffect(() => {
    if (prefersReducedMotion() || spinDuration <= 0) {
      spinRateRef.current = 0;
      pausedRef.current = true;
      delayUntilRef.current = 0;
      scaleAnimRef.current?.stop();
      scale.set(1);
      return;
    }

    pausedRef.current = false;
    spinRateRef.current = degreesPerSecond(spinDuration);
    delayUntilRef.current = spinDelay > 0 ? performance.now() + spinDelay * 1000 : 0;
    scaleAnimRef.current?.stop();
    scale.set(1);
  }, [spinDuration, spinDelay, content, onHover, scale]);

  useAnimationFrame((_, delta) => {
    if (pausedRef.current || spinRateRef.current === 0) return;
    if (delayUntilRef.current > 0 && performance.now() < delayUntilRef.current) {
      return;
    }
    delayUntilRef.current = 0;

    const dt = Math.min(delta, 64) / 1000;
    const next = (rotation.get() + spinRateRef.current * dt) % 360;
    rotation.set(next < 0 ? next + 360 : next);
  });

  useEffect(() => {
    return () => {
      scaleAnimRef.current?.stop();
    };
  }, []);

  const animateScale = (target: number) => {
    scaleAnimRef.current?.stop();
    scaleAnimRef.current = animate(scale, target, {
      type: "spring",
      damping: 20,
      stiffness: 300,
    });
  };

  const handleHoverStart = () => {
    if (prefersReducedMotion() || !onHover || spinDuration <= 0) return;

    const hoverDurationSec = resolveHoverDuration(hoverSpeed);

    switch (onHover) {
      case "speed": {
        pausedRef.current = false;
        spinRateRef.current = degreesPerSecond(hoverDurationSec);
        animateScale(1);
        break;
      }
      case "pause": {
        pausedRef.current = true;
        animateScale(1);
        break;
      }
      case "scale": {
        pausedRef.current = false;
        spinRateRef.current = degreesPerSecond(hoverDurationSec);
        const nextScale = Number.isFinite(hoverScale) ? hoverScale : 0.8;
        animateScale(nextScale);
        break;
      }
      default:
        pausedRef.current = false;
        spinRateRef.current = degreesPerSecond(spinDuration);
        animateScale(1);
    }
  };

  const handleHoverEnd = () => {
    if (prefersReducedMotion() || spinDuration <= 0) return;

    pausedRef.current = false;
    spinRateRef.current = degreesPerSecond(spinDuration);
    animateScale(1);
  };

  return (
    <div
      ref={frameRef}
      style={{
        width: "100%",
        height: "100%",
        minWidth: safeDiameter,
        minHeight: safeDiameter,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        onPointerEnter={handleHoverStart}
        onPointerLeave={handleHoverEnd}
        style={{
          position: "relative",
          width: ringSize,
          height: ringSize,
          flexShrink: 0,
          borderRadius: "50%",
          cursor: "pointer",
          touchAction: "manipulation",
          userSelect: "none",
        }}
      >
        <motion.div
          style={{
            ...font,
            letterSpacing: `${round3(letterSpacingPx)}px`,
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            color,
            textAlign: "center",
            transformOrigin: "center center",
            willChange: "transform",
            pointerEvents: "none",
            rotate: rotation,
            scale,
          }}
        >
          {letters.map((letter, i) => {
            const angle = angles[i] ?? 0;
            const rad = (angle * Math.PI) / 180;
            const x = round3(radius * Math.cos(rad));
            const y = round3(radius * Math.sin(rad));
            const transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${round3(angle + 90)}deg)`;

            return (
              <span
                key={`${letter}-${i}`}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  display: "inline-block",
                  lineHeight: 1,
                  transform,
                  WebkitTransform: transform,
                }}
              >
                {letter === " " ? " " : letter}
              </span>
            );
          })}

          <span
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              borderWidth: 0,
            }}
          >
            {content}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

/** 프리셋 폰트 — 원본 16px·자간 10px → 링 PC 120px 에 4회 반복을 유지하려고 9px·5px 로 비례 축소 (2026-09-21). CornerRing 이 모바일에서 더 줄여 씀 */
export const PRESET_FONT: FontStyle = {
  variant: "Extra Light",
  fontSize: "9px",
  textAlign: "center",
  fontFamily: "Pretendard Variable",
  fontWeight: 200,
  lineHeight: "0em",
  letterSpacing: "5px",
};

/** words+separator 가 둘 다 "INFACT." 라 반복 단위는 "INFACT. INFACT. "(2개 묶음) → 링에 2·4·6…개로만 들어간다 */
const PRESET_PROPS: Props = {
  words: ["INFACT."],
  separator: "INFACT.",
  font: PRESET_FONT,
  hoverSpeed: 8,
};

export default function CircularText(props: Props) {
  return <CircularTextBase {...PRESET_PROPS} {...props} />;
}
