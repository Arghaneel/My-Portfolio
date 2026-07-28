# Arghaneel Das — Portfolio Website

> Build spec for an AI coding agent. This document is the single source of truth for scaffolding, pages, components, data, and behavior. Implement everything described here with full functionality (not placeholders) unless a section is explicitly marked as mock/sample data.

---

## 1. Project Summary

A personal developer portfolio for **Arghaneel Das**, Computer Science student and President of OSCode Atria. The site showcases projects, skills, GitHub/LeetCode stats via a "Developer Dashboard," experience/leadership, education, and a contact form.

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animation:** Framer Motion
- **Validation:** Zod
- **Deployment:** Vercel
- **Theme:** Light/Dark mode toggle (persisted, e.g. via `next-themes`)

---

## 2. Architecture

### 2.1 High-Level Flow

```
User Browser (Desktop / Tablet / Phone)
        │
        ▼
Next.js 15 (App Router)
        │
 ┌──────┼───────────────┬───────────────┐
 ▼                      ▼               ▼
Pages              Components       API Routes
 │                      │                │
 - Home                 - Navbar         - /api/github
 - About                - Hero           - /api/leetcode
 - Skills               - ProjectCard    - /api/contact
 - Projects             - Timeline       - /api/analytics
 - Dashboard            - Footer
 - Experience           - ThemeToggle
 - Contact              - Forms
        │
        ▼
Business Logic
 - Fetch GitHub Data
 - Fetch LeetCode Stats
 - Form Validation (Zod)
 - Theme Management
 - Utility Functions
        │
 ┌──────┼───────────────┐
 ▼                      ▼               ▼
GitHub API         LeetCode API    Contact Service
                                        │
                                        ▼
                                 Resend / EmailJS
        │
        ▼
Deployment: Vercel
```

### 2.2 Layered Architecture

```
Presentation Layer
├── React
├── Tailwind CSS
├── shadcn/ui
└── Framer Motion

Business Logic Layer
├── Utility Functions
├── Custom Hooks
├── API Calls
└── Validation (Zod)

Data Layer
├── GitHub API (REST/GraphQL)
├── LeetCode API (unofficial/GraphQL proxy)
├── Local Data Files (JSON/TS — projects, skills, experience, education)
└── Contact Service (Resend or EmailJS)

Deployment Layer
└── Vercel (with environment variables for API keys)
```

---

## 3. Folder Structure

```
portfolio/
├── app/
│   ├── layout.tsx                # Root layout, theme provider, fonts, navbar/footer
│   ├── page.tsx                  # Home (Hero)
│   ├── about/page.tsx
│   ├── skills/page.tsx
│   ├── projects/
│   │   ├── page.tsx               # Projects listing + filters
│   │   └── [slug]/page.tsx        # Project detail page
│   ├── dashboard/
│   │   ├── page.tsx               # Dashboard overview
│   │   ├── github/page.tsx
│   │   └── leetcode/page.tsx
│   ├── experience/page.tsx
│   ├── contact/page.tsx
│   ├── not-found.tsx              # Custom 404
│   └── api/
│       ├── github/route.ts
│       ├── leetcode/route.ts
│       ├── contact/route.ts
│       └── analytics/route.ts
├── components/
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── theme-toggle.tsx
│   ├── hero.tsx
│   ├── project-card.tsx
│   ├── timeline.tsx
│   ├── stat-card.tsx
│   ├── contribution-graph.tsx
│   ├── forms/
│   │   └── contact-form.tsx
│   └── ui/                        # shadcn/ui primitives
├── lib/
│   ├── github.ts                  # GitHub data fetch + caching
│   ├── leetcode.ts                # LeetCode data fetch + caching
│   ├── validations.ts             # Zod schemas
│   ├── utils.ts
│   └── data/
│       ├── projects.ts
│       ├── skills.ts
│       ├── experience.ts
│       └── education.ts
├── hooks/
│   ├── use-github-stats.ts
│   └── use-leetcode-stats.ts
├── public/
│   ├── images/
│   └── resume.pdf
├── .env.local.example
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── README.md
```

---

## 4. Pages & Required Functionality

Every page shares a persistent **Navbar** (Home, About, Skills, Projects, Experience, Dashboard, Contact + theme toggle icon) and a **Footer** (Quick Links, Resources, Connect socials, copyright).

