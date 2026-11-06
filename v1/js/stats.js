// ============================================================
// Live stats: data layer + chart renderers (vanilla JS, no libraries)
// Used by dashboard/index.html, the "Live" scene on index.html and paper mode.
//
// Load order: data/stats.json snapshot (built by GitHub Actions) or the browser's
// last live copy, whichever is newer → then live refresh in the browser:
//   GitHub    api.github.com (profile, repos) + github-contributions-api.jogruber.de (calendar)
//   LeetCode  alfa-leetcode-api.onrender.com (may take a few seconds to wake up)
// Nothing is invented: if a source fails, the last good data stays on screen.
// Plain script (no modules) so the site also works when opened straight from disk.
// ============================================================
(() => {
'use strict';

const USERS = { github: 'Arghaneel', leetcode: 'arghaneel_das' };
const ROOT = new URL('../', (document.currentScript && document.currentScript.src) || location.href);
const CACHE_KEY = 'ad-live-stats-v1';
const GH_EVERY = 5 * 60e3;   // GitHub allows 60 unauthenticated requests/hour per visitor
const LC_EVERY = 10 * 60e3;
const DAY = 864e5;

/* ================= formatting ================= */
const nf = new Intl.NumberFormat('en-US');
const fmt = n => (n == null || Number.isNaN(n) ? '—' : nf.format(n));
const compact = n => (n == null ? '—' : n >= 1e4 ? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n) : fmt(n));
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
/** "6 Nov 2026"; opts: { day, month, year, weekday } like toLocaleDateString, always UTC */
function dateLabel(d, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
    const t = new Date(d);
    const parts = [];
    if (opts.weekday) parts.push(WDAY[t.getUTCDay()] + ',');
    if (opts.day) parts.push(t.getUTCDate());
    if (opts.month) parts.push(MON[t.getUTCMonth()]);
    if (opts.year) parts.push(t.getUTCFullYear());
    return parts.join(' ');
}
function ago(iso) {
    if (!iso) return '';
    const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 45) return 'just now';
    if (s < 3600) return `${Math.round(s / 60)} min ago`;
    if (s < 86400) return `${Math.round(s / 3600)} h ago`;
    const d = Math.round(s / 86400);
    return d < 30 ? `${d} day${d > 1 ? 's' : ''} ago` : dateLabel(iso);
}
const plural = (n, w) => `${fmt(n)} ${w}${n === 1 ? '' : 's'}`;
const isoDay = t => new Date(t).toISOString().slice(0, 10);
const todayUTC = () => Date.parse(isoDay(Date.now()));

/* ================= DOM helpers ================= */
function h(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
}
const SVG = 'http://www.w3.org/2000/svg';
function s(tag, attrs = {}, parent) {
    const e = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (parent) parent.append(e);
    return e;
}

/* ================= data ================= */
async function getJSON(url, timeout = 12000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    try {
        const res = await fetch(url, { signal: ctrl.signal, cache: 'no-cache' });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return await res.json();
    } finally {
        clearTimeout(t);
    }
}

const readCache = () => { try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch { return {}; } };
const writeCache = data => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* private mode */ } };

function shapeGithub(p, repos, contributions) {
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
        totals: { stars: own.reduce((t, r) => t + r.stargazers_count, 0), forks: own.reduce((t, r) => t + r.forks_count, 0) },
        repos: own.slice(0, 6).map(r => ({
            name: r.name, description: r.description || '', stars: r.stargazers_count, forks: r.forks_count,
            language: r.language || '', url: r.html_url, pushedAt: r.pushed_at || r.updated_at
        })),
        languages: Object.entries(langCount).map(([name, count]) => ({ name, count, pct: Math.round(count / langTotal * 100) }))
            .sort((a, b) => b.count - a.count).slice(0, 8),
        contributions
    };
}

