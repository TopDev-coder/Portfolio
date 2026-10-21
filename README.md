# Portfolio — Senior Full-Stack Engineer

A fast, dependency-free personal portfolio site covering **AI · Systems · Web · Android**.
Pure HTML/CSS/JS: no build step, no framework, and it loads instantly.

> **Note:** "Alex Morgan" and all companies, projects and numbers in `js/data.js` are a **fictional
> persona** created to show a finished senior portfolio. Swap in your real experience before you
> apply anywhere. The live demos are real, working code, and you can keep them as they are.

## Features
- Hero with animated code "terminal", availability badge, résumé link
- About, Expertise (6 areas), filterable **Projects** with detailed case studies
  (role, timeline, problem → solution → architecture flow → key decisions → impact → stack)
- **Live demos**, all running in the browser:
  - *AI*: "Ask my portfolio", BM25 retrieval over the site content with cited, highlighted passages
  - *Systems*: token-bucket rate limiter simulator with a live chart and burst traffic
  - *Android*: offline-first sync mock (phone UI, local queue, idempotent replay, server log)
- Experience timeline, Skills toolbox, "How I work" principles, Education & certifications
- `resume.html`: a printable résumé generated from the same data, plus `assets/resume.pdf`
- Contact form that opens the visitor's email app (no backend needed)
- Light/dark theme (follows the OS, with a toggle that's remembered), responsive down to 320px
- Accessible: semantic markup, keyboard navigation, skip link, reduced-motion support, print styles

## Structure
```
index.html          page layout
css/style.css       all styling (colors are tokens at the top)
resume.html         printable résumé (rendered from data.js)
js/data.js          ← ALL CONTENT LIVES HERE
js/main.js          rendering + interactions
js/demos.js         the three live demos
assets/favicon.svg
assets/resume.pdf   generated from resume.html (see below)
```

## Make it yours
1. Open `js/data.js` and replace the persona: name, email, links, stats, projects, companies and
   education. Keep the structure, since every field is already used by the page.
2. Regenerate the PDF résumé after editing (or open `resume.html` and use Print → Save as PDF):
   ```bash
   google-chrome --headless --no-pdf-header-footer --print-to-pdf=assets/resume.pdf resume.html
   ```
3. For each project, use the pattern **problem → what you built → measurable impact**. Recruiters skim
   for numbers (latency, cost, users, revenue, time saved).
4. Add `links.live` / `links.code` to projects when you can share a demo or repo.
5. To change the brand colors, edit `--primary` and `--accent` in `css/style.css`.

## Run locally
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy (free)
- **GitHub Pages**: push to a repo, then Settings → Pages → deploy from `main` / root.
- **Netlify / Vercel / Cloudflare Pages**: drag and drop the folder, or connect the repo (no build command, output dir `/`).
- Point a custom domain such as `yourname.dev` at it for a more professional look.

## Optional: real form submissions
To receive messages without the visitor's mail app, point the form at a service such as Formspree:
set `action="https://formspree.io/f/<id>" method="POST"` on `#contactForm` and remove the submit handler in `main.js`.
