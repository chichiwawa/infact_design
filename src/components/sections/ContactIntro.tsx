/** 문의 페이지 — 안내 + 접수 폼 + 연락처 */
import ContactForm from "@/components/ContactForm";
import type { ContactIntroData } from "@/lib/sections";
import type { Business } from "@/lib/queries";

const EASE = "ease-[cubic-bezier(.32,.72,0,1)]";

export default function ContactIntro({ data, biz }: { data: ContactIntroData; biz: Business | null }) {
  const b = biz as (Business & { email?: string | null }) | null;
  return (
    <section className="bg-canvas pt-32 pb-24 md:pt-44 md:pb-36">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        {/* 제목은 메인 최종 CTA 와 같은 세 줄 문구(DB headline 의 \n 그대로, 2026-09-22). 긴 문구로 되돌리면 1280·1024 에서 넘치므로 FinalCta.tsx 주석의 clamp 방식 참고. */}
        <div data-reveal>
          <h1 className="t-h-lg text-ink whitespace-pre-line">{data.headline}</h1>
          <p className="t-lead text-body mt-6 whitespace-pre-line prose-ko">{data.body}</p>

          {/* 2026-09-28 사용자 확정(design/demos/contact-offers.html B′): 받는 것(offers)은 박스 없이 구분선 목록,
              카카오만 따로 서는 노란 버튼 — 흰 카드는 오른쪽 폼 하나만 남겨 시선을 폼으로 */}
          <ul className="mt-8 border-t border-hairline break-keep">
            {data.offers.map((o) => (
              <li key={o.title} className="flex items-start gap-3.5 py-5 px-0.5 border-b border-hairline">
                <span className="grid place-items-center size-9 shrink-0 rounded-[11px] bg-primary/10 text-primary" aria-hidden="true">
                  {o.title.includes("소개서") ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 3h9l4 4v14H6z" /><path d="M14 3v5h5M9 13h7M9 17h5" /></svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></svg>
                  )}
                </span>
                <div>
                  <p className="text-[17px] font-bold leading-[1.4] tracking-[-0.3px] text-ink">{o.title}</p>
                  <p className="t-body-sm md:text-[14px] text-body mt-1">{o.body}</p>
                </div>
              </li>
            ))}
          </ul>
          {data.kakao_label && data.kakao_url && (
            <a href={data.kakao_url} target="_blank" rel="noopener noreferrer" className={`group mt-5 flex items-center justify-between gap-3 rounded-full py-2.5 pr-2.5 pl-5 bg-[#FEE500] text-[#191919] text-[16px] font-bold tracking-[-0.2px] transition-transform duration-500 ${EASE} active:scale-[.99]`}>
              <span className="flex items-center gap-2.5">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.8 5.3 4.6 6.7L5.6 21l4-2.6c.8.1 1.6.2 2.4.2 5.5 0 10-3.6 10-8S17.5 3 12 3z" /></svg>
                {data.kakao_label}
              </span>
              <span className={`grid place-items-center size-8 shrink-0 rounded-full bg-black/10 transition-transform duration-500 ${EASE} group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105`} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7M8 7h9v9" /></svg>
              </span>
            </a>
          )}

          <div className="mt-8 space-y-2 t-body-lg text-body">
            {b?.telephone && <p>전화 <a href={`tel:${b.telephone.replace(/-/g, "")}`} className="text-ink font-bold">{b.telephone}</a></p>}
            {b?.email && <p>이메일 <a href={`mailto:${b.email}`} className="text-ink font-bold">{b.email}</a></p>}
            {b?.street_address && <p>{[b.address_region, b.address_locality, b.street_address].filter(Boolean).join(" ")}</p>}
          </div>
        </div>

        <div data-reveal="2">
          <ContactForm serviceTypes={data.service_types} telephone={b?.telephone} />
        </div>
      </div>
    </section>
  );
}
