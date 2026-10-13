/** 서비스 03 — 집중 공략 부스터 4종 (구성 항목 노출, 가격 비노출) */
import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import type { BoostersData } from "@/lib/sections";

export default function Boosters({ title, data }: { title: string; data: BoostersData }) {
  return (
    <section id="boosters" className="section-y bg-canvas border-t border-hairline scroll-mt-20">
      <div className="container-x">
        <SectionHead title={title} sub={data.subtitle} />

        <div className="reveal-stagger mt-14 grid gap-4 md:grid-cols-2 md:gap-6">
          {data.items.map((it) => (
            <article key={it.title} className="relative card card-hover rounded-[24px] p-8 md:p-10 overflow-hidden">
              {/* 아이콘 없음 — 2026-09-21 사용자 결정 (3D·라인 모두 제거) */}
              <h3 className="t-h-md md:text-[26px] text-ink">{it.title}</h3>
              <p className="text-[16px] md:text-[20px] font-bold leading-[1.4] tracking-[-0.5px] text-primary mt-4">{it.hook}</p>
              <p className="t-body-lg text-body mt-3 whitespace-pre-line">{it.body}</p>
              <div className="mt-7 pt-6 border-t border-hairline">
                <p className="t-eyebrow text-mute">{it.includes_label}</p>
                <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                  {it.includes.map((r) => (
                    <li key={r} className="t-body-lg text-ink flex gap-2"><span className="text-success shrink-0" aria-hidden="true">✔</span><span>{r}</span></li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* 2026-09-22 사용자 결정: 중앙 정렬 대형 배너("패키지를 모두 진행하고 계신다면?" — '모두'가 뜻을 바꿔 어색)를 버리고
            02 패키지 배너(Packages.tsx)와 같은 구조(왼쪽 제목+설명, 오른쪽 버튼)로 통일, 배경만 검정(bg-night). 옛 본문 첫 줄이 제목, 둘째 줄이 설명. */}
        <div className="mt-8 rounded-[24px] bg-night text-white on-dark p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6" data-reveal>
          <div>
            <p className="t-h-md text-white">{data.banner.title}</p>
            <p className="t-body-lg text-white/70 mt-2">{data.banner.body}</p>
          </div>
          <Link href={data.banner.cta_href} className="btn-primary shrink-0">{data.banner.cta_label}</Link>
        </div>
      </div>
    </section>
  );
}