async function liveGithub(prev) {
    const u = USERS.github;
    const head = { headers: { Accept: 'application/vnd.github+json' } };
    const [p, repos] = await Promise.all([
        fetch(`https://api.github.com/users/${u}`, head).then(r => { if (!r.ok) throw new Error(`GitHub ${r.status}`); return r.json(); }),
        fetch(`https://api.github.com/users/${u}/repos?sort=pushed&direction=desc&per_page=100&type=owner`, head).then(r => { if (!r.ok) throw new Error(`GitHub ${r.status}`); return r.json(); })
    ]);
    let contributions = prev?.contributions ?? null;
    try {
        const c = await getJSON(`https://github-contributions-api.jogruber.de/v4/${u}?y=last`);
        const days = (c.contributions ?? []).map(d => ({ date: d.date, count: d.count, level: Math.max(0, Math.min(4, d.level)) }))
            .filter(d => d.date <= isoDay(Date.now())).sort((a, b) => (a.date < b.date ? -1 : 1));
        if (days.length) contributions = { total: c.total?.lastYear ?? days.reduce((t, d) => t + d.count, 0), days, source: 'public-api' };
    } catch { /* keep the previous calendar */ }
    return shapeGithub(p, repos, contributions);
}

async function liveLeetcode(prev) {
    const u = USERS.leetcode;
    const d = await getJSON(`https://alfa-leetcode-api.onrender.com/userProfile/${u}`, 30000);
    if (typeof d.totalSolved !== 'number') throw new Error('LeetCode: unexpected response');
    const prevDiff = Object.fromEntries((prev?.recent ?? []).map(r => [r.url, r.difficulty]));
    let calendar = d.submissionCalendar;
    try { if (typeof calendar === 'string') calendar = JSON.parse(calendar); } catch { calendar = null; }
    return {
        fetchedAt: new Date().toISOString(),
        username: u, profileUrl: `https://leetcode.com/u/${u}/`, source: 'alfa',
        solved: { all: d.totalSolved, easy: d.easySolved ?? 0, medium: d.mediumSolved ?? 0, hard: d.hardSolved ?? 0 },
        totals: { all: d.totalQuestions ?? prev?.totals?.all ?? 0, easy: d.totalEasy ?? prev?.totals?.easy ?? 0, medium: d.totalMedium ?? prev?.totals?.medium ?? 0, hard: d.totalHard ?? prev?.totals?.hard ?? 0 },
        ranking: d.ranking ?? prev?.ranking ?? null,
        // the live API doesn't carry these, so the snapshot's values are kept
        contestRating: prev?.contestRating ?? null,
        contestsAttended: prev?.contestsAttended ?? 0,
        totalActiveDays: prev?.totalActiveDays ?? null,
        badges: prev?.badges ?? [],
        recent: (d.recentSubmissions ?? []).filter(x => x.statusDisplay === 'Accepted').slice(0, 10).map(x => {
            const url = `https://leetcode.com/problems/${x.titleSlug}/`;
            return { title: x.title, url, difficulty: prevDiff[url] ?? null, lang: x.lang, ts: Number(x.timestamp) };
        }),
        calendar: calendar && Object.keys(calendar).length ? calendar : prev?.calendar ?? {}
    };
}

/**
 * createStore(onChange) → { boot(), refresh(), state }
 * state.meta[platform] = { mode: 'loading'|'snapshot'|'cached'|'live'|'missing', at, busy, error }
 */