### 4.1 Home / Hero (`/`)
- Greeting: "Hi, I'm **Arghaneel Das**" with role subtitle ("Computer Science Student", "President of OSCode Atria").
- Short intro paragraph about building intelligent, user-focused applications (web dev, AI, IoT).
- CTA buttons: **View Projects** (scrolls/links to `/projects`) and **Download Resume** (links to `/resume.pdf` in `public/`).
- Social icon row: GitHub, LinkedIn, Email, Instagram — real links pulled from a central `siteConfig` object.
- Circular profile photo with floating tech-stack icon badges (Python, React/JS, Arduino/IoT chip, etc.) animated with subtle Framer Motion float/parallax.
- Stat strip (4 stat cards): Lines of Code, Projects, Leadership Roles, Students Impacted — values sourced from `lib/data/site-stats.ts` (editable constants), not live-computed.

### 4.2 About (`/about`)
- Photo + bio copy: CS student passionate about software development, AI, IoT, open source; enjoys building practical real-world solutions; leads student communities and organizes events.
- Info cards: Name, Location (Bangalore, India), Email.

### 4.3 Skills (`/skills`)
- Grouped skill cards with icons:
  - **Languages:** Python, C, C++, JavaScript, SQL
  - **Frontend:** HTML, CSS, React, Tailwind CSS, Bootstrap
  - **Backend:** Node.js, Express.js, Flask, REST API
  - **Databases:** MongoDB, Firebase, MySQL
  - **Tools & Others:** Git, GitHub, VS Code, Postman, Figma, Arduino IDE, Linux
- Use `react-icons` / `simple-icons` for brand icons. Store skill data in `lib/data/skills.ts` as typed arrays so new skills can be added without touching JSX.

### 4.4 Projects (`/projects`)
- Filter tab bar: All / Web Development / AI/ML / IoT / Full Stack (client-side filter, no reload).
- Grid of **Project Cards**: cover image, title, one-line description, tech-stack chips, "Live Demo" and "GitHub" buttons.
- Seed at least these projects (from `lib/data/projects.ts`), each with a unique `slug` for detail pages:
  1. **Jeevandhara** — AI-powered agriculture platform for crop disease detection, weather prediction, and irrigation alerts. Tags: Python, Flask, MongoDB, AI.
  2. **SixthSense** — IoT wearable device for the visually impaired; detects obstacles and gives real-time alerts. Tags: ESP32, Arduino, IoT, C.
  3. **Indian Folk Art Marketplace** — platform connecting Indian artisans with buyers; features secure listings, categories, responsive design. Tags: Node.js, MongoDB, JS, CSS.
- Card and detail data model (`Project` type):
  ```ts
  interface Project {
    slug: string;
    title: string;
    tagline: string;
    description: string;
    category: "Web Development" | "AI/ML" | "IoT" | "Full Stack";
    techStack: string[];
    keyFeatures: string[];
    images: string[];
    liveDemoUrl?: string;
    githubUrl?: string;
  }
  ```

### 4.5 Project Detail (`/projects/[slug]`)
- Breadcrumb (Projects / Project Name).
- Title + description, tech-stack chip row.
- Screenshot/image gallery (main image + thumbnail strip, lightbox on click).
- "Key Features" bullet list.
- **Live Demo** and **GitHub Repository** buttons linking to real URLs from the data file.
- 404 if slug not found (redirect to custom not-found page).

