# Arghaneel Das — Portfolio

Personal portfolio of **Arghaneel Das**, Computer Science student at Atria Institute of Technology (CGPA 9.28), Applied AI Intern at DeepAgentLabs and Vice-President of OSCode.

**Pages:** Home · About · Skills · Projects (with case studies) · Experience & Achievements · Developer Dashboard (live GitHub + LeetCode) · Contact

## Highlights

- **Live developer dashboard** – GitHub profile, repositories, a full-year contribution calendar and an activity graph, plus LeetCode stats. Data is fetched server-side, refreshed every minute and re-synced in the browser when you come back to the tab. If an API is down, the last good data is shown instead of placeholder numbers.
- **Interactive background** – a WebGL fluid simulation that follows the cursor, mounted once for every page and disabled for users who prefer reduced motion.
- **Working contact form** – validated with Zod and delivered through Resend; if email isn't configured it tells the visitor and offers a pre-filled email instead of silently dropping the message.
- Light/dark theme, responsive layout, SEO metadata and generated social-share image.

## Tech stack

Next.js (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Zod · react-hook-form · next-themes

## Running locally

```bash
npm install
cp .env.example .env.local   # optional – see below
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `GITHUB_USERNAME` | no | Defaults to `Arghaneel` |
| `GITHUB_TOKEN` | no | Raises GitHub's limit from 60 to 5,000 requests/hour |
| `LEETCODE_USERNAME` | no | Defaults to `arghaneel_das` |
| `RESEND_API_KEY` | for the contact form | API key from [resend.com](https://resend.com) |
| `CONTACT_TO_EMAIL` | no | Where contact messages go |
| `CONTACT_FROM_EMAIL` | no | Sender address (must be a domain verified in Resend) |
| `NEXT_PUBLIC_SITE_URL` | in production | Your deployed URL, used for link previews |

## Project structure

```
app/            routes, API routes (/api/github, /api/leetcode, /api/contact)
components/     UI components (navbar, footer, project cards, contribution graph, fluid background)
hooks/          client data hooks with auto-refresh
lib/            GitHub & LeetCode data fetching, validation
lib/data/       all site content – edit these files to update the portfolio
public/         resume.pdf and images
```

To update content, edit the files in `lib/data/` (projects, experience, education, skills, site config).

## Contact

[arghaneeldas29@gmail.com](mailto:arghaneeldas29@gmail.com) · [GitHub](https://github.com/Arghaneel) · [LinkedIn](https://www.linkedin.com/in/arghaneel-das/)
