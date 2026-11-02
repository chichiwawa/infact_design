/**
 * 최종 CTA — 시안 이미지(INFACT REPORT) 그대로 구현 (2026-11-02)
 *  어두운 남색 바탕 + 오른쪽 위·왼쪽 아래 파란 원호 빛, 왼쪽: 작은 문구 + 제목 3줄 + 혜택 카드 2장, 오른쪽: 흰 문의 카드(버튼 2개 + 연락처 아이콘 3줄)
 *  제목: "지금 문의하시면," / "병원 마케팅 진단 리포트를"(홈페이지 블루) / "보내드립니다."
 */
import Link from "next/link";
import type { FinalCtaData } from "@/lib/sections";
import "./final-cta-image.css";

const ICONS = {
  phone: <path d="M6.6 3h3l1.4 4-2 1.3a12 12 0 0 0 5.7 5.7L16 12l4 1.4v3A2.6 2.6 0 0 1 17.4 19C10 19 5 14 5 6.6 5 4.700 6.1 3 6.600 3Z" />,
  insta: <><rect x="3.500" y="3.500" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.500" /><path d="m4 7 8 6 8-6" /></>,
};

function ContactIcon({ text }: { text: string }) {
  const k = /^\d|tel|전화/i.test(text) ? "phone" : /instagram|@infact/i.test(text) ? "insta" : "mail";
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[k]}</svg>
  );
}

/** 연락처 문구 → 링크: 인스타그램(@계정) / 전화 / 메일 */
function linkOf(text: string) {
  const insta = text.match(/instagram\s+@?([\w.]+)/i);
  if (insta) return `https://www.instagram.com/${insta[1]}`;
  if (/^[\d\-\s]+$/.test(text)) return `tel:${text.replace(/\D/g, "")}`;
  if (/^\S+@\S+\.\S+$/.test(text)) return `mailto:${text}`;
  return null;
}

export default function FinalCtaImage({ data }: { data: FinalCtaData }) {
  return (
    <section className="fi" aria-label="문의">
      <div className="fi-bg" aria-hidden="true" />
      <div className="fi-in container-x">
        <div className="fi-left">
          <p className="fi-eyebrow">INFACT REPORT<i /></p>
          <h2 className="fi-title">
            <span className="fi-l">지금 문의하시면,</span>
            <span className="fi-l fi-blue">병원 마케팅 진단 리포트를</span>
            <span className="fi-l">보내드립니다.</span>
          </h2>
          <ul className="fi-offers">
            {data.offers.map((o, i) => (
              <li key={o.title}>
                <p className="fi-no">0{i + 1}<i /></p>
                <p className="fi-oh">{o.title}</p>
                <span>{o.body}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="fi-card">
          <p className="fi-card-h">지금 문의하기</p>
          <p className="fi-card-s">영업일 기준 1일 내에 담당자가 연락드립니다.</p>
          <Link href={data.cta_href} className="fi-btn fi-btn-main">{data.cta_label} <span aria-hidden="true">↗</span></Link>
          {data.kakao_label && data.kakao_url && (
            <a href={data.kakao_url} target="_blank" rel="noopener noreferrer" className="fi-btn fi-btn-sub">
              {/* 카카오톡 채널 아이콘: 검정 말풍선 + 노랑 "Ch" (제공 이미지 왼쪽 아래 형태) */}
              <svg viewBox="0 0 40 36" width="38" height="34" aria-hidden="true"><ellipse cx="20" cy="15" rx="19" ry="14.500" fill="#000" /><path d="M8.500 25 6.500 34.500 17.500 27.500Z" fill="#000" strokeLinejoin="round" /><text x="20" y="21" textAnchor="middle" fontSize="16" fontWeight="800" fill="#FFD900" fontFamily="Arial, Helvetica, sans-serif">Ch</text></svg>
              {data.kakao_label}
            </a>
          )}
          <ul className="fi-contacts">
            {data.contacts.map((c) => {
              const href = linkOf(c);
              return (
                <li key={c}>
                  {href ? <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}><ContactIcon text={c} />{c}</a> : <><ContactIcon text={c} />{c}</>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
