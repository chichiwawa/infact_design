/** 서비스 04 — 개별 상품 6종 (3×2 → 모바일 2열) */
import Image from "next/image";
import Icon from "@/components/Icon";
import SectionHead from "@/components/SectionHead";
import type { ProductsData } from "@/lib/sections";

export default function Products({ title, data }: { title: string; data: ProductsData }) {
  return (
    <section id="products" className="section-y bg-elevated border-t border-hairline scroll-mt-20">
      <div className="container-x">
        <SectionHead title={title} sub={data.subtitle} />

        <ul className="reveal-stagger mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {data.items.map((it) => (
            <li key={it.title} className="relative panel card-hover p-6 md:p-8 min-h-[200px] md:min-h-[240px] flex flex-col">
              {it.icon_url ? (
                <span aria-hidden="true" className="absolute top-3 right-3 md:top-4 md:right-4 w-16 h-16 md:w-24 md:h-24 pointer-events-none select-none"><Image src={it.icon_url} alt="" fill sizes="(min-width: 768px) 96px, 64px" className="object-contain" /></span>
              ) : (
                <Icon name={it.icon} className="absolute top-6 right-6 md:top-8 md:right-8 w-7 h-7 text-primary" />
              )}
              <h3 className={`t-h-md text-ink mt-auto ${it.icon_url ? "pt-[84px] md:pt-[116px]" : "pt-8"}`}>{it.title}</h3>
              <p className="t-body md:text-[15px] text-body mt-2">
                {it.lines.map((l) => <span key={l} className="block">{l}</span>)}
              </p>
            </li>
          ))}
        </ul>

        <p className="t-lead text-mute text-center mt-12" data-reveal>{data.note}</p>
      </div>
    </section>
  );
}
