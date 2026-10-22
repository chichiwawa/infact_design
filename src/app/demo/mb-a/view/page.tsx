import Motion from "@/components/Motion";
import MarketingTabs from "@/components/sections/MarketingTabs";
import { getPage } from "@/lib/queries";
import type { MarketingTabsData } from "@/lib/sections";

export const metadata = { title: "부스터 모바일 시안 A (화면)" };

export default async function Page() {
  const page = await getPage("home");
  const sec = page?.sections.find((s) => s.kind === "marketing_tabs");
  if (!sec) return null;
  return (
    <>
      <Motion />
      <main className="flex-1"><MarketingTabs title={sec.title ?? ""} data={sec.data as MarketingTabsData} mob="a" /></main>
      <div className="bg-night" style={{ height: "30vh" }} />
    </>
  );
}
