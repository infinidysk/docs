# InfiniDysk documentation

Source for [www.infinidysk.com](https://www.infinidysk.com/). Application code lives in [infinidysk/infinidysk](https://github.com/infinidysk/infinidysk).

## Local preview

```bash
pip install -r docs-requirements.txt
zensical serve
```

Pages live under `docs/`; navigation is in `zensical.toml`. `main` deploys to Cloudflare Workers via `.github/workflows/docs.yml` (`zensical build --clean --strict` must pass).

Never write media titles (movie, show, episode, album, book, or release names) in docs, commits, or PRs; describe content generically.
