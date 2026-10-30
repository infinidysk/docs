---
title: Settings and environment
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

| Variable | Default | |
|----------|---------|---|
| `INFINIDYSK_LISTEN` | `0.0.0.0:3000` | Address for the UI, the SABnzbd API and WebDAV |
| `INFINIDYSK_DATABASE_URL` | `sqlite:/config/infinidysk.sqlite` | Use `postgres://…` for PostgreSQL |
| `PUID` / `PGID` | `1000` | Owner shown on files in the mount |
| `TZ` | UTC | Time zone for the maintenance window and file dates |
| `INFINIDYSK_LOG_DIR` | `/config/logs` | Where log files are written |
| `RUST_LOG` | `info` | Log filter |
| `INFINIDYSK_FFPROBE` | `ffprobe` | ffprobe binary for media analysis. The image includes it; without it, analysis is off. |

## Useful settings

| Setting | Key | Notes |
|---------|-----|-------|
| Mount directory | `mount.dir` | `/mnt/infinidysk` by default. Read at startup. |
| Disable file timestamps | `mount.epoch_times` | For libraries moved off an rclone mount that used `--no-modtime`. |
| Download limit | `network.download_limit_mb_per_s` | One cap on the combined download speed from all providers, in MB/s. Serving files to players is not limited. |
| Public URL | `network.public_url` | The address Arrs and browsers use, such as a reverse-proxy URL. |
| Trusted proxies | `network.trusted_proxies` | Proxies whose `X-Forwarded-For` header is trusted. |
| Import strategy | `imports.strategy` | `symlinks` or `strm`. See [Import strategies](/v2/guides/import-strategies/). |
| Jobs at once | `queue.concurrency` | 1–10, default 2. |
| NZB retention | `queue.nzb_retention_days` | Days an unused NZB is kept, default 30. |
| Performance preset | `performance.preset` | Read-ahead, memory cache and optional disk cache. |
| Prometheus | `metrics.prometheus` | Serves `/metrics` behind the admin API key. |

Health settings are listed in [Health checks and repair](/v2/guides/health/#settings).

## Who is reading

The Overview and Traces pages show who opened each read, for troubleshooting.

- **WebDAV** shows the user agent and address. Behind a reverse proxy, add the proxy to trusted proxies so the real client is shown.
- **FUSE** shows the process name, pid, uid and gid. A reader in another container or on the host shows as `pid unavailable`. Run infinidysk with `pid: host` to see those names; this lets the container see every process on the host.
