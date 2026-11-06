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

/** 푸터 연락처 앞 가는 선 아이콘 */
function FIcon({ k }: { k: "insta" | "kakao" | "phone" | "mail" }) {
  const p = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, className: "shrink-0" };
  if (k === "insta") return <svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></svg>;
  if (k === "kakao") return <svg {...p}><path d="M12 4C7 4 3 7.200 3 11c0 2.400 1.600 4.600 4 5.800L6.200 20l3.600-2.300c.7.100 1.500.200 2.200.200 5 0 9-3.200 9-7S17 4 12 4z" /></svg>;
  if (k === "phone") return <svg {...p}><path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>;
  return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
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
            {/* 메인 히어로처럼 줄마다 아래에서 올라오는 마스크 모션 (스크롤로 푸터가 보일 때 1회, wipe-stagger) */}
            <p className="wipe-stagger t-lead text-white/85 mt-5">
              <span className="wipe block pb-[.12em]"><span>2018년부터,</span></span>
              <span className="wipe block pb-[.12em]"><span>오직 병원 마케팅만 해왔습니다.</span></span>
            </p>
            <p className="t-body-sm text-white/40 mt-2">INside the clinic, based on FACT.</p>
          </div>

          <div>
            <ul className="space-y-3">
              {NAV.map((it) => (
                <li key={it.href}><Link href={it.href} className="text-[17px] text-white/80 hover:text-white">{it.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <ul className="space-y-3">
              {(b?.same_as ?? []).map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[17px] text-white/80 hover:text-white">
                    <FIcon k={/kakao|카카오|pf\.kakao/i.test(`${s.label ?? ""} ${s.url}`) ? "kakao" : "insta"} />
                    {s.label ?? s.url.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              ))}
              {b?.telephone && <li><a href={`tel:${b.telephone.replace(/-/g, "")}`} className="flex items-center gap-3 text-[17px] text-white/80 hover:text-white"><FIcon k="phone" />{b.telephone}</a></li>}
              {b?.email && <li><a href={`mailto:${b.email}`} className="flex items-center gap-3 text-[17px] text-white/80 hover:text-white break-all"><FIcon k="mail" />{b.email}</a></li>}
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
