"use client";

/** 맨 위로 버튼 — 오른쪽 하단, 오른쪽 끝선은 헤더 안쪽 선(--edge)과 같다. 한 화면 정도 내려오면 나타난다. */
import { useEffect, useState } from "react";

export default function ScrollTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button
      type="button"
      className="scroll-top"
      data-show={show ? "1" : "0"}
      aria-label="맨 위로"
      tabIndex={show ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
}
