// Live dashboard page — renders GitHub + LeetCode data from stats.js
(() => {
const {
    createStore, deriveGithub, deriveLeetcode, heatmap, area, bars, segmented, meter, sparkline,
    tableView, statusText, fmt, ago, dateLabel, h
} = window.ADStats;

// each dashboard page has only some of the sections; missing ones render into a detached node
const $ = s => document.querySelector(s) || document.createElement('div');
const MONTH = m => dateLabel(`${m}-01`, { month: 'short', year: 'numeric' });

/* ---------- KPI tiles ---------- */
function tile(el, { kind, label, value, sub, spark }) {
    el.replaceChildren();
    const t = h('div', 'stat-tile');
    const l = h('div', 'st-label'); l.append(h('i', kind), h('span', null, label));
    t.append(l, h('div', 'st-value', value), h('div', 'st-sub', sub || ''));
    el.append(t);
    if (spark) { const sp = h('div', 'st-spark'); el.append(sp); sparkline(sp, spark, { kind }); }
}

function renderKpis(gh, g, lc, l) {
    const k = key => $(`#kpis [data-k="${key}"]`);
    tile(k('contrib'), {
        kind: 'gh', label: 'Contributions, last 12 months',
        value: g ? fmt(g.total) : '—',
        sub: g ? `Longest streak ${fmt(g.longest)} days` : 'Waiting for GitHub…',
        spark: g?.months.slice(-12).map(m => m.count)
    });
    tile(k('ghStreak'), {
        kind: 'gh', label: 'Current GitHub streak',
        value: g ? `${fmt(g.current)} ${g.current === 1 ? 'day' : 'days'}` : '—',
        sub: g?.best?.count ? `Best day: ${fmt(g.best.count)} on ${dateLabel(g.best.date, { day: 'numeric', month: 'short' })}` : ''
    });
    tile(k('repos'), {
        kind: 'gh', label: 'Public repositories',
        value: gh ? fmt(gh.profile.reposCount) : '—',
        sub: gh ? `${fmt(gh.totals.stars)} stars · ${fmt(gh.profile.followers)} followers` : ''
    });
    tile(k('solved'), {
        kind: 'lc', label: 'LeetCode problems solved',
        value: lc ? fmt(lc.solved.all) : '—',
        sub: lc ? `of ${fmt(lc.totals.all)} problems` : 'Waiting for LeetCode…'
    });
    tile(k('subs'), {
        kind: 'lc', label: 'Submissions, last 12 months',
        value: l ? fmt(l.yearSubs) : '—',
        sub: l ? `${fmt(l.yearActive)} active days` : '',
        spark: l?.months.slice(-12).map(m => m.count)
    });
    tile(k('lcStreak'), {
        kind: 'lc', label: 'Current LeetCode streak',
        value: l ? `${fmt(l.current)} ${l.current === 1 ? 'day' : 'days'}` : '—',
        sub: l ? `Longest ${fmt(l.longest)} days` : ''
    });
}

/* ---------- GitHub ---------- */
function unavailable(el, text) { el.replaceChildren(h('p', 'viz-empty', text)); }

function renderGithub(gh, g, meta) {
    const prof = $('#ghProfile');
    if (!gh) {
        const msg = meta.mode === 'missing' ? 'GitHub data is unavailable right now. It will retry automatically.' : 'Loading GitHub…';
        [prof, $('#ghCal'), $('#ghWeekly'), $('#ghLangs'), $('#ghRepos')].forEach(e => unavailable(e, msg));
        return;
    }
    const p = gh.profile;
    prof.replaceChildren();
    const img = h('img'); img.src = p.avatarUrl; img.alt = ''; img.width = 64; img.height = 64; img.loading = 'lazy';
    const who = h('div', 'who');
    who.append(h('b', null, p.name), h('span', 'mono', `@${p.login}`));
    if (p.bio) who.append(h('p', null, p.bio));
    const nums = h('dl', 'nums');
    [['Repositories', p.reposCount], ['Followers', p.followers], ['Following', p.following], ['Stars earned', gh.totals.stars]].forEach(([t, v]) => {
        const d = h('div'); d.append(h('dt', null, t), h('dd', null, fmt(v))); nums.append(d);
    });
    const link = h('a', 'btn', 'Open profile ↗'); link.href = p.url; link.target = '_blank'; link.rel = 'noopener';
    prof.append(img, who, nums, link);

    if (g) {
        $('#ghCalSub').textContent = `${fmt(g.total)} contributions in the last year · ${fmt(g.activeDays)} active days`;
        heatmap($('#ghCal'), gh.contributions.days, { kind: 'gh', unit: 'contribution' });
        $('#ghCalTable').replaceChildren(tableView('Contributions per month', ['Month', 'Contributions'], g.months.map(m => [MONTH(m.month), fmt(m.count)])));
        const weeks = g.weeks.slice(-52);
        const peak = weeks.reduce((a, b) => (b.count > a.count ? b : a), weeks[0]);
        $('#ghWeekSub').textContent = `Peak week: ${fmt(peak.count)} contributions (week of ${dateLabel(peak.start, { day: 'numeric', month: 'short' })})`;
        area($('#ghWeekly'), weeks.map(w => ({ x: w.start, y: w.count })), { kind: 'gh', unit: 'contribution' });
        $('#ghWeeklyTable').replaceChildren(tableView('Contributions per week', ['Week of', 'Contributions'], weeks.map(w => [dateLabel(w.start), fmt(w.count)])));
    } else {
        unavailable($('#ghCal'), 'The contribution calendar could not be loaded right now.');
        unavailable($('#ghWeekly'), 'Weekly activity needs the contribution calendar.');
    }

    const langs = gh.languages.map(d => ({ label: d.name, value: d.count, pct: d.pct }));
    bars($('#ghLangs'), langs, { kind: 'gh', unit: 'repo' });
    $('#ghLangsTable').replaceChildren(tableView('Repositories by main language', ['Language', 'Repos', 'Share'], langs.map(d => [d.label, d.value, `${d.pct}%`])));

    const repos = $('#ghRepos');
    repos.replaceChildren();
    if (!gh.repos.length) unavailable(repos, 'No public repositories yet.');
    gh.repos.forEach(r => {
        const a = h('a', 'repo'); a.href = r.url; a.target = '_blank'; a.rel = 'noopener';
        const top = h('div', 'repo-top'); top.append(h('b', null, r.name), h('span', 'arr', '↗'));
        a.append(top, h('p', null, r.description || 'No description yet.'));
        const meta = h('div', 'repo-meta mono');
        if (r.language) meta.append(h('span', null, r.language));
        meta.append(h('span', null, `★ ${fmt(r.stars)}`), h('span', null, `⑂ ${fmt(r.forks)}`), h('span', null, `pushed ${ago(r.pushedAt)}`));
        a.append(meta);
        repos.append(a);
    });
}

/* ---------- LeetCode ---------- */
function renderLeetcode(lc, l, meta) {
    if (!lc) {
        const msg = meta.mode === 'missing' ? 'LeetCode data is unavailable right now. It will retry automatically.' : 'Waking up the LeetCode data source… this can take a few seconds.';
        [$('#lcSeg'), $('#lcCal'), $('#lcRecent'), $('#lcBadges')].forEach(e => unavailable(e, msg));
        return;
    }
    $('#lcHero').textContent = fmt(lc.solved.all);
    $('#lcHeroSub').textContent = lc.totals.all ? `solved of ${fmt(lc.totals.all)}` : 'solved';
    segmented($('#lcSeg'), [
        { label: 'Easy', value: lc.solved.easy, cls: 'lc-easy' },
        { label: 'Medium', value: lc.solved.medium, cls: 'lc-medium' },
        { label: 'Hard', value: lc.solved.hard, cls: 'lc-hard' }
    ]);
    meter($('#mEasy'), lc.solved.easy, lc.totals.easy, { cls: 'lc-easy', label: 'Easy' });
    meter($('#mMedium'), lc.solved.medium, lc.totals.medium, { cls: 'lc-medium', label: 'Medium' });
    meter($('#mHard'), lc.solved.hard, lc.totals.hard, { cls: 'lc-hard', label: 'Hard' });

    $('#lcCalSub').textContent = `${fmt(l.yearSubs)} submissions in the last year · ${fmt(l.yearActive)} active days`;
    heatmap($('#lcCal'), l.days, { kind: 'lc', unit: 'submission', max: 13 });
    $('#lcCalTable').replaceChildren(tableView('Submissions per month', ['Month', 'Submissions'], l.months.map(m => [MONTH(m.month), fmt(m.count)])));

    const facts = $('#lcFacts');
    facts.replaceChildren();
    [
        ['Global ranking', lc.ranking ? `#${fmt(lc.ranking)}` : '—'],
        ['Contest rating', lc.contestRating ? `${fmt(lc.contestRating)} · ${fmt(lc.contestsAttended)} contests` : 'No rated contests yet'],
        ['Active days (all time)', fmt(l.activeDays)],
        ['Longest streak', `${fmt(l.longest)} days`]
    ].forEach(([t, v]) => { const d = h('div'); d.append(h('dt', null, t), h('dd', null, v)); facts.append(d); });

    const list = $('#lcRecent');
    list.replaceChildren();
    if (!lc.recent.length) list.append(h('li', 'viz-empty', 'No recent accepted submissions.'));
    lc.recent.forEach(r => {
        const li = h('li');
        const a = h('a', null, r.title); a.href = r.url; a.target = '_blank'; a.rel = 'noopener';
        const m = h('span', 'sub-meta mono');
        if (r.difficulty) { const d = h('span', 'diff'); d.append(h('i', `lc-${r.difficulty.toLowerCase()}`), h('span', null, r.difficulty)); m.append(d); }
        if (r.lang) m.append(h('span', null, r.lang));
        m.append(h('span', null, ago(new Date(r.ts * 1000).toISOString())));
        li.append(a, m);
        list.append(li);
    });

    const badges = $('#lcBadges');
    badges.replaceChildren();
    if (!lc.badges?.length) badges.append(h('p', 'viz-empty', 'No badges yet — they show up here automatically once earned.'));
    (lc.badges || []).forEach(b => {
        const d = h('figure', 'badge');
        if (b.icon) { const i = h('img'); i.src = b.icon; i.alt = ''; i.loading = 'lazy'; i.width = 56; i.height = 56; i.onerror = () => i.remove(); d.append(i); }
        d.append(h('figcaption', null, b.name));
        badges.append(d);
    });
}

/* ---------- status ---------- */
function renderStatus(meta) {
    $('#pillGh span').textContent = statusText(meta.github, 'GitHub');
    $('#pillLc span').textContent = statusText(meta.leetcode, 'LeetCode');
    $('#pillGh').classList.toggle('live', meta.github.mode === 'live');
    $('#pillLc').classList.toggle('live', meta.leetcode.mode === 'live');
    const live = ['github', 'leetcode'].filter(k => meta[k].mode === 'live').length;
    const missing = ['github', 'leetcode'].filter(k => meta[k].mode === 'missing').length;
    const busy = meta.github.busy || meta.leetcode.busy;
    $('#status').textContent = busy ? 'syncing…'
        : live === 2 ? 'live · all sources connected'
        : missing === 2 ? 'offline · retrying automatically'
        : live ? 'live · one source on its saved copy'
        : 'showing the latest snapshot';
    $('#liveDot').className = live === 2 ? 'ok' : live ? 'warn' : '';
    document.body.classList.toggle('is-refreshing', busy);
    $('#refresh').disabled = busy;
}

/* ---------- wire up ---------- */
let last;
function render(state) {
    last = state;
    const g = deriveGithub(state.github), l = deriveLeetcode(state.leetcode);
    renderKpis(state.github, g, state.leetcode, l);
    renderGithub(state.github, g, state.meta.github);
    renderLeetcode(state.leetcode, l, state.meta.leetcode);
    renderStatus(state.meta);
}

const store = createStore(render);
store.boot();
$('#refresh').addEventListener('click', () => store.refresh());
setInterval(() => last && renderStatus(last.meta), 30e3);
let rt, lastW = innerWidth;
addEventListener('resize', () => {
    if (innerWidth === lastW) return; // ignore mobile address-bar resizes
    lastW = innerWidth;
    clearTimeout(rt);
    rt = setTimeout(() => last && render(last), 200);
});
})();
