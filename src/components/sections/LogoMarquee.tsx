/**
 * 06 함께한 병원 — 와이어프레임 06 + 벤치마킹 06-hospital-logos NOTES
 *  - 2줄, 위 줄 왼쪽 / 아래 줄 오른쪽, 90s linear infinite, 원본 세트 + 복제 세트(aria-hidden), hover 정지 없음
 *  - 로고 취합 전에는 진료과 텍스트로 축소 운영 (와이어프레임 "준비중" 지침)
 *  디벨롭: 05 다크 밴드에 이어 붙여 하나의 어두운 장면으로, 양끝 페이드.
 */
import Image from "next/image";
import type { LogoMarqueeData, LogoItem } from "@/lib/sections";

/* 2026-09-23 거래처 로고 22개 반영. lazy <img> 는 마퀴 안에서 화면 밖 로고가 안 받아져 트랙 폭이 계속 바뀌었다(실측 44장 중 5장만 로드)
   → next/image + eager + 실측 width/height(자리 선점). max-w: 가로로 아주 긴 로고(안티안 11:1)가 줄을 독점하지 않게 */
function Item({ it }: { it: LogoItem }) {
  if (it.logo_url) {
    return (
      <Image src={it.logo_url} alt={it.alt ?? `${it.label ?? "고객 병원"} 로고`} width={it.width ?? 256} height={it.height ?? 128} sizes="260px" loading="eager"
        style={{ height: `calc(var(--lh) * ${it.scale ?? 1})` }}  /* --lh: globals.css .marquee-set (40/48px). scale 로 로고별 축소 (2026-09-23) */
        className="w-auto max-w-[200px] md:max-w-[260px] object-contain brightness-0 invert opacity-60" />
    );
  }
  return <span className="text-[28px] md:text-[40px] font-extrabold tracking-[-1.5px] text-white/25 whitespace-nowrap">{it.label}</span>;
}

export default function LogoMarquee({ data }: { data: LogoMarqueeData }) {
  return (
    <section className="py-16 md:py-24 bg-night text-white on-dark overflow-hidden border-t border-white/10" aria-label="함께한 병원">
      {data.note && <p className="t-eyebrow text-white/40 text-center mb-10 container-x">{data.note}</p>}
      {data.rows.map((row, r) => (
        <div key={r} className={`marquee-container ${r > 0 ? "mt-10 md:mt-14" : ""}`}>
          <div className={`marquee-track ${r % 2 === 0 ? "animate-marquee-left" : "animate-marquee-right"}`}>
            <div className="marquee-set">
              {row.map((it, i) => <Item key={i} it={it} />)}
            </div>
            <div className="marquee-set" aria-hidden="true">
              {row.map((it, i) => <Item key={i} it={it} />)}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
