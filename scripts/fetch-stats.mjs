#!/usr/bin/env node
/**
 * Builds v1/data/stats.json for the live dashboard. Runs in GitHub Actions before every
 * deploy (on push and on a schedule), so the dashboard always opens with recent data;
 * the browser then refreshes it live.
 *
 *   GitHub profile + repos   REST API (GITHUB_TOKEN raises the rate limit)
 *   GitHub contributions     GraphQL (needs GITHUB_TOKEN) → github.com calendar page → jogruber API
 *   LeetCode                 leetcode.com GraphQL → alfa-leetcode-api
 *
 * If a platform fails entirely, its block from the currently deployed stats.json
 * (PREVIOUS_STATS_URL) is kept and marked stale. Nothing is ever invented.
 *
 * Usage: node scripts/fetch-stats.mjs [outFile]
 * Env:   GITHUB_USERNAME, LEETCODE_USERNAME, GITHUB_TOKEN, PREVIOUS_STATS_URL
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const GH_USER = process.env.GITHUB_USERNAME || 'Arghaneel';
const LC_USER = process.env.LEETCODE_USERNAME || 'arghaneel_das';
const TOKEN = process.env.GITHUB_TOKEN || '';
const OUT = process.argv[2] || 'v1/data/stats.json';
const UA = 'arghaneel-portfolio-dashboard';

const log = (...a) => console.log('[stats]', ...a);

async function getJSON(url, init = {}, timeout = 20000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    try {
        const res = await fetch(url, { ...init, signal: ctrl.signal });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText} ← ${url}`);
        return await res.json();
    } finally {
        clearTimeout(t);
    }
}

const levelOf = n => (n <= 0 ? 0 : n <= 2 ? 1 : n <= 4 ? 2 : n <= 7 ? 3 : 4);
const byDate = (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);

/* ---------------- GitHub ---------------- */
const restHeaders = {
    Accept: 'application/vnd.github+json',
    'User-Agent': UA,
    'X-GitHub-Api-Version': '2022-11-28',
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {})
};

async function contributionsGraphQL() {
    if (!TOKEN) throw new Error('no token');
    const json = await getJSON('https://api.github.com/graphql', {
        method: 'POST',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': UA },
        body: JSON.stringify({
            query: `query($u:String!){user(login:$u){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`,
            variables: { u: GH_USER }
        })
    });
    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) throw new Error('graphql: ' + JSON.stringify(json?.errors ?? 'no data'));
    const L = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
    const days = cal.weeks.flatMap(w => w.contributionDays.map(d => ({
        date: d.date, count: d.contributionCount, level: L[d.contributionLevel] ?? levelOf(d.contributionCount)
    })));
    return { total: cal.totalContributions, days: days.sort(byDate), source: 'graphql' };
}

async function contributionsPage() {
    const res = await fetch(`https://github.com/users/${GH_USER}/contributions`, { headers: { 'User-Agent': UA, Accept: 'text/html' } });
    if (!res.ok) throw new Error(`page ${res.status}`);
    const html = await res.text();
    const counts = new Map();
    for (const m of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g)) {
        const n = /^([\d,]+)\s+contribution/i.exec(m[2].trim());
        counts.set(m[1], n ? parseInt(n[1].replace(/,/g, ''), 10) : 0);
    }
    const days = [];
    for (const m of html.matchAll(/<td\b[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
        const tag = m[0];
        const date = /data-date="([^"]+)"/.exec(tag)?.[1];
        const level = Number(/data-level="(\d)"/.exec(tag)?.[1] ?? 0);
        const id = /\bid="([^"]+)"/.exec(tag)?.[1];
        if (date) days.push({ date, count: id && counts.has(id) ? counts.get(id) : level > 0 ? 1 : 0, level });
    }
    if (!days.length || !counts.size) throw new Error('page: calendar not found');
    const t = /([\d,]+)\s+contributions?\s+in the last year/i.exec(html);
    return { total: t ? parseInt(t[1].replace(/,/g, ''), 10) : days.reduce((s, d) => s + d.count, 0), days: days.sort(byDate), source: 'github' };
}

