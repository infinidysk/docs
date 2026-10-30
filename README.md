# infinidysk documentation

Source for [www.infinidysk.com](https://www.infinidysk.com/), built with [Starlight](https://starlight.astro.build/). Application code lives in [infinidysk/infinidysk](https://github.com/infinidysk/infinidysk).

## Local preview

Requires Node 24.

```bash
npm ci
npm run dev
```

Pages live under `src/content/docs/`; the sidebar is in `astro.config.mjs` and the theme in `src/styles/custom.css`. Link to other pages with absolute paths (`/configuration/webdav/#section`); `npm run build` fails on broken links and anchors. `main` deploys to Cloudflare Workers via `.github/workflows/docs.yml`. Pull requests from branches in this repo get a preview at `https://pr-<number>.preview.infinidysk.com/`, removed when the PR closes; fork PRs build without a preview. Moved pages get a 301 in `public/_redirects`.

Never write media titles (movie, show, episode, album, book, or release names) in docs, commits, or PRs; describe content generically.
