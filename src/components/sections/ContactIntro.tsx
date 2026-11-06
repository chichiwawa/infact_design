/** 문의 페이지 — 메인 최종 CTA(INFACT REPORT)와 같은 어두운 남색 톤: 작은 문구 + 제목 3줄 + 01·02 카드 + 연락처 / 오른쪽 접수 폼 */
import ContactForm from "@/components/ContactForm";
import type { ContactIntroData } from "@/lib/sections";
import type { Business } from "@/lib/queries";
import "./final-cta-image.css";
import "./contact-intro.css";

function Row({ tone, icon, children }: { tone: "kakao" | "blue" | "teal" | "purple"; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="fc-row">
      <span className={`fc-ico fc-${tone}`} aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
      </span>
      {children}
    </li>
  );
}

export default function ContactIntro({ data, biz }: { data: ContactIntroData; biz: Business | null }) {
  const b = biz as (Business & { email?: string | null }) | null;
  return (
    <section className="fi fc on-dark">
      <div className="fi-bg" aria-hidden="true"><i className="fi-cross fi-cross--tl" /><i className="fi-cross fi-cross--tr" /><i className="fi-cross fi-cross--bl" /><i className="fi-cross fi-cross--br" /></div>
      <div className="fc-in container-x">
        <div className="fc-left" data-reveal>
          <p className="fi-eyebrow">INFACT REPORT<i /></p>
          <h1 className="fi-title fc-title">
            <span className="fi-l">지금 문의하시면,</span>
            <span className="fi-l fi-blue">병원 마케팅 진단 리포트를</span>{" "}
            <span className="fi-l">보내드립니다.</span>
          </h1>
          <p className="fc-body">{data.body}</p>

          <ul className="fi-offers fc-offers">
            {data.offers.map((o, i) => (
              <li key={o.title}>
                <p className="fi-no">0{i + 1}<i /></p>
                <p className="fi-oh">{o.title}</p>
                <span>{o.body}</span>
              </li>
            ))}
          </ul>

          <ul className="fc-rows">
            {data.kakao_label && data.kakao_url && (
              <Row tone="kakao" icon={<path fill="currentColor" stroke="none" d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.8 5.3 4.6 6.7L5.6 21l4-2.6c.8.1 1.6.2 2.4.2 5.5 0 10-3.6 10-8S17.5 3 12 3z" />}>
                <a href={data.kakao_url} target="_blank" rel="noopener noreferrer" className="fc-link">{data.kakao_label}<span aria-hidden="true"> ↗</span></a>
              </Row>
            )}
            {b?.telephone && (
              <Row tone="blue" icon={<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />}>
                <a href={`tel:${b.telephone.replace(/-/g, "")}`} className="fc-link">{b.telephone}</a>
              </Row>
            )}
            {b?.email && (
              <Row tone="teal" icon={<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>}>
                <a href={`mailto:${b.email}`} className="fc-link">{b.email}</a>
              </Row>
            )}
            {b?.street_address && (
              <Row tone="purple" icon={<><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.500" /></>}>
                <span className="fc-addr">{[b.address_region, b.address_locality, b.street_address].filter(Boolean).join(" ")}</span>
              </Row>
            )}
          </ul>
        </div>

        <div className="fc-form" data-reveal="2">
          <ContactForm serviceTypes={data.service_types} telephone={b?.telephone} />
        </div>
      </div>
    </section>
  );
}