async function contributionsPublic() {
    const json = await getJSON(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`, { headers: { 'User-Agent': UA } });
    const days = (json.contributions ?? []).map(d => ({ date: d.date, count: d.count, level: Math.max(0, Math.min(4, d.level)) }));
    if (!days.length) throw new Error('public api: empty');
    return { total: json.total?.lastYear ?? days.reduce((s, d) => s + d.count, 0), days: days.sort(byDate), source: 'public-api' };
}

async function github() {
    const [p, repos] = await Promise.all([
        getJSON(`https://api.github.com/users/${GH_USER}`, { headers: restHeaders }),
        getJSON(`https://api.github.com/users/${GH_USER}/repos?sort=pushed&direction=desc&per_page=100&type=owner`, { headers: restHeaders })
    ]);
    let contributions = null;
    for (const src of [contributionsGraphQL, contributionsPage, contributionsPublic]) {
        try { contributions = await src(); break; } catch (e) { log('contributions:', e.message); }
    }
    return shapeGithub(p, repos, contributions);
}

export function shapeGithub(p, repos, contributions) {
    const own = repos.filter(r => !r.fork);
    const langCount = {};
    for (const r of own) if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    const langTotal = Object.values(langCount).reduce((a, b) => a + b, 0) || 1;
    return {
        fetchedAt: new Date().toISOString(),
        profile: {
            login: p.login, name: p.name || p.login, avatarUrl: p.avatar_url, bio: p.bio || '',
            reposCount: p.public_repos, followers: p.followers, following: p.following,
            url: p.html_url, createdAt: p.created_at
        },
        totals: { stars: own.reduce((s, r) => s + r.stargazers_count, 0), forks: own.reduce((s, r) => s + r.forks_count, 0) },
        repos: own.slice(0, 6).map(r => ({
            name: r.name, description: r.description || '', stars: r.stargazers_count, forks: r.forks_count,
            language: r.language || '', url: r.html_url, pushedAt: r.pushed_at || r.updated_at
        })),
        languages: Object.entries(langCount).map(([name, count]) => ({ name, count, pct: Math.round(count / langTotal * 100) }))
            .sort((a, b) => b.count - a.count).slice(0, 8),
        contributions
    };
}

/* ---------------- LeetCode ---------------- */
async function lcGraphQL(query, variables = {}) {
    const json = await getJSON('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com', 'User-Agent': 'Mozilla/5.0 (portfolio-dashboard)' },
        body: JSON.stringify({ query, variables })
    });
    if (json.errors?.length && !json.data) throw new Error('leetcode: ' + json.errors[0].message);
    return json.data;
}

const parseCal = raw => { try { return typeof raw === 'string' ? JSON.parse(raw) : raw || {}; } catch { return {}; } };