### 4.6 Developer Dashboard (`/dashboard`)
Overview tab combining live GitHub + LeetCode stats:
- Stat cards: Total Contributions, Repositories, Total Stars, Followers (from live GitHub API data, with a "+N this month" delta computed by comparing to a cached snapshot).
- GitHub contribution heatmap (calendar-style, like GitHub's own) built from `lib/github.ts`.
- LeetCode overview card: Problems Solved (Easy/Medium/Hard breakdown), Contest Rating, Current Streak.

#### 4.6.1 Dashboard → GitHub (`/dashboard/github`)
- Profile summary card (avatar, name, bio snippet).
- Contribution graph (monthly grid, Sun–Sat rows).
- "Recent Repositories" list (name, description, "updated X days ago", stars).
- "Most Used Languages" horizontal bar/percentage breakdown.
- Sidebar counts: Repositories, Contributions, Followers, Following.
- "View Profile" button → real GitHub profile URL.

#### 4.6.2 Dashboard → LeetCode (`/dashboard/leetcode`)
- Stat row: Total Solved, Easy, Medium, Hard, Contest Rating, Global Ranking.
- "Current Streak" card with flame icon and day count.
- Submission calendar heatmap.
- Badges row (earned badge icons, "View All").
- "Recent Submissions" table: Problem, Status, Difficulty, Language, Submission Time.

**Live data requirement:** Both dashboard sub-pages must call the internal API routes (`/api/github`, `/api/leetcode`), which in turn call the real GitHub REST API (`https://api.github.com`) and a LeetCode stats API (e.g. `https://leetcode-stats-api.herokuapp.com/{username}` or an equivalent public GraphQL proxy — pick one that's currently reachable and document it in `.env.local.example`). Cache responses server-side (revalidate every 15–30 min via Next.js `fetch` cache/`revalidate`) to avoid rate limits.

### 4.7 Experience & Leadership (`/experience`)
- Horizontal/vertical timeline with 3+ entries, each with date range, role/title, org, description. Example entries:
  - **President, OSCode Atria** (2026–Present) — leading a community of developers, hackathons, and open-source initiatives.
  - **Event Management Lead, OSCode** (2025–Present) — organizing coding meetups, tech events and workshops.
  - **Placement Coordinator, Computer Science Department** (2024–Present) — coordinating placement activities and communication between students and companies.
- Education section: Bachelor of Engineering, Computer Science & Engineering, Atria Institute of Technology, Bangalore (2024–2026 Expected), CGPA.
- Certifications grid with logos: Google IT Automation, Cisco Networking, NPTEL Data Structures, IBM Python for Data Science, AWS Cloud Practitioner. "View All Certifications" link.

### 4.8 Contact (`/contact`)
- Left column: intro copy + contact info list (Email, LinkedIn, GitHub, Instagram) as clickable links.
- Right column: **Contact Form** — Name, Email, Subject, Message fields.
  - Client + server validation via **Zod** schema shared between form and API route.
  - Submit → `POST /api/contact` → sends email via **Resend** or **EmailJS** (pick one; document required env vars).
  - Show success/error toast (shadcn `sonner`/`toast`) and disable button while submitting.

### 4.9 Custom 404 (`not-found.tsx`)
- Friendly "404 — Page Not Found" illustration, short message, "Go Home" button back to `/`.

---

## 5. API Routes (Business Logic Layer)

| Route | Method | Purpose |
|---|---|---|
| `/api/github` | GET | Fetch profile, repos, contribution stats, languages for the configured GitHub username. |
| `/api/leetcode` | GET | Fetch solved counts, contest rating, streak, recent submissions for the configured LeetCode username. |
| `/api/contact` | POST | Validate (Zod) and send contact form submissions via email service. |
| `/api/analytics` | GET/POST | Optional — track page views or simple site analytics (can be a lightweight stub writing to a KV store or log; do not block launch on this). |

All routes must:
- Use environment variables for usernames/API keys (never hardcode).
- Return typed JSON with proper HTTP status codes.
- Handle upstream failures gracefully (return cached/fallback data + a `stale: true` flag rather than crashing the UI).

---

## 6. Environment Variables (`.env.local.example`)

```
GITHUB_USERNAME=arghaneel-das
GITHUB_TOKEN=              # optional, raises GitHub API rate limit
LEETCODE_USERNAME=arghaneel-das
RESEND_API_KEY=            # if using Resend for contact form
CONTACT_TO_EMAIL=arghaneel@gmail.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.vercel.app
```

---

## 7. Design System Notes

- Match the reference screenshots: clean card-based layout, generous whitespace, rounded-xl cards with soft shadows, blue accent color for primary CTAs, dark navy footer.
- Full dark/light theme parity — every component must have dark-mode styles, not just a background swap.
- Fully responsive: desktop, tablet, and mobile breakpoints (the navbar collapses to a mobile menu below `md`).
- Use consistent icon set (lucide-react) for UI chrome; brand/tech icons via simple-icons or devicon.

---

## 8. Build Steps for the Agent

1. Scaffold Next.js 15 project with TypeScript, Tailwind, App Router.
2. Install and configure shadcn/ui, Framer Motion, Zod, lucide-react.
3. Build shared layout: Navbar, Footer, ThemeToggle, root `layout.tsx`.
4. Create `lib/data/*` files with the seed content in Section 4 (projects, skills, experience, education).
5. Build each page listed in Section 4, wiring real data from `lib/data` first, then live API integrations for the Dashboard.
6. Implement API routes in Section 5 with real fetch logic — no mocked dashboard numbers in the final build.
7. Implement the contact form end-to-end, including a working email send in at least one environment (Resend or EmailJS), gated behind env vars.
8. Add custom 404 page.
9. Verify full responsiveness and dark/light mode on every page.
10. Add `resume.pdf` placeholder to `public/` and wire the Download Resume button.
11. Deploy to Vercel; document required environment variables in the project's Vercel dashboard.

**Definition of done:** every page in Section 4 renders with real content (not lorem ipsum), the dashboard pulls live GitHub/LeetCode data through the API routes, the contact form actually delivers an email, and the site builds/deploys cleanly on Vercel with no console errors.
