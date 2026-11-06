// Shared by every cinematic page: mobile menu + the "doors close" transition between pages.
(() => {
    const html = document.documentElement;
    const btn = document.querySelector('.menu-btn');
    const menu = document.getElementById('menu');

    if (btn && menu) {
        const set = open => {
            html.classList.toggle('menu-open', open);
            btn.setAttribute('aria-expanded', String(open));
            btn.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
            menu.hidden = !open;
            if (open) menu.querySelector('a')?.focus();
        };
        btn.addEventListener('click', () => set(!html.classList.contains('menu-open')));
        addEventListener('keydown', e => {
            if (e.key === 'Escape' && html.classList.contains('menu-open')) { set(false); btn.focus(); }
        });
        menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
        addEventListener('resize', () => { if (innerWidth > 1240 && html.classList.contains('menu-open')) set(false); });
    }

    // doors close before moving to another page of this site
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.addEventListener('click', e => {
        if (reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = e.target.closest('a[href]');
        if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
        const url = new URL(a.href, location.href);
        if (url.protocol !== location.protocol || url.host !== location.host) return;
        if (!/(\.html|\/)$/.test(url.pathname)) return;            // pages only, not PDFs
        if (url.pathname === location.pathname) return;             // same page / anchors
        e.preventDefault();
        const d = document.createElement('div');
        d.className = 'leave';
        d.innerHTML = '<i></i><i></i>';
        document.body.append(d);
        requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('on')));
        setTimeout(() => { location.href = url.href; }, 520);
    });
    addEventListener('pageshow', e => {
        if (e.persisted) document.querySelectorAll('.leave').forEach(d => d.remove());
    });
})();
