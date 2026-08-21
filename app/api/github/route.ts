import { NextResponse } from "next/server";
import { fetchGithubStats } from "@/lib/github";

export async function GET() {
  const username = process.env.GITHUB_USERNAME || "Arghaneel";

  try {
    const stats = await fetchGithubStats(username);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("GitHub API Route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub stats" },
      { status: 500 }
    );
  }
}
