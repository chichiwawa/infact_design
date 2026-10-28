/**
 * 07 최종 CTA — 와이어프레임 07(메인) / 05(서비스) 공용. 블루 풀블리드 밴드 + 초대형 제목.
 */
import Link from "next/link";
import type { FinalCtaData } from "@/lib/sections";
import "./final-cta-variants.css";

type V = "a" | "b" | "c" | "d" | "e";

/** variant a~e: 어두운 톤 시안(/demo/cta-a ~ cta-e). 생략하면 기존 파란 밴드. */
export default function FinalCta({ data, variant }: { data: FinalCtaData; variant?: V }) {
  if (variant) return <Variant data={data} v={variant} />;
  return (
    <section className="relative bg-primary text-on-primary on-dark overflow-hidden">
      {/* 제목은 DB headline 의 \n 그대로 세 줄(2026-09-22 "지금 문의하시면, / 병원 마케팅 진단 / 리포트를 보내드립니다."). 가장 긴 줄이 56px 에서 ~480px 라 1.3fr 열(1440 에서 742px)에 여유 있음.
          ※ 긴 문구("원장님 병원 맞춤 마케팅 진단 리포트를", 56px 에서 799px)로 되돌리면 넘치므로 그땐 왼쪽 열 1.6fr + `fontSize: clamp(30px, 6.9cqw, 56px)`(containerType:inline-size) 조합이 필요 — 77차 기록 참고. */}
      <div className="relative container-x section-y grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16 items-start">
        <div data-reveal>
          <h2 className="t-h-xl text-white whitespace-pre-line">{data.headline}</h2>
          {data.sub && <p className="t-lead text-white/80 mt-6 whitespace-pre-line">{data.sub}</p>}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {data.offers.map((o) => (
              <div key={o.title} className="rounded-2xl border border-white/20 bg-white/10 p-6">
                <p className="t-h-md text-white">{o.title}</p>
                <p className="t-body text-white/80 mt-2">{o.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-elevated text-ink p-8 md:p-10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)]" data-reveal="2">
          <p className="t-h-md">지금 문의하기</p>
          <p className="t-body text-body mt-2">영업일 기준 1일 내에 담당자가 연락드립니다.</p>
          <Link href={data.cta_href} className="btn-primary w-full mt-8">{data.cta_label} <span className="btn-arrow">↗</span></Link>
          {data.kakao_label && data.kakao_url && (
            <a href={data.kakao_url} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full mt-3">
              {data.kakao_label}
            </a>
          )}
          <ul className="t-body text-mute mt-8 pt-6 border-t border-hairline space-y-1.5">
            {data.contacts.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Variant({ data, v }: { data: FinalCtaData; v: V }) {
  return (
    <section className={`fcta fcta-${v} ${v === "d" ? "" : "on-dark"}`}>
      <div className="fcta-bg" aria-hidden="true" />
      <div className="fcta-in container-x section-y fcta-grid grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16 items-start">
        <div data-reveal>
          <h2 className="fcta-h t-h-xl whitespace-pre-line">{data.headline}</h2>
          {data.sub && <p className="fcta-sub t-lead mt-6 whitespace-pre-line">{data.sub}</p>}
          <div className="fcta-offers mt-10 grid gap-4 sm:grid-cols-2">
            {data.offers.map((o) => (
              <div key={o.title} className="fcta-offer">
                <p className="t-h-md">{o.title}</p>
                <p className="t-body mt-2">{o.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fcta-card" data-reveal="2">
          <p className="fcta-ink t-h-md">지금 문의하기</p>
          <p className="fcta-mute t-body text-body mt-2">영업일 기준 1일 내에 담당자가 연락드립니다.</p>
          <div className="fcta-btns">
            <Link href={data.cta_href} className="btn-primary w-full mt-8">{data.cta_label} <span className="btn-arrow">↗</span></Link>
            {data.kakao_label && data.kakao_url && (
              <a href={data.kakao_url} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full mt-3">{data.kakao_label}</a>
            )}
          </div>
          <ul className="fcta-list fcta-mute t-body text-mute mt-8 pt-6 border-t border-hairline space-y-1.5">
            {data.contacts.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
