"use client";

/**
 * ShinyPill (Originkit) — 헤드라인 강조 문구 데모용, 2026-09-18
 *  텍스트 위에 마스킹된 밝은 색 사본을 겹쳐 좌우로 쓸어가며 반짝이는 효과. 배경/포인터 이슈가
 *  없는 순수 텍스트 컴포넌트라 별도 이식 없이 원본 그대로 사용, 데모 라우트에서만 확인.
 */
import type { CSSProperties } from "react"

interface ShinyPillProps {
    text: string
    link?: string
    textColor: string
    shineColor: string
    speed: number
    font: CSSProperties & { variant?: string }
    style?: CSSProperties
}

const KEYFRAMES_ID = "shiny-pill-keyframes"

function ShinyPillBase(props: ShinyPillProps) {
    props = { ...COMPONENT_DEFAULTS, ...props }
    const {
        text = "SHINY PILL",
        link,
        textColor = "#FFFFFF",
        shineColor = "#78FF83",
        speed = 1.5,
        font,
        style,
    } = props

    const isFixedWidth = style?.width === "100%"

    const shellStyle: CSSProperties = {
        ...style,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        boxSizing: "border-box",
        ...(isFixedWidth ? {} : { minWidth: "max-content", width: "auto" }),
        whiteSpace: "nowrap",
        ...font,
    }

    const shineLayerStyle: CSSProperties = {
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        color: shineColor,
        pointerEvents: "none",
        WebkitMaskImage:
            "linear-gradient(to right, transparent 30%, #000 50%, transparent 70%)",
        maskImage:
            "linear-gradient(to right, transparent 30%, #000 50%, transparent 70%)",
        WebkitMaskSize: "150% auto",
        maskSize: "150% auto",
        animation: `shinyPillSweep ${speed}s ease-in-out infinite`,
    }

    const content = (
        <div style={shellStyle}>
            <style
                id={KEYFRAMES_ID}
                dangerouslySetInnerHTML={{
                    __html: `@keyframes shinyPillSweep {
                        0% { -webkit-mask-position: 200%; mask-position: 200%; }
                        100% { -webkit-mask-position: -100%; mask-position: -100%; }
                    }`,
                }}
            />
            {}
            <span style={{ color: textColor }}>{text}</span>
            {}
            <span style={shineLayerStyle} aria-hidden="true">
                {text}
            </span>
        </div>
    )

    if (link) {
        return (
            <a
                href={link}
                style={{ textDecoration: "none", display: "inline-flex" }}
            >
                {content}
            </a>
        )
    }

    return content
}

const COMPONENT_DEFAULTS = {
    text: "SHINY PILL",
    textColor: "#FFFFFF",
    shineColor: "#78FF83",
    speed: 1.5,
    font: {
        fontFamily: "Inter",
        variant: "Bold",
        fontSize: "120px",
        letterSpacing: "-0.01em",
        lineHeight: "1em",
    } as CSSProperties & { variant?: string },
}

const PRESET_PROPS = {
  "shineColor": "#78ABFF"
};

export default function ShinyPill(props: Record<string, unknown>) {
  return <ShinyPillBase {...(({ ...PRESET_PROPS, ...props }) as ShinyPillProps)} />;
}