function createStore(onChange) {
    const state = {
        github: null, leetcode: null,
        meta: { github: { mode: 'loading' }, leetcode: { mode: 'loading' } }
    };
    const emit = () => onChange(state);
    const newer = (a, b) => (!a ? b : !b ? a : (Date.parse(b.fetchedAt) > Date.parse(a.fetchedAt) ? b : a));

    const runners = {
        github: () => liveGithub(state.github),
        leetcode: () => liveLeetcode(state.leetcode)
    };

    async function refresh(keys = ['github', 'leetcode']) {
        await Promise.all(keys.map(async k => {
            if (state.meta[k].busy) return;
            state.meta[k] = { ...state.meta[k], busy: true };
            emit();
            try {
                state[k] = await runners[k]();
                state.meta[k] = { mode: 'live', at: state[k].fetchedAt };
                const c = readCache(); c[k] = state[k]; writeCache(c);
            } catch (e) {
                state.meta[k] = { ...state.meta[k], busy: false, error: e.message || String(e), mode: state[k] ? state.meta[k].mode : 'missing' };
            }
            state.meta[k].busy = false;
            emit();
        }));
    }

    async function boot() {
        const snap = await getJSON(new URL('data/stats.json', ROOT), 8000).catch(() => null);
        const cache = readCache();
        for (const k of ['github', 'leetcode']) {
            const best = newer(snap?.[k], cache[k]);
            state[k] = best || null;
            state.meta[k] = best ? { mode: best === cache[k] ? 'cached' : 'snapshot', at: best.fetchedAt } : { mode: 'loading' };
        }
        emit();
        refresh();
        const age = k => Date.now() - Date.parse(state.meta[k].at || 0);
        setInterval(() => { if (!document.hidden) refresh(['github']); }, GH_EVERY);
        setInterval(() => { if (!document.hidden) refresh(['leetcode']); }, LC_EVERY);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) return;
            const due = ['github', 'leetcode'].filter(k => age(k) > 2 * 60e3);
            if (due.length) refresh(due);
        });
    }

    return { boot, refresh, state };
}

/* ================= derived numbers ================= */
function streaks(dayKeys, endDay) {
    // dayKeys: Set of day numbers (ms / DAY) with activity
    let current = 0;
    let d = dayKeys.has(endDay) ? endDay : endDay - 1; // today isn't over yet
    while (dayKeys.has(d)) { current++; d--; }
    let longest = 0;
    for (const k of dayKeys) {
        if (dayKeys.has(k - 1)) continue;
        let n = 1;
        while (dayKeys.has(k + n)) n++;
        longest = Math.max(longest, n);
    }
    return { current, longest };
}

function deriveGithub(gh) {
    const days = gh?.contributions?.days ?? [];
    if (!days.length) return null;
    const active = new Set(days.filter(d => d.count > 0).map(d => Date.parse(d.date) / DAY));
    const end = Date.parse(days[days.length - 1].date) / DAY;
    const { current, longest } = streaks(active, end);
    // weekly totals (weeks start on Sunday, like the calendar)
    const weeks = [];
    for (const d of days) {
        const t = Date.parse(d.date), dow = new Date(t).getUTCDay();
        const start = isoDay(t - dow * DAY);
        if (!weeks.length || weeks[weeks.length - 1].start !== start) weeks.push({ start, count: 0 });
        weeks[weeks.length - 1].count += d.count;
    }
    const months = [];
    for (const d of days) {
        const m = d.date.slice(0, 7);
        if (!months.length || months[months.length - 1].month !== m) months.push({ month: m, count: 0 });
        months[months.length - 1].count += d.count;
    }
    const best = days.reduce((a, b) => (b.count > a.count ? b : a), days[0]);
    return { total: gh.contributions.total, current, longest, activeDays: active.size, weeks, months, best };
}

function quantileLevels(counts) {
    const nz = counts.filter(c => c > 0).sort((a, b) => a - b);
    if (!nz.length) return () => 0;
    const q = p => nz[Math.min(nz.length - 1, Math.floor(p * nz.length))];
    const [q1, q2, q3] = [q(.25), q(.5), q(.75)];
    return c => (c <= 0 ? 0 : c <= q1 ? 1 : c <= q2 ? 2 : c <= q3 ? 3 : 4);
}

