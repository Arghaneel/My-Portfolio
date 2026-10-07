/**
 * LeetCode data for the dashboard – real data only.
 *
 * Source 1: LeetCode's public GraphQL endpoint (same one leetcode.com uses).
 * Source 2: alfa-leetcode-api (community proxy) if GraphQL is unavailable.
 * If both fail, the last successful result is reused; nothing is ever invented.
 */

export interface LeetCodeStats {
  username: string;
  profileUrl: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  ranking: number | null;
  /** null when the user hasn't taken part in a rated contest. */
  contestRating: number | null;
  contestsAttended: number;
  /** Consecutive days with a submission, ending today or yesterday. */
  streak: number;
  /** Longest streak in the last year. */
  maxStreak: number;
  totalActiveDays: number;
  badges: Array<{ name: string; icon?: string }>;
  submissions: Array<{
    title: string;
    url: string;
    status: "Accepted";
    difficulty: "Easy" | "Medium" | "Hard" | null;
    language: string;
    timestamp: number; // unix seconds
  }>;
  /** unix-seconds (UTC midnight) → submission count */
  submissionCalendar: Record<string, number>;
  fetchedAt: string;
  stale?: boolean;
}

const REVALIDATE_SECONDS = 600; // 10 minutes
const lastGood: Record<string, LeetCodeStats> = {};

const LANG_NAMES: Record<string, string> = {
  python: "Python",
  python3: "Python",
  cpp: "C++",
  c: "C",
  java: "Java",
  javascript: "JavaScript",
  typescript: "TypeScript",
  mysql: "SQL",
  mssql: "SQL",
  postgresql: "SQL",
  oraclesql: "SQL",
  csharp: "C#",
  golang: "Go",
};

const prettyLang = (l: string) => LANG_NAMES[l?.toLowerCase()] ?? l;

function parseCalendar(raw: unknown): Record<string, number> {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw as Record<string, number>;
}

/** Computes current and longest streaks from LeetCode's UTC-midnight timestamps. */
export function computeStreaks(calendar: Record<string, number>) {
  const days = new Set<number>();
  for (const [ts, count] of Object.entries(calendar)) {
    if (count > 0) days.add(Math.floor(Number(ts) / 86400));
  }
  const today = Math.floor(Date.now() / 86400000);
  let current = 0;
  let d = days.has(today) ? today : today - 1; // today not over yet
  while (days.has(d)) {
    current++;
    d--;
  }
  let max = 0;
  for (const day of days) {
    if (days.has(day - 1)) continue;
    let len = 1;
    while (days.has(day + len)) len++;
    max = Math.max(max, len);
  }
  return { current, max, activeDays: days.size };
}

/* ------------------------------------------------------------------ */
/* Source 1: LeetCode GraphQL                                          */
/* ------------------------------------------------------------------ */
async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
      "User-Agent": "Mozilla/5.0 (portfolio-dashboard)",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`leetcode graphql ${res.status}`);
  const json = await res.json();
  if (json.errors?.length && !json.data) throw new Error(`leetcode graphql: ${json.errors[0].message}`);
  return json.data as T;
}

type GqlProfile = {
  allQuestionsCount: Array<{ difficulty: string; count: number }>;
  matchedUser: {
    profile: { ranking: number | null };
    submitStatsGlobal: { acSubmissionNum: Array<{ difficulty: string; count: number }> };
    badges: Array<{ displayName: string; icon: string }>;
    userCalendar: { streak: number; totalActiveDays: number; submissionCalendar: string };
  } | null;
  userContestRanking: { rating: number; attendedContestsCount: number } | null;
  recentAcSubmissionList: Array<{ title: string; titleSlug: string; timestamp: string; lang: string }>;
};

