import Motion from "@/components/Motion";
import Header from "@/components/Header";
import Differentiators from "@/components/sections/Differentiators";
import { getPage } from "@/lib/queries";
import type { DifferentiatorsData } from "@/lib/sections";

export const metadata = { title: "차별점 장식 M1 — 격자·워터마크·링" };

export default async function Page() {
  const page = await getPage("home");
  const sec = page?.sections.find((s) => s.kind === "differentiators");
  if (!sec) return null;
  return (
    <>
      <Motion />
      <Header />
      <main className="flex-1"><Differentiators title={sec.title ?? ""} data={sec.data as DifferentiatorsData} variant="m1" /></main>
      <div className="bg-night" style={{ height: "60vh" }} />
      <div style={{ position: "fixed", left: 16, bottom: 16, zIndex: 80, padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,.92)", color: "#111", fontSize: 13, fontWeight: 700 }}>차별점 장식 M1 — 격자·워터마크·링</div>
    </>
  );
}