function deriveLeetcode(lc) {
    if (!lc) return null;
    const byDay = new Map();
    for (const [ts, n] of Object.entries(lc.calendar || {})) {
        const k = isoDay(Number(ts) * 1000);
        byDay.set(k, (byDay.get(k) || 0) + Number(n));
    }
    const end = todayUTC();
    const days = [];
    for (let t = end - 364 * DAY; t <= end; t += DAY) {
        const date = isoDay(t);
        days.push({ date, count: byDay.get(date) || 0 });
    }
    const level = quantileLevels(days.map(d => d.count));
    days.forEach(d => { d.level = level(d.count); });
    const active = new Set([...byDay.entries()].filter(([, n]) => n > 0).map(([k]) => Date.parse(k) / DAY));
    const { current, longest } = streaks(active, end / DAY);
    const yearSubs = days.reduce((t, d) => t + d.count, 0);
    const yearActive = days.filter(d => d.count > 0).length;
    const months = [];
    for (const d of days) {
        const m = d.date.slice(0, 7);
        if (!months.length || months[months.length - 1].month !== m) months.push({ month: m, count: 0 });
        months[months.length - 1].count += d.count;
    }
    return { days, current, longest, yearSubs, yearActive, activeDays: lc.totalActiveDays ?? active.size, months };
}

/* ================= tooltip (one for the page) ================= */
let tipEl;
function tip(x, y, rows, kind) {
    if (!tipEl) { tipEl = h('div', 'viz-tip'); tipEl.setAttribute('role', 'status'); document.body.append(tipEl); }
    tipEl.replaceChildren();
    rows.forEach(([value, label], i) => {
        const r = h('div', 'viz-tip-row');
        if (i === 0 && kind) r.append(h('i', `viz-key ${kind}`));
        r.append(h('b', null, value));
        if (label) r.append(h('span', null, label));
        tipEl.append(r);
    });
    tipEl.classList.add('on');
    const w = tipEl.offsetWidth, ht = tipEl.offsetHeight;
    const left = Math.min(innerWidth - w - 8, Math.max(8, x - w / 2));
    const top = y - ht - 14 < 8 ? y + 18 : y - ht - 14;
    tipEl.style.transform = `translate(${left}px, ${top}px)`;
}
const untip = () => tipEl && tipEl.classList.remove('on');

/* ================= table view (every chart has one) ================= */
function tableView(caption, head, rows) {
    const d = h('details', 'viz-table');
    d.append(h('summary', null, 'View as table'));
    const t = h('table');
    t.append(h('caption', null, caption));
    const tr = h('tr');
    head.forEach(c => tr.append(h('th', null, c)));
    const th = h('thead'); th.append(tr); t.append(th);
    const tb = h('tbody');
    rows.forEach(r => { const row = h('tr'); r.forEach(c => row.append(h('td', null, String(c)))); tb.append(row); });
    t.append(tb);
    d.append(t);
    return d;
}

