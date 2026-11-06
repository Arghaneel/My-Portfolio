# Arghaneel Das — static portfolio (`v1/`)

Plain **HTML + SCSS + vanilla JavaScript + GSAP/ScrollTrigger** (from the cdnjs CDN), with Google Fonts.
No framework, no build step at deploy time. GitHub Actions publishes this folder to GitHub Pages
(`.github/workflows/static.yml`, on every push to `main`).

```
v1/
├── index.html                      Home: hero + short previews of every page
├── about/index.html                About, knowledge slides, how I build, experience
├── projects/index.html             all projects
├── projects/<slug>/index.html      one case-study page per project (4)
├── achievements/index.html         hackathons, pitches, certifications + CV
├── dashboard/index.html            live overview (GitHub + LeetCode)
├── dashboard/github/index.html     GitHub details
├── dashboard/leetcode/index.html   LeetCode details
├── contact/index.html              contact + "The End" credits
├── paper/index.html                "Paper" mode: the quiet, light, single-page version
├── scss/style.scss                 styles for every cinematic page    → css/style.css
├── scss/paper.scss                 styles for paper mode               → css/paper.css
├── scss/dashboard.scss             extra dashboard layout              → css/dashboard.css
├── scss/_viz.scss                  chart components + colour tokens, imported by the files above
├── js/script.js                    content + build-agent engine + scroll scenes (every cinematic page)
├── js/nav.js                       mobile menu + page-to-page door transition
├── js/paper.js                     content + reveals for paper mode
├── js/stats.js                     live data layer + SVG charts (no chart library)
├── js/dashboard.js                 renders the dashboard pages
├── js/live-preview.js              the "Live activity" section on Home and in paper mode
├── data/stats.json                 created at deploy time by ../scripts/fetch-stats.mjs (not committed)
└── img/                            photo, favicon, CV PDF, CV page images
```

Every page is plain HTML. The top bar, mobile menu and footer are repeated in each file, so a
change to the navigation means editing it in each `index.html` (search for `class="hud"`).
Links always point at `…/index.html`, so the site also works when opened straight from disk.

## Live dashboard

`/dashboard/` (plus the "Live activity" section on both home pages) shows GitHub contributions,
weekly activity, languages and recent repos, and LeetCode solved-by-difficulty, a submission
calendar, ranking/contest stats, recent accepted problems and badges.

How it stays live without a server:

1. **Snapshot at deploy time.** The workflow runs `scripts/fetch-stats.mjs` on every push and
   every 6 hours. It reads GitHub (REST + the contribution calendar via GraphQL, using the
   workflow's built-in token) and LeetCode (its GraphQL API), and writes `v1/data/stats.json`.
   If a source fails, the previous deployed snapshot is kept for that platform.
2. **Live refresh in the browser.** The page shows the snapshot instantly, then refreshes from
   `api.github.com`, `github-contributions-api.jogruber.de` and `alfa-leetcode-api.onrender.com`
   (GitHub every 5 min, LeetCode every 10 min while the tab is open), and remembers the latest
   copy in `localStorage`. The status pills show whether each platform is live or on a snapshot.

To try the snapshot script locally (Node 20+, from the repo root):

```bash
node scripts/fetch-stats.mjs v1/data/stats.json
```

Usernames are set in `js/stats.js` (`USERS`) and in the workflow's `env` block.
Note: GitHub pauses scheduled workflows after 60 days without repository activity; any push re-enables them.

## Editing content

Most content lives at the top of the JS files, in plain arrays:

| What | Cinema (`js/script.js`) | Paper (`js/paper.js`) |
| --- | --- | --- |
| Knowledge slides / rows | `KNOW` | `KNOW` |
| Project cards (Home rail + Projects page) | `PROJ` | `PROJ` |
| Ticker / marquee words | `STACK`, `MAKER` | `MARQUEE` |
| Experience | `WORK` | `JOBS` |
| Achievements | `WINS` | `WINS` |

Everything else (hero, about, education, philosophy, CV, contact, and the text of each project's
case-study page) is written directly in that page's HTML.

## Editing styles

Edit the `.scss` files, then recompile from inside `v1/`:

```bash
npx sass scss/style.scss css/style.css --no-source-map
npx sass scss/paper.scss css/paper.css --no-source-map
npx sass scss/dashboard.scss css/dashboard.css --no-source-map
```

(The `@import 'viz';` lines pull in `scss/_viz.scss`; Sass prints a deprecation notice for
`@import`, which is harmless.)

Commit both the `.scss` and the compiled `.css`: GitHub Pages serves the CSS as is.

## Animating new elements (cinema version)

This works on every cinematic page. Give an element a `data-b` attribute and one of the three agents builds it when it scrolls into view:

| `data-b` | Effect |
| --- | --- |
| `frame` | selection box with live W × H, border trace, content fades up |
| `img` | image wipes in behind a glowing scan line |
| `type` | text typed letter by letter behind a caret |
| `words` | text written word by word |
| `pop` | each child pops in one after another |

`data-l="label"` sets the name shown in the HUD, `data-dir="l|r|t"` the image wipe direction, and
`data-manual` leaves the element for a scene in `js/script.js` to trigger, and `data-intro` (inside
`.page-head`) builds it right after a page's title rises. The full loader runs on the first page of a
visit; later pages get a quick one. Visitors who prefer reduced
motion (or if the CDN fails) get the full page with no animation.

## Run locally

Any static server works, e.g. from inside `v1/`:

```bash
npx serve .        # or: python3 -m http.server 8000
```

## Deploying

1. Push to `main`.
2. Once, in the GitHub repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The site is published at `https://arghaneel.github.io/My-Portfolio/`. All paths are relative, so it
   also works on a custom domain (add a `CNAME` file inside `v1/`).

Design and motion system inspired by [Zheng Lin Lei](https://zll.me/).
