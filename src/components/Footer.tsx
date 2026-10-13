import Link from "next/link";
import type { Business } from "@/lib/queries";
import { NAV } from "@/lib/nav";

function hoursLabel(h: string) {
  // "Mo-Fr 09:00-18:00" → "평일 09:00~18:00"
  const m = h.match(/^(\S+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/);
  if (!m) return h;
  const day: Record<string, string> = { "Mo-Fr": "평일", "Mo-Sa": "월~토", "Mo-Su": "매일", Sa: "토요일", Su: "일요일" };
  return `${day[m[1]] ?? m[1]} ${m[2]}~${m[3]}`;
}

export default function Footer({ biz }: { biz: Business | null }) {
  const b = biz as (Business & { name_en?: string | null; registration_number?: string | null; email?: string | null }) | null;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night text-white mt-auto on-dark">
      <div className="container-x pt-20 pb-12">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            {/* 2026-09-23 헤더와 같은 로고 PNG 마스크(글자 흰색, 점 시그니처 블루), 푸터는 18px */}
            <p className="logo" style={{ "--lh": "18px" } as React.CSSProperties} role="img" aria-label="INFACT">
              <span className="logo-word" aria-hidden="true" />
              <span className="logo-dot text-primary" aria-hidden="true" />
            </p>
            <p className="t-lead text-white/85 mt-5 max-w-[28ch]">2018년부터, 오직 병원 마케팅만 해왔습니다.</p>
            <p className="t-body-sm text-white/40 mt-2">INside the clinic, based on FACT.</p>
          </div>

          <div>
            <p className="t-eyebrow text-white/40">Menu</p>
            <ul className="mt-4 space-y-3">
              {NAV.map((it) => (
                <li key={it.href}><Link href={it.href} className="text-[17px] text-white/80 hover:text-white">{it.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="t-eyebrow text-white/40">Channel</p>
            <ul className="mt-4 space-y-3">
              {(b?.same_as ?? []).map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[17px] text-white/80 hover:text-white">
                    {s.label ?? s.url.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              ))}
              {b?.telephone && <li><a href={`tel:${b.telephone.replace(/-/g, "")}`} className="text-[17px] text-white/80 hover:text-white">{b.telephone}</a></li>}
              {b?.email && <li><a href={`mailto:${b.email}`} className="text-[17px] text-white/80 hover:text-white break-all">{b.email}</a></li>}
            </ul>
          </div>
        </div>

        <address className="not-italic t-body-sm text-white/40 mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-1">
          <span>{b?.name ?? "인팩트컴퍼니"}{b?.name_en ? ` · ${b.name_en}` : ""}</span>
          {b?.street_address && <span>{[b.address_region, b.address_locality, b.street_address].filter(Boolean).join(" ")}</span>}
          {b?.registration_number && <span>사업자등록번호 {b.registration_number}</span>}
          {b?.opening_hours?.length ? <span>{b.opening_hours.map(hoursLabel).join(", ")}</span> : null}
        </address>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          {/* 처리방침 링크는 다른 링크와 구분되게 굵게 (작성지침 권장) */}
          <Link href="/privacy" className="t-body-sm font-bold text-white/80 hover:text-white">개인정보 처리방침</Link>
          <p className="t-body-sm text-white/30">© {year} {b?.name ?? "인팩트컴퍼니"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
