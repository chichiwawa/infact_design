import Link from "next/link";

export const metadata = { title: "메인 화면 시안" };

const ITEMS = [
  { v: "a", name: "A · 글라스 리본", desc: "흐르는 유리 리본과 떠다니는 구슬. 큰 파란 제목은 오른쪽 아래." },
  { v: "b", name: "B · 오브 스피어", desc: "가운데 반짝이는 파란 구슬과 동심원, 궤도를 도는 유리 알약." },
  { v: "c", name: "C · 혼합", desc: "A 의 리본 배경 + B 의 구슬을 오른쪽에. 제목은 왼쪽." },
];

export default function DemoIndex() {
  return (
    <main className="flex-1 grid place-items-center px-5 py-20" style={{ background: "#f3f6fc", color: "#1d3f8f" }}>
      <div className="w-full max-w-[720px]">
        <h1 className="text-[28px] font-bold">메인 화면 시안</h1>
        <p className="mt-2 text-[15px]" style={{ color: "#5b6b8a" }}>마우스를 움직이면 배경이 같이 움직여요. 각 시안 아래의 A·B·C 버튼으로 바로 비교할 수 있어요.</p>
        <ul className="mt-8 grid gap-3">
          {ITEMS.map((it) => (
            <li key={it.v}>
              <Link href={`/demo/hero-${it.v}`} className="block rounded-2xl bg-white p-5 shadow-sm border border-[#dbe6fb] hover:border-[#4f8ff0] transition-colors">
                <b className="text-[18px]">{it.name}</b>
                <span className="block mt-1 text-[14px]" style={{ color: "#5b6b8a" }}>{it.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
