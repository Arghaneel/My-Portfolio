<div align="center">

# Arghaneel Das — Portfolio

**CS Student · Applied AI Intern · Bangalore, IN**

A cinematic, scroll-driven portfolio built with plain HTML, SCSS and vanilla JavaScript.<br>
No framework, no build step, plus a live dashboard of my GitHub and LeetCode activity.

[**🌐 Visit the site**](https://arghaneel.github.io/My-Portfolio/) &nbsp;·&nbsp;
[Paper mode](https://arghaneel.github.io/My-Portfolio/paper/) &nbsp;·&nbsp;
[Live dashboard](https://arghaneel.github.io/My-Portfolio/dashboard/) &nbsp;·&nbsp;
[CV](v1/img/Arghaneel_Das_CV.pdf)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-222?logo=github&logoColor=white)
[![Deploy portfolio](https://github.com/Arghaneel/My-Portfolio/actions/workflows/static.yml/badge.svg)](https://github.com/Arghaneel/My-Portfolio/actions/workflows/static.yml)

</div>

---

## ✨ Highlights

- **Two ways to read it.** The *cinematic* version builds each section as you scroll: selection boxes trace their borders, images wipe in behind a scan line, and text types itself out. *Paper mode* is a quiet, light, single-page version of the same content.
- **Live dashboard, no server.** GitHub contributions, weekly activity, languages and recent repos, plus LeetCode solved-by-difficulty, submission calendar, ranking and badges. Every chart is hand-drawn SVG, with no chart library.
- **Snapshot plus live refresh.** GitHub Actions fetches a fresh stats snapshot on every push and every 6 hours. The browser then refreshes it while the tab is open (GitHub every 5 min, LeetCode every 10 min).
- **Zero build.** Plain HTML pages with relative links, so the site works on GitHub Pages, on a custom domain, or opened straight from disk.
- **Accessible by default.** Visitors who prefer reduced motion, or whose CDN fails to load, get the full page without animation.

## 📄 What's inside

| Page | What it shows |
| --- | --- |
| **Home** | Hero, knowledge slides, project rail, live activity and short previews of every page |
| **About** | Background, how I build, experience and leadership |
| **Projects** | Case studies for SixthSense, ElectriFlow, Carbon Grove and Jeevandhara |
| **Achievements** | Hackathons, pitches, certifications and CV |
| **Dashboard** | Live GitHub and LeetCode stats, each with its own detail page |
| **Contact** | How to reach me, plus "The End" credits |
| **Paper** | The whole portfolio on one quiet page |

### Featured projects

| Project | What it is | Stack |
| --- | --- | --- |
| **SixthSense** | Wearable navigation aid that detects head-level obstacles and gives LED and audio alerts | ESP32 · C++ · Arduino |
| **ElectriFlow** | Desktop electricity-billing app with slab-based bills and role-based portals ([repo](https://github.com/Arghaneel/ELECTRICITY_BILL_GENERATOR-1AT24CS025-1AT24CS029-)) | Java 17 · Swing · MySQL |
| **Carbon Grove** | Gamified mobile app built in 25 hours, CODE RED '25 finalist | Mobile · Gamification |
| **Jeevandhara** | AgriTech platform for farmer insights and market access, pitched at Eureka! ([repo](https://github.com/Arghaneel/jeevandhara)) | Python · Scraping |

## 🛠 Tech stack

| Layer | Tools |
| --- | --- |
| Markup and styles | HTML5, SCSS compiled to CSS |
| Motion | GSAP 3 + ScrollTrigger (cdnjs) |
| Data and charts | Vanilla JS, hand-built SVG charts, `localStorage` cache |
| Data sources | GitHub REST + GraphQL, LeetCode GraphQL, with public API fallbacks |
| Fonts | Anton, Inter Tight, JetBrains Mono (Google Fonts) |
| CI/CD | GitHub Actions → GitHub Pages |

## 📁 Project structure

```
My-Portfolio/
├── v1/                              the website (this folder is what gets published)
│   ├── index.html                   Home
│   ├── about/  projects/  achievements/  dashboard/  contact/
│   ├── paper/                       "Paper" mode: quiet single-page version
│   ├── scss/   →   css/             styles (commit both)
│   ├── js/                          content arrays, animation engine, dashboard
│   ├── img/                         photo, favicon, CV
│   └── README.md                    full editing guide
├── scripts/fetch-stats.mjs          builds the dashboard snapshot at deploy time
└── .github/workflows/static.yml     deploys v1/ on every push to main and every 6 hours
```

## 🚀 Run it locally

Open `v1/index.html` in a browser, or serve the folder (closer to the live site):

```bash
npx serve v1
# or
cd v1 && python3 -m http.server 8000
```

To build the dashboard snapshot locally (Node 20+, from the repo root):

```bash
node scripts/fetch-stats.mjs v1/data/stats.json
```

## ☁️ Deploy

1. Push to `main`.
2. One time only, in the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

No API keys or secrets are needed, because the workflow uses GitHub's built-in token. If a data source is down during a deploy, the previous snapshot is kept for that platform, so the dashboard never shows made-up numbers.

> GitHub pauses scheduled workflows after 60 days without repository activity. Any push turns them back on.

## ✏️ Editing

| To change | Edit |
| --- | --- |
| Projects, skills, experience, achievements | The arrays at the top of `v1/js/script.js` (cinematic) and `v1/js/paper.js` (paper) |
| Hero, about, contact, case-study text | That page's `index.html` |
| Styles | `v1/scss/*.scss`, then recompile (see below) |
| GitHub / LeetCode usernames | `USERS` in `v1/js/stats.js` and the `env` block of the workflow |

```bash
cd v1
npx sass scss/style.scss     css/style.css     --no-source-map
npx sass scss/paper.scss     css/paper.css     --no-source-map
npx sass scss/dashboard.scss css/dashboard.css --no-source-map
```

To animate a new element on a cinematic page, add a `data-b` attribute (`frame`, `img`, `type`, `words` or `pop`). The full guide is in [`v1/README.md`](v1/README.md).

## 📬 Contact

[![Email](https://img.shields.io/badge/Email-arghaneeldas29%40gmail.com-D14836?logo=gmail&logoColor=white)](mailto:arghaneeldas29@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-arghaneel--das-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/arghaneel-das/)
[![LeetCode](https://img.shields.io/badge/LeetCode-arghaneel__das-FFA116?logo=leetcode&logoColor=black)](https://leetcode.com/u/arghaneel_das/)
[![Instagram](https://img.shields.io/badge/Instagram-arghaneel__das-E4405F?logo=instagram&logoColor=white)](https://instagram.com/arghaneel_das_29)

Open to internships and collaborations.

---

<div align="center">
<sub>Design and motion system inspired by <a href="https://zll.me/">Zheng Lin Lei</a>. Built by Arghaneel Das.</sub>
</div>
