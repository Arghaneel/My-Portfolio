/**
 * GitHub data layer for the dashboard.
 *
 * Data sources, in order of preference:
 *   Profile / repos  → GitHub REST API (token optional, raises rate limit 60 → 5,000 req/hr)
 *   Contributions    → 1. GitHub GraphQL API (needs GITHUB_TOKEN)
 *                      2. Public contributions page on github.com (no token needed)
 *                      3. github-contributions-api.jogruber.de (no token needed)
 *
 * Each piece is fetched independently, so one failure (e.g. a REST rate limit)
 * no longer throws the whole dashboard back to fake data. If something does
 * fail, the last successful live value is reused before any sample data.
 */

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: ContributionLevel;
}

interface GithubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
}

export interface GithubStats {
  profile: {
    login: string;
    avatarUrl: string;
    name: string;
    bio: string;
    reposCount: number;
    followers: number;
    following: number;
    githubUrl: string;
  };
  repos: Array<{
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
    updatedAt: string;
  }>;
  languages: Array<{
    name: string;
    percentage: number;
  }>;
  contributions: {
    total: number;
    calendar: ContributionDay[];
    source: "graphql" | "github" | "public-api" | "cached" | "sample";
  };
  /** ISO timestamp of when this payload was assembled on the server. */
  fetchedAt: string;
  /** True when any part of the payload is not live data. */
  stale?: boolean;
}

/** How long (seconds) the server may reuse a GitHub response. Keeps us well
 *  inside the unauthenticated rate limit while still feeling "live". */
const REVALIDATE_SECONDS = 60;

const USER_AGENT = "arghaneel-portfolio-dashboard";

/* ------------------------------------------------------------------ */
/* Last-known-good cache (per server instance)                         */
/* ------------------------------------------------------------------ */
type LastGood = {
  profile?: GithubStats["profile"];
  repos?: GithubRepo[];
  contributions?: { total: number; calendar: ContributionDay[] };
};
const lastGood: Record<string, LastGood> = {};

/* ------------------------------------------------------------------ */
/* Sample data – only used if GitHub has never been reachable          */
/* ------------------------------------------------------------------ */
function sampleProfile(username: string): GithubStats["profile"] {
  return {
    login: username,
    avatarUrl: "/images/Profile.png",
    name: "Arghaneel Das",
    bio: "Computer Science student at Atria Institute of Technology · Applied AI Intern.",
    reposCount: 0,
    followers: 0,
    following: 0,
    githubUrl: `https://github.com/${username}`,
  };
}

