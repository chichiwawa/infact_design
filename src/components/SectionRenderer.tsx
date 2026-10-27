/**
 * SectionRenderer — page_sections.kind → 렌더러 컴포넌트 (02 §2.6 "kind별 렌더러")
 * 관리자 미리보기도 이 컴포넌트를 그대로 재사용한다 (운영 원칙 2).
 */
import type { PageSection } from "@/lib/sections";
import type * as S from "@/lib/sections";
import type { Business } from "@/lib/queries";
import Hero from "./sections/Hero";
import Numbers from "./sections/Numbers";
import PackageSteps from "./sections/PackageSteps";
import MarketingTabs from "./sections/MarketingTabs";
import Process from "./sections/ProcessAlt";
import Differentiators from "./sections/Differentiators";
import LogoMarquee from "./sections/LogoMarquee";
import BlogLatest from "./sections/BlogLatest";
import FinalCta from "./sections/FinalCta";
import PainQuotes from "./sections/PainQuotes";
import Packages from "./sections/Packages";
import Boosters from "./sections/Boosters";
import Products from "./sections/Products";
import CircleReveal from "./sections/CircleReveal";
import ContactIntro from "./sections/ContactIntro";

/** ⚠️ 섹션 사이에 마커 요소를 끼우면 안 됨 — 서비스 01→02 덮기 효과가 `.pain + .pain-m + section` 형제 선택자라 끊긴다(46차 회귀, 50차 수정). */
export default function SectionRenderer({ sections, biz }: { sections: PageSection[]; biz: Business | null }) {
  // 히어로(sticky, z 0)가 첫 섹션이면 나머지를 z 1 래퍼로 감싸 위로 덮으며 올라오게 (2026-09-16)
  const hero = sections[0]?.kind === "hero" ? sections[0] : null;
  const rest = hero ? sections.slice(1) : sections;
  const body = rest.map((s) => render(s, biz));
  return (
    <>
      {hero && render(hero, biz)}
      {hero ? <div className="relative z-[1]">{body}</div> : body}
    </>
  );
}

function render(s: PageSection, biz: Business | null) {
  {
        const title = s.title ?? "";
        switch (s.kind) {
          case "hero": return <Hero key={s.id} data={s.data as S.HeroData} />;
          case "numbers": return <Numbers key={s.id} data={s.data as S.NumbersData} />;
          case "package_steps": return <PackageSteps key={s.id} title={title} data={s.data as S.PackageStepsData} />;
          case "marketing_tabs": return <MarketingTabs key={s.id} title={title} data={s.data as S.MarketingTabsData} mob="f" />;
          case "process": return <Process key={s.id} title={title} data={s.data as S.ProcessData} />;
          case "differentiators": return <Differentiators key={s.id} title={title} data={s.data as S.DifferentiatorsData} />;
          case "blog_latest": return <BlogLatest key={s.id} title={title} data={s.data as S.BlogLatestData} />;
          case "logo_marquee": return <LogoMarquee key={s.id} data={s.data as S.LogoMarqueeData} />;
          case "final_cta": return <FinalCta key={s.id} data={s.data as S.FinalCtaData} />;
          case "pain_quotes": return <PainQuotes key={s.id} data={s.data as S.PainQuotesData} />;
          case "packages": return <Packages key={s.id} title={title} data={s.data as S.PackagesData} />;
          case "boosters": return <Boosters key={s.id} title={title} data={s.data as S.BoostersData} />;
          case "products": return <Products key={s.id} title={title} data={s.data as S.ProductsData} />;
          case "contact_intro": return <ContactIntro key={s.id} data={s.data as S.ContactIntroData} biz={biz} />;
          case "circle_reveal": return <CircleReveal key={s.id} data={s.data as S.CircleRevealData} />;
          default: return null;
        }
  }
}
