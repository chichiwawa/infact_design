"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { submitInquiry, type InquiryState } from "@/app/(site)/contact/actions";

const initial: InquiryState = { ok: false };

// 숫자(와 하이픈)만 입력하면 전화번호 모양으로 하이픈을 넣는다. 이메일 등 다른 글자가 섞이면 그대로 둔다
function formatPhone(v: string) {
  if (!/^[\d-]*$/.test(v)) return v;
  const d = v.replace(/-/g, "");
  if (d.startsWith("02")) { // 서울 02-123-4567 / 02-1234-5678
    const s = d.slice(0, 10);
    if (s.length <= 2) return s;
    if (s.length <= 5) return `${s.slice(0, 2)}-${s.slice(2)}`;
    if (s.length <= 9) return `${s.slice(0, 2)}-${s.slice(2, 5)}-${s.slice(5)}`;
    return `${s.slice(0, 2)}-${s.slice(2, 6)}-${s.slice(6)}`;
  }
  if (/^1[5-9]/.test(d)) { // 대표번호 1588-1234
    const s = d.slice(0, 8);
    return s.length <= 4 ? s : `${s.slice(0, 4)}-${s.slice(4)}`;
  }
  const s = d.slice(0, 11); // 010-1234-5678 / 031-123-4567 / 070-1234-5678
  if (s.length <= 3) return s;
  if (s.length <= 6) return `${s.slice(0, 3)}-${s.slice(3)}`;
  if (s.length <= 10) return `${s.slice(0, 3)}-${s.slice(3, 6)}-${s.slice(6)}`;
  return `${s.slice(0, 3)}-${s.slice(3, 7)}-${s.slice(7)}`;
}