function emptyCalendar(): ContributionDay[] {
  // A year of zero-days so the calendar still renders its shape.
  const days: ContributionDay[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
    days.push({ date: d.toISOString().slice(0, 10), count: 0, level: 0 });
  }
  return days;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function restHeaders(token?: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function levelFromCount(count: number): ContributionLevel {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 7) return 3;
  return 4;
}

const GQL_LEVELS: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function sortByDate(days: ContributionDay[]) {
  return days.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/* ------------------------------------------------------------------ */
/* Profile + repos (REST)                                              */
/* ------------------------------------------------------------------ */
async function fetchProfile(username: string, token?: string): Promise<GithubStats["profile"]> {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: restHeaders(token),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`profile ${res.status} ${res.statusText}`);
  const p = await res.json();
  return {
    login: p.login,
    avatarUrl: p.avatar_url,
    name: p.name || p.login,
    bio: p.bio || "No bio description set.",
    reposCount: p.public_repos,
    followers: p.followers,
    following: p.following,
    githubUrl: p.html_url,
  };
}

async function fetchRepos(username: string, token?: string): Promise<GithubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=100&type=owner`,
    { headers: restHeaders(token), next: { revalidate: REVALIDATE_SECONDS } }
  );
  if (!res.ok) throw new Error(`repos ${res.status} ${res.statusText}`);
  return res.json();
}

/* ------------------------------------------------------------------ */
/* Contributions                                                       */
/* ------------------------------------------------------------------ */
async function contributionsFromGraphQL(username: string, token: string) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
    },
    body: JSON.stringify({
      query: `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays { date contributionCount contributionLevel }
                }
              }
            }
          }
        }`,
      variables: { username },
    }),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`graphql ${res.status}`);
  const json = await res.json();
  const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) throw new Error(`graphql: ${JSON.stringify(json?.errors ?? "no data")}`);

  const calendar: ContributionDay[] = [];
  for (const week of cal.weeks as Array<{
    contributionDays: Array<{ date: string; contributionCount: number; contributionLevel: string }>;
  }>) {
    for (const d of week.contributionDays) {
      calendar.push({
        date: d.date,
        count: d.contributionCount,
        level: GQL_LEVELS[d.contributionLevel] ?? levelFromCount(d.contributionCount),
      });
    }
  }
  return { total: cal.totalContributions as number, calendar: sortByDate(calendar) };
}

/** Parses the same HTML fragment github.com uses to draw the profile calendar. */
async function contributionsFromGithubPage(username: string) {
  const res = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`github page ${res.status}`);
  const html = await res.text();

  // id -> count, from <tool-tip for="contribution-day-component-x-y">3 contributions on …</tool-tip>
  const counts = new Map<string, number>();
  const tipRe = /<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
  for (let m; (m = tipRe.exec(html)); ) {
    const text = m[2].trim();
    const n = /^([\d,]+)\s+contribution/i.exec(text);
    counts.set(m[1], n ? parseInt(n[1].replace(/,/g, ""), 10) : 0); // "No contributions on …"
  }

  const calendar: ContributionDay[] = [];
  const tdRe = /<td\b[^>]*\bdata-date="[^"]+"[^>]*>/g;
  for (let m; (m = tdRe.exec(html)); ) {
    const tag = m[0];
    const date = /data-date="([^"]+)"/.exec(tag)?.[1];
    const level = Number(/data-level="(\d)"/.exec(tag)?.[1] ?? 0) as ContributionLevel;
    const id = /\bid="([^"]+)"/.exec(tag)?.[1];
    if (!date) continue;
    const count = id && counts.has(id) ? counts.get(id)! : level > 0 ? 1 : 0;
    calendar.push({ date, count, level });
  }
  if (calendar.length === 0) throw new Error("github page: no calendar cells found");
  // If GitHub changes its markup and we can't read the per-day counts, use the next source
  // instead of guessing.
  if (counts.size === 0) throw new Error("github page: no tooltip counts found");

  const totalMatch = /([\d,]+)\s+contributions?\s+in the last year/i.exec(html);
  const total = totalMatch
    ? parseInt(totalMatch[1].replace(/,/g, ""), 10)
    : calendar.reduce((s, d) => s + d.count, 0);

  return { total, calendar: sortByDate(calendar) };
}

async function contributionsFromPublicApi(username: string) {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`public api ${res.status}`);
  const json = (await res.json()) as {
    total?: Record<string, number>;
    contributions?: Array<{ date: string; count: number; level: number }>;
  };
  const days = json.contributions ?? [];
  if (days.length === 0) throw new Error("public api: empty");
  const calendar = sortByDate(
    days.map((d) => ({
      date: d.date,
      count: d.count,
      level: Math.max(0, Math.min(4, d.level)) as ContributionLevel,
    }))
  );
  const total = json.total?.lastYear ?? calendar.reduce((s, d) => s + d.count, 0);
  return { total, calendar };
}

async function fetchContributions(username: string, token?: string) {
  const attempts: Array<[GithubStats["contributions"]["source"], () => Promise<{ total: number; calendar: ContributionDay[] }>]> = [];
  if (token) attempts.push(["graphql", () => contributionsFromGraphQL(username, token)]);
  attempts.push(["github", () => contributionsFromGithubPage(username)]);
  attempts.push(["public-api", () => contributionsFromPublicApi(username)]);

  const errors: string[] = [];
  for (const [source, run] of attempts) {
    try {
      const result = await run();
      return { ...result, source };
    } catch (e) {
      errors.push(`${source}: ${(e as Error).message}`);
    }
  }
  throw new Error(`All contribution sources failed → ${errors.join(" | ")}`);
}

/* ------------------------------------------------------------------ */
/* Languages                                                           */
/* ------------------------------------------------------------------ */
function computeLanguages(repos: GithubRepo[]) {
  const counts: Record<string, number> = {};
  let total = 0;
  for (const r of repos) {
    if (r.fork || !r.language) continue;
    counts[r.language] = (counts[r.language] || 0) + 1;
    total++;
  }
  return Object.entries(counts)
    .map(([name, c]) => ({ name, percentage: Math.round((c / (total || 1)) * 100) }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8);
}

/* ------------------------------------------------------------------ */
/* Public entry point                                                  */
/* ------------------------------------------------------------------ */
export async function fetchGithubStats(username: string): Promise<GithubStats> {
  const token = process.env.GITHUB_TOKEN || undefined;
  const cache = (lastGood[username] ??= {});
  let stale = false;

  const [profileR, reposR, contribR] = await Promise.allSettled([
    fetchProfile(username, token),
    fetchRepos(username, token),
    fetchContributions(username, token),
  ]);

  // Profile
  let profile: GithubStats["profile"];
  if (profileR.status === "fulfilled") {
    profile = cache.profile = profileR.value;
  } else {
    console.error("[github] profile:", profileR.reason);
    profile = cache.profile ?? sampleProfile(username);
    stale = true;
  }

  // Repos
  let repos: GithubRepo[];
  if (reposR.status === "fulfilled") {
    repos = cache.repos = reposR.value;
  } else {
    console.error("[github] repos:", reposR.reason);
    repos = cache.repos ?? [];
    stale = true;
  }

  // Contributions
  let contributions: GithubStats["contributions"];
  if (contribR.status === "fulfilled") {
    const { total, calendar, source } = contribR.value;
    cache.contributions = { total, calendar };
    contributions = { total, calendar, source };
  } else {
    console.error("[github] contributions:", contribR.reason);
    stale = true;
    contributions = cache.contributions
      ? { ...cache.contributions, source: "cached" }
      : { total: 0, calendar: emptyCalendar(), source: "sample" };
  }

  const formattedRepos = repos
    .filter((r) => !r.fork)
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      description: r.description || "",
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language || "Unknown",
      url: r.html_url,
      updatedAt: r.pushed_at || r.updated_at,
    }));

  return {
    profile,
    repos: formattedRepos,
    languages: computeLanguages(repos),
    contributions,
    fetchedAt: new Date().toISOString(),
    ...(stale ? { stale: true } : {}),
  };
}
