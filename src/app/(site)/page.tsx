import type { Metadata } from "next";
import { pageMetadata, SitePageView } from "@/lib/page";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("home");
}

export default function HomePage() {
  return <SitePageView slug="home" />;
}