async function leetcodeGraphQL() {
    const d = await lcGraphQL(`query p($u:String!){
        allQuestionsCount{difficulty count}
        matchedUser(username:$u){profile{ranking} submitStatsGlobal{acSubmissionNum{difficulty count}} badges{displayName icon} userCalendar{streak totalActiveDays submissionCalendar}}
        userContestRanking(username:$u){rating attendedContestsCount}
        recentAcSubmissionList(username:$u,limit:10){title titleSlug timestamp lang}
    }`, { u: LC_USER });
    const u = d.matchedUser;
    if (!u) throw new Error('leetcode: user not found');
    const solved = k => u.submitStatsGlobal.acSubmissionNum.find(x => x.difficulty === k)?.count ?? 0;
    const total = k => d.allQuestionsCount.find(x => x.difficulty === k)?.count ?? 0;
    const recent = d.recentAcSubmissionList ?? [];
    const diff = {};
    const slugs = [...new Set(recent.map(r => r.titleSlug))].filter(s => /^[a-z0-9-]+$/.test(s));
    if (slugs.length) {
        try {
            const q = await lcGraphQL(`query{${slugs.map((s, i) => `q${i}:question(titleSlug:"${s}"){difficulty}`).join(' ')}}`);
            slugs.forEach((s, i) => { if (q[`q${i}`]?.difficulty) diff[s] = q[`q${i}`].difficulty; });
        } catch { /* optional */ }
    }
    const cr = d.userContestRanking;
    return {
        fetchedAt: new Date().toISOString(),
        username: LC_USER, profileUrl: `https://leetcode.com/u/${LC_USER}/`, source: 'graphql',
        solved: { all: solved('All'), easy: solved('Easy'), medium: solved('Medium'), hard: solved('Hard') },
        totals: { all: total('All'), easy: total('Easy'), medium: total('Medium'), hard: total('Hard') },
        ranking: u.profile?.ranking ?? null,
        contestRating: cr && cr.attendedContestsCount > 0 ? Math.round(cr.rating) : null,
        contestsAttended: cr?.attendedContestsCount ?? 0,
        totalActiveDays: u.userCalendar?.totalActiveDays ?? null,
        badges: (u.badges ?? []).map(b => ({ name: b.displayName, icon: b.icon?.startsWith('/') ? `https://leetcode.com${b.icon}` : b.icon })),
        recent: recent.map(r => ({ title: r.title, url: `https://leetcode.com/problems/${r.titleSlug}/`, difficulty: diff[r.titleSlug] ?? null, lang: r.lang, ts: Number(r.timestamp) })),
        calendar: parseCal(u.userCalendar?.submissionCalendar)
    };
}

async function leetcodeAlfa() {
    const d = await getJSON(`https://alfa-leetcode-api.onrender.com/userProfile/${LC_USER}`, {}, 60000);
    if (typeof d.totalSolved !== 'number') throw new Error('alfa: unexpected response');
    return {
        fetchedAt: new Date().toISOString(),
        username: LC_USER, profileUrl: `https://leetcode.com/u/${LC_USER}/`, source: 'alfa',
        solved: { all: d.totalSolved, easy: d.easySolved ?? 0, medium: d.mediumSolved ?? 0, hard: d.hardSolved ?? 0 },
        totals: { all: d.totalQuestions ?? 0, easy: d.totalEasy ?? 0, medium: d.totalMedium ?? 0, hard: d.totalHard ?? 0 },
        ranking: d.ranking ?? null, contestRating: null, contestsAttended: 0, totalActiveDays: null, badges: [],
        recent: (d.recentSubmissions ?? []).filter(s => s.statusDisplay === 'Accepted').slice(0, 10)
            .map(s => ({ title: s.title, url: `https://leetcode.com/problems/${s.titleSlug}/`, difficulty: null, lang: s.lang, ts: Number(s.timestamp) })),
        calendar: parseCal(d.submissionCalendar)
    };
}

async function leetcode() {
    const errors = [];
    for (const src of [leetcodeGraphQL, leetcodeAlfa]) {
        try { return await src(); } catch (e) { errors.push(e.message); }
    }
    throw new Error(errors.join(' | '));
}

/* ---------------- main ---------------- */
async function previous() {
    if (!process.env.PREVIOUS_STATS_URL) return null;
    try { return await getJSON(process.env.PREVIOUS_STATS_URL, {}, 15000); } catch { return null; }
}

const [gh, lc] = await Promise.allSettled([github(), leetcode()]);
const prev = (gh.status === 'rejected' || lc.status === 'rejected') ? await previous() : null;
const pick = (r, key) => {
    if (r.status === 'fulfilled') return r.value;
    log(`${key} failed:`, r.reason?.message || r.reason);
    return prev?.[key] ? { ...prev[key], stale: true } : null;
};
const out = { generatedAt: new Date().toISOString(), github: pick(gh, 'github'), leetcode: pick(lc, 'leetcode') };

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(out));
log(`wrote ${OUT}: github=${out.github ? 'ok' : 'none'} (contributions: ${out.github?.contributions?.source ?? 'none'}), leetcode=${out.leetcode ? out.leetcode.source || 'ok' : 'none'}`);
