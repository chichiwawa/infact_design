import type { Metadata } from "next";
import { pageMetadata, SitePageView } from "@/lib/page";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("contact");
}

export default function ContactPage() {
  return <SitePageView slug="contact" />;
}