export default function ContactForm({ serviceTypes, telephone }: { serviceTypes: string[]; telephone?: string | null }) {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  // 필수 동의 전에는 제출을 막는다 (버튼 문구로 무엇이 빠졌는지 바로 보이게)
  const [agreed, setAgreed] = useState(false);
  const [open, setOpen] = useState<"privacy" | "marketing" | null>(null);

  // 접수 성공을 GTM 에 알림 (GTM 맞춤 이벤트 트리거 inquiry_submit → GA4 generate_lead). 개인정보는 보내지 않는다
  useEffect(() => {
    if (!state.ok) return;
    const w = window as unknown as { dataLayer?: object[] };
    (w.dataLayer = w.dataLayer || []).push({ event: "inquiry_submit" });
  }, [state.ok]);

  if (state.ok) {
    return (
      <div className="card rounded-[24px] p-10 text-center" role="status">
        <p className="t-h-md text-success">문의가 접수되었습니다.</p>
        <p className="t-body text-body mt-2">영업일 기준 1일 내에 담당자가 연락드립니다. 마케팅 진단 리포트와 상품소개서를 함께 보내드릴게요.</p>
      </div>
    );
  }

  const input = "w-full rounded-sm border border-hairline bg-elevated px-3 py-3 t-body text-ink placeholder:text-faint focus:outline-none focus:border-primary min-h-[44px]";

  return (
    // <form action> 로 넘기면 React 19 가 제출 후 폼을 비워 거절 시 입력이 날아간다 → onSubmit 으로 직접 호출해 초기화를 막는다
    <form onSubmit={(e) => { e.preventDefault(); const data = new FormData(e.currentTarget); startTransition(() => action(data)); }} className="card rounded-[24px] p-7 md:p-10 space-y-5 shadow-lift" noValidate>
      <div>
        <label htmlFor="name" className="t-label text-ink block mb-2">병원명 / 성함 <span className="text-error">*</span></label>
        <input id="name" name="name" required className={input} placeholder="예: OO피부과 김OO 원장" autoComplete="organization" />
      </div>
      <div>
        <label htmlFor="contact" className="t-label text-ink block mb-2">연락처 (전화 또는 이메일) <span className="text-error">*</span></label>
        <input id="contact" name="contact" required onChange={(e) => { e.target.value = formatPhone(e.target.value); }} className={input} placeholder="010-0000-0000" autoComplete="tel" />
      </div>
      <div>
        <label htmlFor="service_type" className="t-label text-ink block mb-2">관심 서비스</label>
        <select id="service_type" name="service_type" className={input} defaultValue="">
          <option value="">선택 안 함 (진단 후 제안 받기)</option>
          {serviceTypes.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="t-label text-ink block mb-2">현재 고민</label>
        <textarea id="message" name="message" rows={5} className={input} placeholder="예: 문의는 오는데 결제로 이어지지 않아요 / 신규 개원이라 인지도가 없어요" />
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {/* 동의 — 필수(상담 처리)와 선택(광고성 정보 수신)을 분리. 문구·보유기간은 /privacy 처리방침과 같아야 한다 */}
      <div className="grid gap-3 border-t border-hairline pt-5">
        {/* 안내 문구는 길어서 기본 접힘 — "보기"로 펼친다 (2026-09-28 사용자 요청) */}
        <div className="flex items-start gap-3">
          <label className="flex flex-1 items-start gap-3 cursor-pointer">
            <input type="checkbox" name="privacy_agree" required checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 size-5 shrink-0 accent-primary" />
            <span className="t-body text-ink"><span className="text-error">[필수]</span> 개인정보 수집·이용에 동의합니다.</span>
          </label>
          <button type="button" onClick={() => setOpen((o) => (o === "privacy" ? null : "privacy"))} aria-expanded={open === "privacy"} aria-controls="consent-privacy" className="shrink-0 mt-0.5 t-body-sm text-mute underline underline-offset-2 hover:text-ink">{open === "privacy" ? "닫기" : "보기"}</button>
        </div>
        {open === "privacy" && (
          <div id="consent-privacy" className="rounded-sm bg-panel px-4 py-3 t-body-sm text-body grid gap-1">
            <p><b className="text-ink">수집 항목</b> 병원명/성함, 연락처(전화 또는 이메일), 관심 서비스, 문의 내용</p>
            <p><b className="text-ink">이용 목적</b> 상담 문의 확인·회신, 진단 리포트·상품소개서 발송</p>
            <p><b className="text-ink">보유 기간</b> 상담 종료 후 1년 (삭제를 요청하시면 즉시 파기)</p>
            <p>동의를 거부하실 수 있으나, 이 경우 문의 접수가 어렵습니다.{telephone ? ` 전화(${telephone})로도 상담 가능합니다.` : ""}{" "}<a href="/privacy" target="_blank" rel="noopener" className="underline text-ink">개인정보 처리방침</a></p>
          </div>
        )}
        <div className="flex items-start gap-3">
          <label className="flex flex-1 items-start gap-3 cursor-pointer">
            <input type="checkbox" name="marketing_agree" className="mt-1 size-5 shrink-0 accent-primary" />
            <span className="t-body text-ink"><span className="text-mute">[선택]</span> 마케팅 정보 수신에 동의합니다.</span>
          </label>
          <button type="button" onClick={() => setOpen((o) => (o === "marketing" ? null : "marketing"))} aria-expanded={open === "marketing"} aria-controls="consent-marketing" className="shrink-0 mt-0.5 t-body-sm text-mute underline underline-offset-2 hover:text-ink">{open === "marketing" ? "닫기" : "보기"}</button>
        </div>
        {open === "marketing" && (
          <p id="consent-marketing" className="rounded-sm bg-panel px-4 py-3 t-body-sm text-body">병원 마케팅 인사이트·세미나·프로모션 소식을 문자·이메일로 받아봅니다. 동의 철회 시까지 보관하며, 동의하지 않아도 상담에는 영향이 없습니다.</p>
        )}
      </div>
      {state.error && <p className="t-body text-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending || !agreed} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
        {pending ? "접수 중..." : agreed ? "문의 접수하기" : "필수 동의 후 접수 가능"}
      </button>
    </form>
  );
}
