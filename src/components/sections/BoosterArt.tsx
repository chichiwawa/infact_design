/** 부스터 시안 F 카드 안 일러스트 4종 — 입체감 있는 밝은 파랑 톤 SVG + 둥둥 떠다니는 움직임(boosters-variants.css 의 .bsa-*). 인스타 / 전후사진 / AI 검색 / 유튜브 */
const defs = (
  <defs>
    <linearGradient id="bsa-blue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c9d8ff" /><stop offset="1" stopColor="#7d9dff" /></linearGradient>
    <linearGradient id="bsa-deep" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6b8cff" /><stop offset="1" stopColor="#2148d6" /></linearGradient>
    <linearGradient id="bsa-screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9db6ff" /><stop offset="1" stopColor="#d9e3ff" /></linearGradient>
    <linearGradient id="bsa-ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#ffb340" /><stop offset=".5" stopColor="#f0506e" /><stop offset="1" stopColor="#a63fd1" /></linearGradient>
    <linearGradient id="bsa-card" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e6edff" /></linearGradient>
    <filter id="bsa-sh" x="-20%" y="-20%" width="150%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#2148d6" floodOpacity=".28" /></filter>
    <filter id="bsa-sh2" x="-20%" y="-20%" width="150%" height="160%"><feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#2148d6" floodOpacity=".25" /></filter>
  </defs>
);

function Insta() {
  return (
    <>
      <g className="bsa-float">
        <g filter="url(#bsa-sh)" transform="rotate(8 170 120)">
          <rect x="120" y="20" width="100" height="196" rx="20" fill="url(#bsa-blue)" />
          <rect x="127" y="27" width="86" height="182" rx="14" fill="url(#bsa-screen)" />
          <rect x="157" y="31" width="26" height="6" rx="3" fill="#6b8cff" opacity=".6" />
          <rect x="151" y="78" width="38" height="38" rx="10" fill="#fff" opacity=".9" />
          <path d="M165 88l12 9-12 9z" fill="#6b8cff" />
          <rect x="140" y="132" width="60" height="6" rx="3" fill="#fff" opacity=".8" />
          <rect x="140" y="146" width="40" height="6" rx="3" fill="#fff" opacity=".6" />
          <rect x="132" y="190" width="76" height="14" rx="7" fill="#fff" opacity=".75" />
        </g>
      </g>
      <g className="bsa-float bsa-d1" filter="url(#bsa-sh2)">
        <rect x="52" y="64" width="54" height="54" rx="15" fill="url(#bsa-ig)" />
        <rect x="64" y="76" width="30" height="30" rx="9" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="79" cy="91" r="7" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="89" cy="81" r="2.4" fill="#fff" />
      </g>
      <g className="bsa-float bsa-d2" filter="url(#bsa-sh2)">
        <rect x="232" y="128" width="50" height="50" rx="14" fill="#fff" />
        <path d="M237 153c0-6 4-10 8-10 9 0 15 20 24 20 4 0 8-4 8-10s-4-10-8-10c-9 0-15 20-24 20-4 0-8-4-8-10z" transform="translate(0 -9)" fill="none" stroke="#2f6bff" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g className="bsa-float bsa-d3"><path d="M246 70c-5-4-10-9-10-14a6 6 0 0 1 10-3 6 6 0 0 1 10 3c0 5-5 10-10 14z" fill="#ff6b8b" /></g>
    </>
  );
}

function BeforeAfter() {
  return (
    <>
      <g className="bsa-float bsa-d2" filter="url(#bsa-sh2)">
        <path d="M212 40h30l8 10h38v50h-76z" fill="url(#bsa-deep)" opacity=".75" />
        <path d="M206 54h30l8 10h38v52h-76z" fill="url(#bsa-blue)" />
      </g>
      <g className="bsa-float" filter="url(#bsa-sh)">
        <g transform="rotate(-6 100 120)">
          <rect x="40" y="72" width="122" height="92" rx="12" fill="url(#bsa-card)" />
          <rect x="48" y="80" width="106" height="76" rx="7" fill="#dfe8ff" />
          <path d="M48 140l32-34 24 24 16-14 34 28v12H48z" fill="#b3c6ff" />
          <circle cx="132" cy="100" r="7" fill="#fff" />
        </g>
      </g>
      <g className="bsa-float bsa-d1" filter="url(#bsa-sh)">
        <g transform="rotate(4 210 160)">
          <rect x="140" y="104" width="128" height="98" rx="12" fill="url(#bsa-card)" />
          <rect x="148" y="112" width="112" height="82" rx="7" fill="#c6d6ff" />
          <path d="M148 172l34-38 26 26 18-16 34 30v20H148z" fill="#7d9dff" />
          <circle cx="238" cy="132" r="7" fill="#fff" />
        </g>
      </g>
      <g className="bsa-float bsa-d3"><path d="M66 192c26 14 60 8 84-12" fill="none" stroke="#2f6bff" strokeWidth="7" strokeLinecap="round" /><path d="M140 168l16 12-20 6z" fill="#2f6bff" /></g>
    </>
  );
}

