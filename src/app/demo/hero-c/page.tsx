import Header from "@/components/Header";
import LightHero from "@/components/demo/LightHero";

export const metadata = { title: "메인 시안 C" };

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1"><LightHero variant="c" /></main>
    </>
  );
}
