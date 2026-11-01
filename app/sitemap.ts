import type { MetadataRoute } from "next";
import { projects } from "@/lib/data/projects";
import { siteUrl } from "@/lib/metadata";

// Tells search engines which pages exist. Served at /sitemap.xml.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: { path: string; priority: number; changeFrequency: "daily" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "monthly" },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" },
    { path: "/projects", priority: 0.9, changeFrequency: "monthly" },
    { path: "/achievements", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { path: "/dashboard", priority: 0.6, changeFrequency: "daily" },
    { path: "/dashboard/github", priority: 0.5, changeFrequency: "daily" },
    { path: "/dashboard/leetcode", priority: 0.5, changeFrequency: "daily" },
  ];

  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p.path}`, lastModified, changeFrequency: p.changeFrequency, priority: p.priority })),
    ...projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
