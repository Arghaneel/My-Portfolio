// ============================================
// Paper mode — Arghaneel Das portfolio
// Vanilla JS + GSAP / ScrollTrigger (loaded from the CDN in paper/index.html)
// ============================================
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const list = (items, cls) => `<ul class="${cls}">${items.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;

/* ================= CONTENT (edit here) ================= */
const KNOW = [
    ['Applied AI & Agentic Systems', 'Prototyping, evaluating and documenting agentic AI workflows as an Applied AI Intern at DeepAgentLabs, turning models into tools people actually use.', ['Research', 'Prototype', 'Evaluate', 'Document']],
    ['IoT & Embedded', 'ESP32 and Arduino builds that sense the physical world, like SixthSense, a wearable aid that detects head-level obstacles in real time.', ['ESP32', 'Arduino', 'Sensors']],
    ['Software & Desktop Apps', "Java and Python applications built on object-oriented design, like ElectriFlow's slab-based billing engine with role-based access.", ['Java', 'Python', 'C / C++']],
    ['Databases & SQL', 'Schemas, queries and data-access layers with MySQL, MongoDB and JDBC, designed so the data stays reliable as an app grows.', ['MySQL', 'MongoDB', 'JDBC']],
    ['Web Interfaces', 'Responsive pages with HTML, CSS and JavaScript, and component-driven apps with React, Next.js and Tailwind CSS.', ['HTML / CSS', 'React', 'Next.js', 'Tailwind']],
    ['Leadership & Community', 'Vice-President of OSCode. As Event Coordinator I led a 10-member team and ran tech talks and seminars for 60+ students.', ['OSCode VP', '10-member team', '60+ attendees']]
];

const PROJ = [
    {
        title: 'SixthSense', ctx: 'Wearable · IoT',
        text: 'A wearable navigation aid that detects head-level obstacles in real time. Ultrasonic sensors feed an ESP32, which warns the wearer through LED and audio alerts.',
        feat: ['Real-time, head-level obstacle detection', 'LED and audio alert mechanisms', 'Hands-free wearable form factor'],
        tags: ['ESP32', 'C++', 'Arduino', 'Ultrasonic sensors']
    },
    {
        title: 'ElectriFlow', ctx: 'Desktop app · Team project', href: 'https://github.com/Arghaneel/ELECTRICITY_BILL_GENERATOR-1AT24CS025-1AT24CS029-',
        text: "A Java Swing desktop app that digitises an electricity utility's workflow, from meter reading to invoice, on MySQL via JDBC.",
        feat: ['Admin, Employee, Viewer and Customer portals', 'Slab-based billing for Domestic and Commercial customers', 'Usage charts, JSON backup, CSV export and print-to-PDF invoices'],
        tags: ['Java 17', 'Swing', 'FlatLaf', 'JDBC', 'MySQL']
    },
    {
        title: 'Carbon Grove', ctx: "Hackathon · CODE RED '25 finalist",
        text: 'A gamified mobile application built during CODE RED ’25, a national-level 25-hour hackathon at BMSIT&M, where the team reached the final round.',
        feat: ['Built within 25 hours', 'Qualified for the final round'],
        tags: ['Mobile app', 'Gamification']
    },
    {
        title: 'Jeevandhara', ctx: 'AgriTech · Pitched at Eureka!', href: 'https://github.com/Arghaneel/jeevandhara',
        text: "A platform giving farmers real-time insights and market access, with AI-based crop quality analysis. The repository holds the project's data-scraping component.",
        feat: ['Real-time insights for farmers', 'Market access for produce', 'AI crop quality analysis (proposed)'],
        tags: ['Python', 'Web scraping', 'AgriTech']
    }
];

const JOBS = [
    ['Applied AI Intern', 'DeepAgentLabs – Cloud Daemon LLC', 'Sep 2026 – Present · Remote', 'Internship', [
        'Contribute to applied AI projects spanning research, prototyping, evaluation and documentation.',
        'Collaborate with a distributed team on agentic AI initiatives.']],
    ['Vice-President', 'OSCode Club, Atria Institute of Technology', '2026 – Present', 'Leadership', [
        'Lead and coordinate club initiatives, technical activities and student-focused programs.']],
    ['Event Coordinator', 'OSCode Club, Atria Institute of Technology', '2025 – Jul 2026', 'Leadership', [
        'Led a team of 10 members from ideation through post-event feedback.',
        'Organised tech talks and seminars that drew 60+ participants.']],
    ['Student Coordinator', 'Atria Career Development Centre (CDC)', '2025 – Present', 'Leadership', [
        'Coordinate group discussions, placement seminars and aptitude tests; link between students and the placement department.']],
    ['Technical Team Member', 'Atria Code Club', '2026 – Present', 'Club', []]
];

const WINS = [
    ["CODE RED '25 Hackathon", 'Finalist', 'BMSIT&M', 'Qualified for the final round of a national-level 25-hour hackathon with Carbon Grove, a gamified mobile app.'],
    ['GDG on Campus Solution Challenge', '', 'Amrita Krishi', 'Contributed to an AI-powered mobile app with computer vision for crop grading and a "Doctor AI" module.'],
    ['IIC Ideathon', 'Business plan', 'SmartAgriChain', 'Contributed to a business plan proposing a unified platform to support agricultural activities.'],
    ['Eureka! Pitching Competition', 'Pitch', 'Jeevandhara', 'Pitched a platform giving farmers real-time insights and market access, with AI-based crop quality analysis.'],
    ['Python Foundation Certification', 'Certified', 'Infosys Springboard · Jun 2025', 'Data structures, control flow and object-oriented programming in Python.'],
    ['Seminar on Space Science & Exploration', 'Seminar', 'ISRO', 'One-day seminar by Soundarya Institute of Management and Science with the Indian Space Research Organisation.']
];

const MARQUEE = ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'SQL', 'React', 'Next.js', 'Tailwind CSS', 'MySQL', 'MongoDB', 'ESP32', 'Arduino', 'Applied AI', 'Agentic Systems', 'Git'];

/* ================= render ================= */
$('#knList').innerHTML = KNOW.map(([t, d, tags], i) =>
    `<div class="kn-row rv"><span class="n">${pad(i + 1)}</span><h3>${esc(t)}</h3><div><p>${esc(d)}</p>${list(tags, 'tags')}</div></div>`).join('');

$('#pjGrid').innerHTML = PROJ.map((p, i) => {
    const tag = p.href ? 'a' : 'article';
    const attrs = p.href ? ` href="${p.href}" target="_blank" rel="noopener"` : '';
    return `<${tag} class="pj rv"${attrs}><div class="top"><span class="n">PRJ_${pad(i + 1)}</span><span class="arr" aria-hidden="true">${p.href ? '↗' : '•'}</span></div><h3>${esc(p.title)}</h3><div class="ctx">${esc(p.ctx)}</div><p>${esc(p.text)}</p>${list(p.feat, 'feat')}${list(p.tags, 'tags')}</${tag}>`;
}).join('');

$('#jobList').innerHTML = JOBS.map(([r, o, p, k, d]) =>
    `<div class="job rv"><div><h4>${r}</h4><div class="o">${esc(o)}</div><div class="p">${p}</div>${d.length ? list(d, '') : ''}</div><span class="kind${k === 'Internship' ? ' hot' : ''}">${k}</span></div>`).join('');

$('#winList').innerHTML = WINS.map(([t, res, by, d], i) =>
    `<article class="win rv"><div class="top"><b>${pad(i + 1)}</b><span>${esc(by)}</span></div><h3>${esc(t)}</h3>${res ? `<span class="res">${res}</span>` : ''}<p>${esc(d)}</p></article>`).join('');

const mqHtml = MARQUEE.map(t => `<span>${esc(t)}</span><b>/</b>`).join('');
$('#mq').innerHTML = mqHtml + mqHtml;

// hero letters
$$('.hero h1 .ln').forEach(ln => {
    const t = ln.textContent.trim();
    ln.innerHTML = [...t].map(ch => `<span class="ch">${ch}</span>`).join('');
});

// keep the longest name line inside its column
const fitHero = () => {
    const h1 = $('.hero h1');
    h1.style.fontSize = '';
    const max = h1.clientWidth;
    const w = Math.max(...$$('.ln', h1).map(l => l.scrollWidth));
    if (w > max) h1.style.fontSize = (parseFloat(getComputedStyle(h1).fontSize) * max / w) + 'px';
};
fitHero();
if (document.fonts) document.fonts.ready.then(fitHero);
let fitT; addEventListener('resize', () => { clearTimeout(fitT); fitT = setTimeout(fitHero, 150); });

/* ================= nav ================= */
const nav = $('.nav');
let lastScroll = 0;
addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('hidden-scroll', y > lastScroll && y > 120 && !nav.classList.contains('open'));
    lastScroll = y;
}, { passive: true });

const menu = $('.nav .menu');
const setMenu = open => {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.querySelector('svg').innerHTML = open
        ? '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'
        : '<line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>';
};
menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
$$('.nav ul a').forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('resize', () => { if (innerWidth > 1024) setMenu(false); });

/* ================= loading ================= */
const ready = new Promise(r => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })));
const fonts = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 2000))]);

/* ================= motion ================= */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;

if (gsap && ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('anim');

    // custom cursor on precise pointers
    const cursor = $('.cursor');
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.documentElement.classList.add('has-cursor');
        addEventListener('mousemove', e => gsap.to(cursor, { duration: .2, x: e.clientX, y: e.clientY, ease: 'power2.out' }));
        $$('a, button, .kn-row, .win, .doc').forEach(el => {
            el.addEventListener('mouseenter', () => gsap.to(cursor, { duration: .2, scale: 1.8, opacity: .25 }));
            el.addEventListener('mouseleave', () => gsap.to(cursor, { duration: .2, scale: 1, opacity: .3 }));
        });
    }

    // marquee
    gsap.to('#mq', { xPercent: -50, ease: 'none', duration: 40, repeat: -1 });

    // blobs and watermarks drift with scroll
    gsap.to('.blob-1', { yPercent: 40, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    gsap.to('.blob-2', { yPercent: -50, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    $$('.watermark').forEach(w => gsap.fromTo(w, { xPercent: w.classList.contains('flip') ? -6 : 6 }, {
        xPercent: w.classList.contains('flip') ? 6 : -6, ease: 'none',
        scrollTrigger: { trigger: w.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    }));

    // fade-up reveals, batched so rows stagger
    ScrollTrigger.batch($$('.rv').filter(el => !el.closest('#home')), {
        start: 'top 88%',
        onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: .8, stagger: .08, ease: 'power3.out', overwrite: true })
    });

    Promise.all([ready, fonts]).then(() => {
        $('.loading').classList.add('done');
        gsap.timeline({ delay: .2 })
            .to('.hero h1 .ch', { y: 0, yPercent: 0, duration: .9, stagger: .035, ease: 'power4.out' })
            .to('#home .rv', { opacity: 1, y: 0, duration: .8, stagger: .12, ease: 'power3.out' }, '-=.6')
            .from('.nav', { yPercent: -100, opacity: 0, duration: .6, ease: 'power2.out', clearProps: 'transform,opacity' }, '-=.6');
        ScrollTrigger.refresh();
    });
} else {
    Promise.all([ready, fonts]).then(() => $('.loading').classList.add('done'));
}
})();
