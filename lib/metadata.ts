import type { Metadata } from "next";
import { siteConfig } from "@/lib/data/site-config";

/** Public URL of the site, without a trailing slash. Set NEXT_PUBLIC_SITE_URL in production. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/**
 * Title, description, canonical URL and link-preview text for one page.
 * Browser and link-preview titles read "<title> — Arghaneel Das".
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} — ${siteConfig.name}`;
  return {
    // `absolute` so nested pages (e.g. /dashboard/github) keep the suffix too.
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: siteConfig.name,
      url: path,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
