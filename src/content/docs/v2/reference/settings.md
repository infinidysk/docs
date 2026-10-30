---
title: Settings and environment variables
description: How infinidysk 2.x stores settings, how to force one with an environment variable, and the startup variables.
---

Settings live in the database and are edited in the UI. Any setting can also be forced with an environment variable named `INFINIDYSK__<SECTION>__<KEY>`, for example:

```yaml
environment:
  INFINIDYSK__MOUNT__DIR: /mnt/remote/infinidysk
```

Forced values show in the UI but are not written back to the database.

## Startup variables

These are read once at startup and are not settings.

| Variable | What it does |
|----------|--------------|
| `INFINIDYSK_LISTEN` | Address for the UI, the SABnzbd API and WebDAV. Default `0.0.0.0:3000`. |
| `INFINIDYSK_DATABASE_URL` | Database. Default `sqlite:/config/infinidysk.sqlite`; use `postgres://…` for PostgreSQL. |
| `PUID` / `PGID` | Owner shown on files in the mount. Default `1000`. |
| `TZ` | Time zone for the maintenance window and file dates. Default UTC. |
| `INFINIDYSK_LOG_DIR` | Where log files are written. Default `/config/logs`. |
| `RUST_LOG` | Log filter. Default `info`. See [Logs and traces](/v2/operate/logs-traces/). |
| `INFINIDYSK_FFPROBE` | ffprobe binary for media analysis. Default `ffprobe`; the image includes it, and without it analysis is off. |

## Useful settings

| Setting | What it does |
|---------|--------------|
| Mount directory<br/>`mount.dir` | Settings > Platform > Mount. `/mnt/infinidysk` by default. Read at startup. |
| Disable file timestamps<br/>`mount.epoch_times` | Settings > Platform > Mount. For libraries moved off an rclone mount that used `--no-modtime`; see [Move off rclone](/v2/upgrade/rclone/). |
| Performance preset<br/>`performance.preset` | Settings > Platform > Performance. Read-ahead, memory cache and optional disk cache. |
| Download speed limit<br/>`network.download_limit_mb_per_s` | Settings > Platform > Performance. One cap on the combined download speed from all providers, in MB/s. Serving files to players is not limited. |
| Import strategy<br/>`imports.strategy` | Settings > Automation > Library. `symlinks` or `strm`; see [Choose an import strategy](/v2/install/import-strategy/). |
| Library folders<br/>`imports.library_dirs` | Settings > Automation > Library. See [Library folders](/v2/operate/library-folders/). |
| Imports at once<br/>`queue.concurrency` | Settings > Automation > Imports. 1–10, default 2. |
| Keep unused NZBs<br/>`queue.nzb_retention_days` | Settings > Automation > Imports. Days an unused NZB is kept, default 30. |
| Public URL<br/>`network.public_url` | Settings > System > Network. The address Arrs and media servers use; see [Reverse proxy](/v2/operate/reverse-proxy/#public-url). |
| Trusted proxies<br/>`network.trusted_proxies` | Settings > System > Network. Proxies whose `X-Forwarded-For` header is trusted. |
| Prometheus metrics<br/>`metrics.prometheus` | Settings > System > Access. Serves `/metrics` behind the admin API key. |

Health settings are listed in [Health checks and repair](/v2/how-it-works/health/#settings).