/* ================= heatmap (calendar) ================= */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function heatmap(container, days, { kind = 'gh', unit = 'contribution', min = 7, max = 15 } = {}) {
    container.replaceChildren();
    if (!days?.length) { container.append(h('p', 'viz-empty', 'No activity data yet.')); return; }
    const first = Date.parse(days[0].date);
    const lead = new Date(first).getUTCDay();          // empty cells before the first day
    const weeks = Math.ceil((lead + days.length) / 7);
    const padL = 28, padT = 18, padR = 22;
    const avail = (container.clientWidth || 700) - padL - padR;
    let gap = 3, cell = Math.floor(avail / weeks) - gap;
    if (cell < 10) { gap = 2; cell = Math.floor(avail / weeks) - gap; }
    cell = Math.max(min, Math.min(max, cell));
    const W = padL + weeks * (cell + gap) + padR, H = padT + 7 * (cell + gap);

    const wrap = h('div', 'viz-scroll');
    const svg = s('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'viz-heat', role: 'img' });
    const total = days.reduce((t, d) => t + d.count, 0);
    svg.setAttribute('aria-label', `${plural(total, unit)} between ${dateLabel(days[0].date)} and ${dateLabel(days[days.length - 1].date)}`);

    ['Mon', 'Wed', 'Fri'].forEach((d, i) => {
        const t = s('text', { x: 0, y: padT + (i * 2 + 1) * (cell + gap) + cell * .8, class: 'viz-axis' }, svg);
        t.textContent = d;
    });
    let lastMonth = -1, lastX = -99;
    const g = s('g', {}, svg);
    days.forEach((d, i) => {
        const pos = lead + i, wk = Math.floor(pos / 7), dow = pos % 7;
        const x = padL + wk * (cell + gap), y = padT + dow * (cell + gap);
        const m = new Date(Date.parse(d.date)).getUTCMonth();
        if (m !== lastMonth && dow <= 1) {
            if (x - lastX > 28) { const t = s('text', { x, y: 11, class: 'viz-axis' }, svg); t.textContent = MONTHS[m]; lastX = x; }
            lastMonth = m;
        }
        s('rect', { x, y, width: cell, height: cell, rx: 2, class: `cell ${kind}-${d.level}`, 'data-i': i }, g);
    });
    const show = e => {
        const i = e.target.getAttribute?.('data-i');
        if (i == null) return untip();
        const d = days[i];
        const r = e.target.getBoundingClientRect();
        tip(r.left + r.width / 2, r.top, [[d.count ? plural(d.count, unit) : `No ${unit}s`, dateLabel(d.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })]], kind);
        e.target.classList.add('hot');
    };
    g.addEventListener('pointerover', show);
    g.addEventListener('pointerout', e => { e.target.classList?.remove('hot'); untip(); });
    wrap.append(svg);

    const legend = h('div', 'viz-legend');
    legend.append(h('span', null, 'Less'));
    for (let l = 0; l <= 4; l++) legend.append(h('i', `sw ${kind}-${l}`));
    legend.append(h('span', null, 'More'));

    container.append(wrap, legend);
    requestAnimationFrame(() => { wrap.scrollLeft = wrap.scrollWidth; }); // newest days in view on phones
}

/* ================= area chart (single series over time) ================= */
function niceMax(v) {
    if (v <= 4) return 4;
    const p = 10 ** Math.floor(Math.log10(v)), n = v / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}

