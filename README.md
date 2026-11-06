# Arghaneel Das — Portfolio

Static portfolio site: **HTML + SCSS/CSS + vanilla JavaScript**, with GSAP (from a CDN) for motion.
No framework and no build step. GitHub Actions publishes it to GitHub Pages.

Live: https://arghaneel.github.io/My-Portfolio/

```
My-Portfolio/
├── v1/                         the website (this folder is what gets published)
│   ├── index.html              Home
│   ├── about/ projects/ achievements/ dashboard/ contact/   one folder per page
│   ├── paper/                  "Paper" mode: quiet single-page version
│   ├── css/  scss/  js/  img/
│   └── README.md               how to edit content, styles and animations
├── scripts/fetch-stats.mjs     builds the live dashboard snapshot (GitHub + LeetCode) at deploy time
└── .github/workflows/static.yml   deploys v1/ on every push to main and every 6 hours
```

## Run it locally

Open `v1/index.html` in a browser, or serve the folder (closer to the live site):

```bash
npx serve v1          # or: cd v1 && python3 -m http.server 8000
```

## Deploy

1. Push to `main`.
2. Once, in the GitHub repo: **Settings → Pages → Source: GitHub Actions**.

No API keys or secrets are needed; the workflow uses GitHub's built-in token.

## Edit

See [`v1/README.md`](v1/README.md). In short: page text is in each page's `index.html`; lists
(projects, experience, achievements, skills) are arrays at the top of `v1/js/script.js` and
`v1/js/paper.js`; styles are in `v1/scss/` (recompile with `npx sass`, commands in that README).

Design and motion system inspired by [Zheng Lin Lei](https://zll.me/).
