# Ragavan Durairaj — Digital Portfolio

A single-page, animated portfolio built as plain HTML/CSS/JS (no build step, no dependencies).

## Files
- `index.html` — content and structure
- `style.css` — design system (dark "observability dashboard" theme)
- `script.js` — animations: canvas network background, typing effects, animated metrics/graph, scroll reveals, project filtering, certification validity bars

## Deploy to GitHub Pages

**Option A — new repo, root deploy (simplest):**
1. Create a new GitHub repo, e.g. `ragavan-portfolio`.
2. Upload `index.html`, `style.css`, and `script.js` to the repo root (drag-and-drop on GitHub, or `git push`).
3. Go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Branch: `main`, folder: `/ (root)`. Save.
6. Wait ~1 minute, then your site is live at:
   `https://<your-username>.github.io/ragavan-portfolio/`

**Option B — using git from the command line:**
```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
Then enable Pages as in steps 3–5 above.

**Option C — user/organization site:** name the repo `<your-username>.github.io` and it will be served at `https://<your-username>.github.io/` with no sub-path.

## Custom domain (optional)
In **Settings → Pages → Custom domain**, add your domain and follow GitHub's DNS instructions (a `CNAME` file will be added automatically).

## Editing content later
All text lives directly in `index.html` — search for the relevant section (`id="about"`, `id="experience"`, `id="genai"`, etc.) and edit in place. No rebuild needed; just commit and push.