function area(container, points, { kind = 'gh', unit = 'contribution', height = 220, label = 'Week of' } = {}) {
    container.replaceChildren();
    if (!points?.length) { container.append(h('p', 'viz-empty', 'No activity data yet.')); return; }
    const W = Math.max(280, container.clientWidth || 600), H = height;
    const m = { l: 34, r: 14, t: 12, b: 26 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const top = niceMax(Math.max(...points.map(p => p.y)));
    const X = i => m.l + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw);
    const Y = v => m.t + ih - (v / top) * ih;

    const svg = s('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'viz-area', tabindex: 0, role: 'img' });
    svg.setAttribute('aria-label', `${points.length} weeks of ${unit}s; peak ${fmt(Math.max(...points.map(p => p.y)))} in one week. Use arrow keys to read values.`);
    for (let k = 0; k <= 4; k++) {
        const v = top * k / 4, y = Y(v);
        s('line', { x1: m.l, x2: W - m.r, y1: y, y2: y, class: k ? 'viz-grid' : 'viz-base' }, svg);
        const t = s('text', { x: m.l - 8, y: y + 3.5, class: 'viz-axis', 'text-anchor': 'end' }, svg);
        t.textContent = compact(v);
    }
    let lastM = -1, lastX = -99;
    points.forEach((p, i) => {
        const mo = new Date(Date.parse(p.x)).getUTCMonth();
        if (mo !== lastM && X(i) - lastX > 34) {
            const t = s('text', { x: X(i), y: H - 8, class: 'viz-axis', 'text-anchor': 'middle' }, svg);
            t.textContent = MONTHS[mo];
            lastX = X(i);
        }
        lastM = mo;
    });
    const line = points.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p.y).toFixed(1)}`).join('');
    s('path', { d: `${line}L${X(points.length - 1)},${Y(0)}L${X(0)},${Y(0)}Z`, class: `viz-wash ${kind}` }, svg);
    s('path', { d: line, class: `viz-line ${kind}` }, svg);
    const li = points.length - 1;
    s('circle', { cx: X(li), cy: Y(points[li].y), r: 4, class: `viz-dot ${kind}` }, svg);

    const cross = s('line', { y1: m.t, y2: m.t + ih, class: 'viz-cross' }, svg);
    const dot = s('circle', { r: 4, class: `viz-dot ${kind}`, opacity: 0 }, svg);
    let at = li;
    const place = (i, clientX, clientY) => {
        at = i;
        const p = points[i];
        cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.style.opacity = 1;
        dot.setAttribute('cx', X(i)); dot.setAttribute('cy', Y(p.y)); dot.setAttribute('opacity', 1);
        const r = svg.getBoundingClientRect();
        tip(clientX ?? r.left + X(i), clientY ?? r.top + Y(p.y), [[plural(p.y, unit), `${label} ${dateLabel(p.x)}`]], kind);
    };
    const hide = () => { cross.style.opacity = 0; dot.setAttribute('opacity', 0); untip(); };
    svg.addEventListener('pointermove', e => {
        const r = svg.getBoundingClientRect();
        const x = (e.clientX - r.left) * (W / r.width);
        const i = Math.max(0, Math.min(li, Math.round(((x - m.l) / iw) * li)));
        place(i, r.left + X(i) * (r.width / W), r.top + Y(points[i].y) * (r.height / H));
    });
    svg.addEventListener('pointerleave', hide);
    svg.addEventListener('blur', hide);
    svg.addEventListener('focus', () => place(at));
    svg.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            place(Math.max(0, Math.min(li, at + (e.key === 'ArrowRight' ? 1 : -1))));
        }
    });
    container.append(svg);
}

/* ================= horizontal bars (one series) ================= */
function bars(container, items, { kind = 'gh', unit = 'repo', valueText = d => `${d.pct}%` } = {}) {
    container.replaceChildren();
    if (!items?.length) { container.append(h('p', 'viz-empty', 'No data yet.')); return; }
    const maxV = Math.max(...items.map(d => d.value));
    const list = h('div', 'viz-bars');
    items.forEach(d => {
        const row = h('div', 'viz-bar-row');
        row.tabIndex = 0;
        const track = h('div', 'viz-bar-track');
        const fill = h('i', `viz-bar ${kind}`);
        fill.style.width = `${Math.max(2, (d.value / maxV) * 100)}%`;
        track.append(fill);
        row.append(h('span', 'viz-bar-label', d.label), track, h('span', 'viz-bar-val', valueText(d)));
        const show = () => { const r = fill.getBoundingClientRect(); tip(r.right, r.top, [[`${valueText(d)} · ${plural(d.value, unit)}`, d.label]], kind); };
        row.addEventListener('pointerenter', show);
        row.addEventListener('focus', show);
        row.addEventListener('pointerleave', untip);
        row.addEventListener('blur', untip);
        list.append(row);
    });
    container.append(list);
}

/* ================= tall segmented bar (one whole, ≤ 6 parts) ================= */
const lum = hex => {
    const [r, g, b] = [1, 3, 5].map(i => { const c = parseInt(hex.slice(i, i + 2), 16) / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; });
    return .2126 * r + .7152 * g + .0722 * b;
};

function segmented(container, parts, { unit = 'problem', total } = {}) {
    container.replaceChildren();
    const sum = parts.reduce((t, p) => t + p.value, 0);
    const bar = h('div', 'viz-seg');
    bar.setAttribute('role', 'img');
    bar.setAttribute('aria-label', parts.map(p => `${p.label}: ${fmt(p.value)} (${sum ? Math.round(p.value / sum * 100) : 0}%)`).join(', '));
    if (!sum) bar.append(h('span', 'viz-seg-empty', 'Nothing solved yet'));
    parts.filter(p => p.value > 0).forEach(p => {
        const share = Math.round(p.value / sum * 100);
        const b = h('div', `viz-seg-part ${p.cls}`);
        b.style.flexGrow = p.value;
        b.tabIndex = 0;
        const t = h('span', null, `${share}%`);
        b.append(t);
        const show = () => { const r = b.getBoundingClientRect(); tip(r.left + r.width / 2, r.top, [[`${fmt(p.value)} ${unit}s · ${share}%`, p.label]], p.cls); };
        b.addEventListener('pointerenter', show);
        b.addEventListener('focus', show);
        b.addEventListener('pointerleave', untip);
        b.addEventListener('blur', untip);
        bar.append(b);
    });
    const legend = h('div', 'viz-legend names');
    parts.forEach(p => { const it = h('span', 'it'); it.append(h('i', `sw ${p.cls}`), h('span', null, p.label)); legend.append(it); });
    container.append(bar, legend);
    // labels only where they fit; ink picked from the fill's luminance
    requestAnimationFrame(() => bar.querySelectorAll('.viz-seg-part').forEach(b => {
        const t = b.firstChild;
        const bg = getComputedStyle(b).backgroundColor.match(/\d+/g);
        if (bg) b.style.color = lum('#' + bg.slice(0, 3).map(v => (+v).toString(16).padStart(2, '0')).join('')) > .2 ? '#0b0b0b' : '#ffffff';
        if (t.offsetWidth + 16 > b.clientWidth) t.remove();
    }));
    if (total) container.dataset.total = total;
}

/* ================= meter (value against a limit) ================= */
function meter(container, value, max, { cls = 'gh', label, unit = '' } = {}) {
    container.replaceChildren();
    const row = h('div', 'viz-meter-head');
    row.append(h('span', null, label), h('b', null, `${fmt(value)}${max ? ` / ${fmt(max)}` : ''}${unit}`));
    const track = h('div', `viz-meter ${cls}`);
    track.setAttribute('role', 'meter');
    track.setAttribute('aria-valuenow', value);
    track.setAttribute('aria-valuemin', 0);
    track.setAttribute('aria-valuemax', max || value);
    track.setAttribute('aria-label', label);
    const fill = h('i');
    fill.style.width = `${max ? Math.min(100, (value / max) * 100) : 0}%`;
    if (value > 0) fill.style.minWidth = '4px';
    track.append(fill);
    container.append(row, track);
}

/* ================= sparkline (12 points, last one accented) ================= */
function sparkline(container, values, { kind = 'gh' } = {}) {
    container.replaceChildren();
    if (!values?.length) return;
    const W = 120, H = 32, p = 4;
    const mx = Math.max(1, ...values);
    const X = i => p + (values.length === 1 ? 0 : (i / (values.length - 1)) * (W - 2 * p));
    const Y = v => H - p - (v / mx) * (H - 2 * p);
    const svg = s('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'viz-spark', 'aria-hidden': 'true' });
    s('path', { d: values.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(''), class: 'viz-spark-line' }, svg);
    s('circle', { cx: X(values.length - 1), cy: Y(values[values.length - 1]), r: 3.5, class: `viz-dot ${kind}` }, svg);
    container.append(svg);
}

/* ================= status pill ================= */
function statusText(meta, name) {
    if (!meta) return '';
    if (meta.busy && meta.mode === 'loading') return `${name}: connecting…`;
    if (meta.busy) return `${name}: refreshing…`;
    switch (meta.mode) {
        case 'live': return `${name}: live · ${ago(meta.at)}`;
        case 'cached': return `${name}: saved copy · ${ago(meta.at)}`;
        case 'snapshot': return `${name}: snapshot · ${ago(meta.at)}`;
        case 'missing': return `${name}: unavailable right now`;
        default: return `${name}: loading…`;
    }
}

window.ADStats = { USERS, fmt, compact, dateLabel, ago, h, createStore, deriveGithub, deriveLeetcode, tip, untip, tableView, heatmap, area, bars, segmented, meter, sparkline, statusText };
})();
