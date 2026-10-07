import { NextResponse } from "next/server";
import { fetchGithubStats } from "@/lib/github";

// Always run on request – never serve a build-time snapshot.
// (Individual GitHub requests inside are still reused for 60s to respect rate limits.)
export const dynamic = "force-dynamic";

export async function GET() {
  const username = process.env.GITHUB_USERNAME || "Arghaneel";

  try {
    const stats = await fetchGithubStats(username);
    return NextResponse.json(stats, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("GitHub API Route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub stats" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
