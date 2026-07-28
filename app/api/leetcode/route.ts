import { NextResponse } from "next/server";
import { fetchLeetCodeStats } from "@/lib/leetcode";

export async function GET() {
  const username = process.env.LEETCODE_USERNAME || "arghaneel-das";

  try {
    const stats = await fetchLeetCodeStats(username);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("LeetCode API Route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch LeetCode stats" },
      { status: 500 }
    );
  }
}
