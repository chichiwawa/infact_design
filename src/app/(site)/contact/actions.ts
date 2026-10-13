"use server";

/**
 * 문의 접수 — 디자인 전용 사본: 입력 검증만 하고 아무 데도 저장·전송하지 않는다.
 * (접수 완료 화면·오류 문구 디자인을 확인할 수 있게 검증 규칙은 운영과 같게 둠)
 */
export interface InquiryState { ok: boolean; error?: string }

export async function submitInquiry(_prev: InquiryState, form: FormData): Promise<InquiryState> {
  const name = String(form.get("name") ?? "").trim();
  const contact = String(form.get("contact") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  if (name.length < 2) return { ok: false, error: "병원명(또는 성함)을 입력해 주세요." };
  if (!/[\d@]/.test(contact) || contact.length < 6) return { ok: false, error: "연락 가능한 전화번호 또는 이메일을 입력해 주세요." };
  if (name.length > 100 || contact.length > 100) return { ok: false, error: "병원명·연락처는 100자 이내로 입력해 주세요." };
  if (message.length > 5000) return { ok: false, error: "문의 내용은 5,000자 이내로 입력해 주세요." };
  if (form.get("privacy_agree") !== "on") return { ok: false, error: "개인정보 수집·이용에 동의해 주셔야 문의를 접수할 수 있습니다." };
  return { ok: true };
}