function AiSearch() {
  return (
    <>
      <g className="bsa-float" filter="url(#bsa-sh)">
        <rect x="40" y="36" width="240" height="46" rx="23" fill="#fff" />
        <circle cx="68" cy="59" r="8" fill="none" stroke="#6b7a9f" strokeWidth="3" /><path d="M74 65l7 7" stroke="#6b7a9f" strokeWidth="3" strokeLinecap="round" />
        <rect x="92" y="53" width="86" height="11" rx="5" fill="#0b1a4a" opacity=".85" />
        <circle cx="254" cy="59" r="17" fill="url(#bsa-deep)" />
        <circle cx="252" cy="57" r="6" fill="none" stroke="#fff" strokeWidth="2.6" /><path d="M257 62l5 5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <g className="bsa-float bsa-d1" filter="url(#bsa-sh)">
        <rect x="52" y="104" width="216" height="62" rx="12" fill="#fff" stroke="#6b8cff" strokeWidth="2" />
        <path d="M78 122l3.5 8 8 3.5-8 3.5-3.5 8-3.5-8-8-3.5 8-3.5z" fill="#2f6bff" />
        <rect x="102" y="120" width="70" height="9" rx="4.5" fill="#2f6bff" />
        <rect x="102" y="138" width="130" height="6" rx="3" fill="#b3c6ff" />
        <rect x="102" y="150" width="100" height="6" rx="3" fill="#d4defc" />
      </g>
      <g className="bsa-float bsa-d2" filter="url(#bsa-sh2)">
        <rect x="52" y="178" width="216" height="40" rx="10" fill="#fff" opacity=".85" />
        <rect x="66" y="192" width="14" height="14" rx="3" fill="#c9d4f2" /><rect x="90" y="193" width="90" height="6" rx="3" fill="#c9d4f2" /><rect x="90" y="205" width="64" height="6" rx="3" fill="#dfe6f9" />
      </g>
      <g className="bsa-float bsa-d3" filter="url(#bsa-sh2)"><path d="M232 138l0 36 10-9 7 15 7-3-7-15 13-1z" fill="#2f6bff" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" /></g>
      <g className="bsa-twinkle"><path d="M22 70l-8-4M26 56l-3-8M16 84l-9 0" stroke="#2f6bff" strokeWidth="3.2" strokeLinecap="round" /></g>
    </>
  );
}

function Youtube() {
  return (
    <>
      <g className="bsa-float" filter="url(#bsa-sh)">
        <rect x="96" y="28" width="196" height="132" rx="14" fill="url(#bsa-card)" />
        <rect x="104" y="36" width="180" height="104" rx="8" fill="url(#bsa-screen)" />
        <path d="M104 118l46-34 34 22 34-26 66 40v20H104z" fill="#8aa6ff" opacity=".55" />
        <circle cx="194" cy="88" r="25" fill="#fff" /><path d="M187 76l22 12-22 12z" fill="#2f6bff" />
        <rect x="108" y="148" width="96" height="5" rx="2.5" fill="#c9d4f2" /><rect x="108" y="148" width="48" height="5" rx="2.5" fill="#2f6bff" />
      </g>
      <g className="bsa-float bsa-d2" filter="url(#bsa-sh2)">
        <rect x="52" y="104" width="62" height="40" rx="9" fill="#1f2a4d" /><rect x="40" y="112" width="22" height="22" rx="5" fill="#2f3b66" />
        <circle cx="100" cy="124" r="11" fill="#0b1330" /><circle cx="100" cy="124" r="6" fill="#5c7cff" />
        <rect x="64" y="144" width="10" height="8" fill="#1f2a4d" />
        <path d="M70 150l-22 66M70 150l18 66M70 150v66" stroke="#2c3862" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g className="bsa-float bsa-d1" filter="url(#bsa-sh2)">
        <rect x="206" y="160" width="86" height="58" rx="10" fill="#fff" />
        <rect x="218" y="192" width="10" height="16" rx="2" fill="#a9bcff" /><rect x="234" y="184" width="10" height="24" rx="2" fill="#7d9dff" /><rect x="250" y="176" width="10" height="32" rx="2" fill="#4a7bff" /><rect x="266" y="168" width="10" height="40" rx="2" fill="#2148d6" />
      </g>
    </>
  );
}

const ARTS = [Insta, BeforeAfter, AiSearch, Youtube];
const ORDER: Record<string, number> = { instagram: 0, camera: 1, sparkles: 2, youtube: 3 };
// 네 그림의 눈에 보이는 크기를 맞추기 위한 배율(전후사진은 원래 작아서 키우고, 인스타는 폭이 좁아 살짝 키움)
const FIT = ["", "translate(-16.6 -12.5) scale(1.1)", "", "translate(-14 0)"];

export default function BoosterArt({ icon }: { icon: string }) {
  const A = ARTS[ORDER[icon] ?? 0];
  return (
    <svg viewBox="0 0 320 240" className="bsa" aria-hidden="true" focusable="false">
      {defs}
      <ellipse cx="170" cy="224" rx="100" ry="9" fill="#2148d6" opacity=".12" />
      <g transform={FIT[ORDER[icon] ?? 0]}><A /></g>
    </svg>
  );
}