async function fromGraphQL(username: string): Promise<LeetCodeStats> {
  const data = await gql<GqlProfile>(
    `query portfolio($username: String!) {
      allQuestionsCount { difficulty count }
      matchedUser(username: $username) {
        profile { ranking }
        submitStatsGlobal { acSubmissionNum { difficulty count } }
        badges { displayName icon }
        userCalendar { streak totalActiveDays submissionCalendar }
      }
      userContestRanking(username: $username) { rating attendedContestsCount }
      recentAcSubmissionList(username: $username, limit: 8) { title titleSlug timestamp lang }
    }`,
    { username }
  );
  const u = data.matchedUser;
  if (!u) throw new Error("leetcode: user not found");

  const solved = (d: string) => u.submitStatsGlobal.acSubmissionNum.find((x) => x.difficulty === d)?.count ?? 0;
  const total = (d: string) => data.allQuestionsCount.find((x) => x.difficulty === d)?.count ?? 0;

  // Look up real difficulties for the recent problems in one aliased query.
  const recent = data.recentAcSubmissionList ?? [];
  const difficulties: Record<string, "Easy" | "Medium" | "Hard"> = {};
  const slugs = [...new Set(recent.map((r) => r.titleSlug))].filter((s) => /^[a-z0-9-]+$/.test(s));
  if (slugs.length) {
    try {
      const q = slugs.map((s, i) => `q${i}: question(titleSlug: "${s}") { difficulty }`).join("\n");
      const res = await gql<Record<string, { difficulty: "Easy" | "Medium" | "Hard" } | null>>(`query { ${q} }`, {});
      slugs.forEach((s, i) => {
        const d = res[`q${i}`]?.difficulty;
        if (d) difficulties[s] = d;
      });
    } catch {
      /* difficulties are optional */
    }
  }

  const calendar = parseCalendar(u.userCalendar?.submissionCalendar);
  const streaks = computeStreaks(calendar);

  return {
    username,
    profileUrl: `https://leetcode.com/u/${username}/`,
    totalSolved: solved("All"),
    totalQuestions: total("All"),
    easySolved: solved("Easy"),
    totalEasy: total("Easy"),
    mediumSolved: solved("Medium"),
    totalMedium: total("Medium"),
    hardSolved: solved("Hard"),
    totalHard: total("Hard"),
    ranking: u.profile?.ranking ?? null,
    contestRating:
      data.userContestRanking && data.userContestRanking.attendedContestsCount > 0
        ? Math.round(data.userContestRanking.rating)
        : null,
    contestsAttended: data.userContestRanking?.attendedContestsCount ?? 0,
    streak: streaks.current,
    maxStreak: Math.max(streaks.max, u.userCalendar?.streak ?? 0),
    totalActiveDays: u.userCalendar?.totalActiveDays ?? streaks.activeDays,
    badges: (u.badges ?? []).map((b) => ({
      name: b.displayName,
      icon: b.icon?.startsWith("/") ? `https://leetcode.com${b.icon}` : b.icon,
    })),
    submissions: recent.map((r) => ({
      title: r.title,
      url: `https://leetcode.com/problems/${r.titleSlug}/`,
      status: "Accepted" as const,
      difficulty: difficulties[r.titleSlug] ?? null,
      language: prettyLang(r.lang),
      timestamp: Number(r.timestamp),
    })),
    submissionCalendar: calendar,
    fetchedAt: new Date().toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/* Source 2: alfa-leetcode-api                                         */
/* ------------------------------------------------------------------ */
async function fromAlfa(username: string): Promise<LeetCodeStats> {
  const res = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`alfa api ${res.status}`);
  const d = await res.json();
  if (typeof d.totalSolved !== "number") throw new Error("alfa api: unexpected response");

  const calendar = parseCalendar(d.submissionCalendar);
  const streaks = computeStreaks(calendar);

  return {
    username,
    profileUrl: `https://leetcode.com/u/${username}/`,
    totalSolved: d.totalSolved,
    totalQuestions: d.totalQuestions ?? 0,
    easySolved: d.easySolved ?? 0,
    totalEasy: d.totalEasy ?? 0,
    mediumSolved: d.mediumSolved ?? 0,
    totalMedium: d.totalMedium ?? 0,
    hardSolved: d.hardSolved ?? 0,
    totalHard: d.totalHard ?? 0,
    ranking: d.ranking ?? null,
    contestRating: null,
    contestsAttended: 0,
    streak: streaks.current,
    maxStreak: streaks.max,
    totalActiveDays: streaks.activeDays,
    badges: [],
    submissions: (d.recentSubmissions ?? [])
      .filter((s: { statusDisplay: string }) => s.statusDisplay === "Accepted")
      .slice(0, 8)
      .map((s: { title: string; titleSlug: string; lang: string; timestamp: string }) => ({
        title: s.title,
        url: `https://leetcode.com/problems/${s.titleSlug}/`,
        status: "Accepted" as const,
        difficulty: null,
        language: prettyLang(s.lang),
        timestamp: Number(s.timestamp),
      })),
    submissionCalendar: calendar,
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats> {
  const errors: string[] = [];
  for (const source of [fromGraphQL, fromAlfa]) {
    try {
      const stats = await source(username);
      lastGood[username] = stats;
      return stats;
    } catch (e) {
      errors.push((e as Error).message);
    }
  }
  console.error("[leetcode] all sources failed:", errors.join(" | "));
  if (lastGood[username]) return { ...lastGood[username], stale: true };
  throw new Error("LeetCode stats unavailable");
}
