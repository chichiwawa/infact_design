import type { Metadata } from "next";
import { pageMetadata, SitePageView } from "@/lib/page";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("services");
}

export default function ServicesPage() {
  return <SitePageView slug="services" />;
}
