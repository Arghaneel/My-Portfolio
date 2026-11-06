// "Live activity" preview on the main page and in paper mode.
// Fills every [data-live] slot inside #live and keeps it refreshed.
(() => {
const { createStore, deriveGithub, deriveLeetcode, heatmap, segmented, statusText, fmt, h } = window.ADStats;

const root = document.querySelector('#live');
if (root) {
    const slot = k => root.querySelector(`[data-live="${k}"]`);

    const tile = (key, kind, label, value, sub) => {
        const el = slot(key);
        if (!el) return;
        el.replaceChildren();
        const t = h('div', 'stat-tile');
        const l = h('div', 'st-label'); l.append(h('i', kind), h('span', null, label));
        t.append(l, h('div', 'st-value', value), h('div', 'st-sub', sub));
        el.append(t);
    };

    let lastHeight = 0, last;
    const render = state => {
        last = state;
        const gh = state.github, lc = state.leetcode;
        const g = deriveGithub(gh), l = deriveLeetcode(lc);
        tile('kpi-contrib', 'gh', 'GitHub contributions', g ? fmt(g.total) : '—', g ? 'in the last 12 months' : 'loading…');
        tile('kpi-streak', 'gh', 'GitHub streak', g ? `${fmt(g.current)} ${g.current === 1 ? 'day' : 'days'}` : '—', g ? `longest ${fmt(g.longest)} days` : '');
        tile('kpi-solved', 'lc', 'LeetCode solved', lc ? fmt(lc.solved.all) : '—', lc ? `of ${fmt(lc.totals.all)} problems` : 'loading…');
        tile('kpi-repos', 'gh', 'Public repositories', gh ? fmt(gh.profile.reposCount) : '—', gh ? `${fmt(gh.profile.followers)} followers` : '');

        const hm = slot('gh-heatmap');
        if (hm) {
            if (gh?.contributions?.days?.length) heatmap(hm, gh.contributions.days, { kind: 'gh', unit: 'contribution', min: 8, max: 14 });
            else hm.replaceChildren(h('p', 'viz-empty', state.meta.github.mode === 'missing' ? 'GitHub is unreachable right now.' : 'Loading the contribution calendar…'));
        }
        const sub = slot('gh-sub');
        if (sub) sub.textContent = g ? `${fmt(g.total)} contributions · ${fmt(g.activeDays)} active days` : '';

        const seg = slot('lc-seg');
        if (seg) {
            if (lc) segmented(seg, [
                { label: 'Easy', value: lc.solved.easy, cls: 'lc-easy' },
                { label: 'Medium', value: lc.solved.medium, cls: 'lc-medium' },
                { label: 'Hard', value: lc.solved.hard, cls: 'lc-hard' }
            ]);
            else seg.replaceChildren(h('p', 'viz-empty', state.meta.leetcode.mode === 'missing' ? 'LeetCode is unreachable right now.' : 'Waking up the LeetCode data source…'));
        }
        const hero = slot('lc-hero');
        if (hero) hero.textContent = lc ? fmt(lc.solved.all) : '—';
        const heroSub = slot('lc-hero-sub');
        if (heroSub) heroSub.textContent = lc ? `solved · ${l ? `${fmt(l.yearSubs)} submissions this year` : ''}` : '';

        const st = slot('status');
        if (st) st.textContent = `${statusText(state.meta.github, 'GitHub')} — ${statusText(state.meta.leetcode, 'LeetCode')}`;

        // pinned scroll scenes need to re-measure when the section grows
        const hNow = root.offsetHeight;
        if (Math.abs(hNow - lastHeight) > 4) {
            lastHeight = hNow;
            clearTimeout(render.t);
            render.t = setTimeout(() => window.ScrollTrigger?.refresh(), 150);
        }
    };

    const store = createStore(render);
    store.boot();
    let w = innerWidth, rt;
    addEventListener('resize', () => {
        if (innerWidth === w) return;
        w = innerWidth;
        clearTimeout(rt);
        rt = setTimeout(() => last && render(last), 200);
    });
    setInterval(() => last && render(last), 60e3);
}
})();
