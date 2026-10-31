import type { MetadataRoute } from "next";
import { corpus } from "@/lib/corpus";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/work/sitesgen", "/ask", "/cv", "/evals", "/break-it", "/how-it-works", "/notes"];
  return [
    ...pages.map((p) => ({ url: `${SITE}${p}`, priority: p === "/" ? 1 : 0.7 })),
    ...corpus.docs.map((d) => ({ url: `${SITE}/notes/${d.slug}`, priority: 0.4 })),
  ];
}
