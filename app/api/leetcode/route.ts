import { NextResponse } from "next/server";
import { fetchLeetCodeStats } from "@/lib/leetcode";

export const dynamic = "force-dynamic";

export async function GET() {
  const username = process.env.LEETCODE_USERNAME || "arghaneel_das";

  try {
    const stats = await fetchLeetCodeStats(username);
    return NextResponse.json(stats, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    console.error("LeetCode API Route error:", error);
    return NextResponse.json(
      { error: "LeetCode stats are temporarily unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
