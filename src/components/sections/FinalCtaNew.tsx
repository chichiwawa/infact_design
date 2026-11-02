/**
 * 최종 CTA 새 시안 1~5 (2026-11-02) — 어두운 바탕 + 블루 빛줄기, 제목은 굵은 흰 글씨 + "마케팅 진단" 블루 강조.
 *  제목 줄바꿈 두 가지: lines=3 → "지금 문의하시면," / "마케팅 진단 리포트를" / "보내드립니다."
 *                       lines=2 → "지금 문의하시면," / "마케팅 진단 리포트를 보내드립니다."
 *  1 혜택 카드 2장 + 오른쪽 흰 카드 / 2 가운데 정렬 / 3 왼쪽 제목 + 오른쪽 유리 카드 / 4 제목 위 + 아래 3칸 / 5 큰 원호 + 번호 줄
 */
import Link from "next/link";
import type { FinalCtaData } from "@/lib/sections";
import "./final-cta-new.css";

export type NV = "1" | "2" | "3" | "4" | "5";

function Title({ lines }: { lines: 2 | 3 }) {
  return (
    <h2 className="fn-title">
      <span className="fn-l">지금 문의하시면,</span>
      {lines === 3 ? (
        <>
          <span className="fn-l"><em>마케팅 진단</em> 리포트를</span>
          <span className="fn-l">보내드립니다.</span>
        </>
      ) : (
        <span className="fn-l"><em>마케팅 진단</em> 리포트를 보내드립니다.</span>
      )}
    </h2>
  );
}

function Actions({ data }: { data: FinalCtaData }) {
  return (
    <div className="fn-actions">
      <Link href={data.cta_href} className="fn-btn fn-btn-main">{data.cta_label} <span aria-hidden="true">↗</span></Link>
      {data.kakao_label && data.kakao_url && (
        <a href={data.kakao_url} target="_blank" rel="noopener noreferrer" className="fn-btn fn-btn-sub">{data.kakao_label}</a>
      )}
    </div>
  );
}

function Offers({ data }: { data: FinalCtaData }) {
  return (
    <ul className="fn-offers">
      {data.offers.map((o, i) => (
        <li key={o.title}><b>0{i + 1}</b><div><p>{o.title}</p><span>{o.body}</span></div></li>
      ))}
    </ul>
  );
}

function Contacts({ data }: { data: FinalCtaData }) {
  return <ul className="fn-contacts">{data.contacts.map((c) => <li key={c}>{c}</li>)}</ul>;
}

/** 흰 카드(시안 1·4) */
function WhiteCard({ data }: { data: FinalCtaData }) {
  return (
    <div className="fn-white">
      <p className="fn-white-h">지금 문의하기</p>
      <p className="fn-white-s">영업일 기준 1일 내에 담당자가 연락드립니다.</p>
      <Actions data={data} />
      <Contacts data={data} />
    </div>
  );
}

export default function FinalCtaNew({ data, variant, lines = 3 }: { data: FinalCtaData; variant: NV; lines?: 2 | 3 }) {
  return (
    <section className={`fn fn-${variant}`} aria-label="문의">
      <div className="fn-bg" aria-hidden="true" />
      <div className="fn-in container-x">
        {variant === "1" && (
          <div className="fn-split">
            <div>
              <Title lines={lines} />
              <Offers data={data} />
            </div>
            <WhiteCard data={data} />
          </div>
        )}
        {variant === "2" && (
          <div className="fn-center">
            <Title lines={lines} />
            <Offers data={data} />
            <Actions data={data} />
            <p className="fn-note">영업일 기준 1일 내에 담당자가 연락드립니다.</p>
            <Contacts data={data} />
          </div>
        )}
        {variant === "3" && (
          <div className="fn-split">
            <div>
              <Title lines={lines} />
              <Contacts data={data} />
            </div>
            <div className="fn-glass">
              <p className="fn-glass-h">지금 문의하시면 함께 보내드려요</p>
              <Offers data={data} />
              <Actions data={data} />
              <p className="fn-note">영업일 기준 1일 내에 담당자가 연락드립니다.</p>
            </div>
          </div>
        )}
        {variant === "4" && (
          <>
            <Title lines={lines} />
            <div className="fn-three">
              <Offers data={data} />
              <WhiteCard data={data} />
            </div>
          </>
        )}
        {variant === "5" && (
          <>
            <Title lines={lines} />
            <div className="fn-row">
              <Offers data={data} />
              <div>
                <Actions data={data} />
                <p className="fn-note">영업일 기준 1일 내에 담당자가 연락드립니다.</p>
                <Contacts data={data} />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
