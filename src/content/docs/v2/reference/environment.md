---
title: Environment variables
description: Every environment variable infinidysk 2.x reads, including the INFINIDYSK__ variables that set any setting from Docker Compose.
---

:::caution[Subject to change during the beta]
2.x is in beta. Variable names, value formats and defaults on this page may change between beta releases without a migration. Check this page when you update the image.
:::

There are two kinds of variables:

- **Startup variables** (`INFINIDYSK_LISTEN`, `PUID`, …) are read once when the process starts. They are not settings and cannot be changed in the UI.
- **Setting variables** (`INFINIDYSK__<SECTION>__<KEY>`, with two underscores) force one setting. Use them to manage settings from a Compose file instead of the UI.

## Startup variables

| Variable | Default | What it does |
|----------|---------|--------------|
| `INFINIDYSK_LISTEN` | `0.0.0.0:3000` | Address for the UI, the SABnzbd API and WebDAV. The health check asks the same address. |
| `INFINIDYSK_DATABASE_URL` | `sqlite:/config/infinidysk.sqlite` | Database. Use `postgres://…` for PostgreSQL. Wins over `/config/database.toml` and turns off the move under Settings > System > Database; see [Move to PostgreSQL](/v2/operate/postgresql/#use-infinidysk_database_url-instead). |
| `PUID` / `PGID` | `1000` | Owner shown on files in the mount. |
| `TZ` | UTC | Time zone for the maintenance window and file dates. |
| `RUST_LOG` | `info` | Log filter. See [Logs and traces](/v2/operate/logs-traces/). |
| `INFINIDYSK_LOG_DIR` | `logs` beside the SQLite database, else `/config/logs` | Where log files are written. |
| `INFINIDYSK_METRICS_PATH` | `metrics.sqlite` beside the SQLite database, else `/config/metrics.sqlite` | The metrics store. Always its own SQLite file, also with PostgreSQL. |
| `INFINIDYSK_FFPROBE` | `ffprobe` | ffprobe binary for media analysis. The image includes it. Without it, analysis is off. |
| `INFINIDYSK_TRACE_MINUTES` | `0` | Traces every file opened in the first this many minutes after start. For bug reports. |
| `INFINIDYSK_EXPERIMENTS` | empty | Comma list of [experiments](#experiments) to switch on, on top of the `experiments` setting. |
| `SQLITE_TMPDIR` / `TMPDIR` | `/var/tmp` | Where SQLite writes its temporary copy when the database is compacted. Needs free space the size of the database. |
| `DATABASE_PROVIDER` / `DATABASE_CONNECTION_STRING` | unset | Only for the [upgrade from 1.x on PostgreSQL](/v2/upgrade/postgresql/): set them as 1.x had them. The import reads the 1.x database with them; remove them once it is done. Also honors the `PG…` variables 1.x's driver read, such as `PGPASSWORD` and `PGPASSFILE`. |

## Setting variables

### Naming

Take the setting path from the [tables below](#all-settings), then:

1. Replace every `.` with `__` (two underscores).
2. Uppercase it.
3. Put `INFINIDYSK__` in front.

| Setting | Environment variable |
|---------|----------------------|
| `mount.dir` | `INFINIDYSK__MOUNT__DIR` |
| `performance.read_ahead_mb` | `INFINIDYSK__PERFORMANCE__READ_AHEAD_MB` |
| `maintenance.window.start` | `INFINIDYSK__MAINTENANCE__WINDOW__START` |
| `providers` | `INFINIDYSK__PROVIDERS` |

### Values

- **Text settings** take the value as written. A numeric password stays text.
- **Numbers and switches** take a plain value: `60`, `true`, `false`.
- **Lists and objects** take JSON: `'["tv","movies"]'`. Quote the whole value in YAML. A comma list such as `tv,movies` is not a list and stops startup.
- **Lists replace, they do not merge.** `INFINIDYSK__PROVIDERS` is the whole provider list. You cannot set one field of one provider.

### Precedence

```
INFINIDYSK__… environment variables
  > settings saved in the UI (the database)
  > built-in defaults
```

- A forced setting shows in the UI as **Set by environment** and cannot be changed there.
- Forced values are never written to the database. Remove the variable and restart, and the saved value (or the default) comes back.
- Changing a variable needs a container restart or recreate.

### Validation

- An unknown `INFINIDYSK__…` name logs a warning and is ignored. Check the log after a change for a typo.
- A number outside its range logs a warning and uses the default.
- Any other bad value stops startup with an error that names the setting: a relative path, an unknown choice, text where a number belongs, or a list that is not JSON.
- Secrets are never logged.

### Secrets

The SABnzbd API key, admin API key, session key, WebDAV password, WebDAV download key and STRM key are generated on first start when empty. Set them with variables only if another tool must know them in advance.

:::danger
Resolved secrets are visible to anyone who can run `docker inspect` on the container. Keep them in an uncommitted `.env` file or your orchestrator's secret store. Never paste them into issues or logs.
:::

## All settings

Each table lists the setting path, its default and what it takes.

### SABnzbd API (`sab`)

| Setting | Default | Values |
|---------|---------|--------|
| `sab.api_key` | generated | Text. The key Arrs use as the download client. |
| `sab.categories` | `["audio","software","tv","movies"]` | JSON list of category names. |
| `sab.manual_category` | `uncategorized` | Category for NZBs sent without one, or with `*`. |

### Sign-in (`auth`)

| Setting | Default | Values |
|---------|---------|--------|
| `auth.mode` | `required` | `required`, `local` (clients on private addresses skip sign-in) or `disabled`. |
| `auth.api_key` | generated | Text. `X-Api-Key` for scripts calling the admin API. Separate from the SAB key. |
| `auth.session_key` | generated | Text. Signs UI session cookies. Changing it signs everyone out. |
| `auth.local_login` | `true` | `true` or `false`. `false` allows only SSO; it can be turned off in the UI only after an SSO sign-in has worked. Set `true` to get back in when the identity provider is down. |
| `auth.oidc.issuer` | empty | Text. Issuer URL exactly as the provider publishes it. Empty turns SSO off. |
| `auth.oidc.client_id` | empty | Text. |
| `auth.oidc.client_secret` | empty | Text. |
| `auth.oidc.redirect_uri` | empty | Text. Empty means the public URL, else the address the browser used, plus `/auth/oidc/callback`. |
| `auth.oidc.scopes` | `openid profile email` | Space-separated. `openid` is always sent. |
| `auth.oidc.username_claim` | `preferred_username` | ID-token claim shown as the username. |

See [Single sign-on](/v2/operate/sso/) for the `auth.oidc` and `auth.local_login` settings.

The admin account itself is created in the UI and has no variable.

### WebDAV (`webdav`)

| Setting | Default | Values |
|---------|---------|--------|
| `webdav.user` | `admin` | Text, not empty. |
| `webdav.password` | generated | Text. |
| `webdav.download_key` | generated | Text. The `downloadKey` that `/view` links must carry. |

### Mount (`mount`)

| Setting | Default | Values |
|---------|---------|--------|
| `mount.dir` | `/mnt/infinidysk` | Absolute path. Where the library is mounted, as the Arrs see it. |
| `mount.epoch_times` | `false` | `true` shows 1970 dates on media files, like an rclone mount with `--no-modtime`. See [Move off rclone](/v2/upgrade/rclone/). |

### Performance (`performance`)

`performance.preset` sets every other value in this table. Set one of the others to override only that value.

| Setting | Default | Values |
|---------|---------|--------|
| `performance.preset` | `balanced` | `balanced`, `max_playback` or `low_resources`. |
| `performance.read_ahead_mb` | from preset | 1–1250. MB each open file fetches ahead of the reader. |
| `performance.read_ahead_memory_mb` | from preset | 64–65536. MB all open files together may hold in flight. |
| `performance.memory_cache_enabled` | `true` | `true` or `false`. |
| `performance.memory_cache_mb` | from preset | 16–65536. |
| `performance.disk_cache_enabled` | `false` | `true` or `false`. |
| `performance.disk_cache_dir` | `/config/cache` | Absolute path outside the mount. |
| `performance.disk_cache_gb` | `25` | 1–100000. |
| `performance.disk_cache_max_age_hours` | `168` | 1–8760. |
| `performance.fuse_max_readahead_kb` | from preset | 128–65536. |
| `performance.fuse_max_background` | from preset | 1–1024. |

| Preset | Read-ahead MB | Read-ahead memory MB | Memory cache MB | FUSE readahead KB | FUSE background |
|--------|---------------|----------------------|-----------------|-------------------|-----------------|
| `balanced` | 60 | 600 | 600 | 5000 | 64 |
| `max_playback` | 150 | 2000 | 1250 | 10000 | 128 |
| `low_resources` | 20 | 100 | 150 | 1250 | 32 |

### Network (`network`)

| Setting | Default | Values |
|---------|---------|--------|
| `network.public_url` | empty | `http://` or `https://` address Arrs and media servers use. Required for STRM. See [Reverse proxy](/v2/operate/reverse-proxy/#public-url). |
| `network.trusted_proxies` | every loopback, private and link-local range | JSON list of addresses or CIDR ranges whose `X-Forwarded-For` header is trusted. |
| `network.download_limit_mb_per_s` | no limit | 1–12500. One cap in MB/s on downloads from all providers together. Serving files is not limited. |

### Providers (`providers`)

`INFINIDYSK__PROVIDERS` is a JSON list. Each provider takes these fields:

| Field | Default | Values |
|-------|---------|--------|
| `id` | new at every start | A UUID. Set a fixed one, so provider stats and quota usage survive restarts. |
| `name` | profile name or hostname | Text. |
| `profile` | none | Catalog profile id, the file name in [`providers/`](https://github.com/infinidysk/infinidysk/tree/main/providers) without `.toml` (for example `newshosting`). The port and backbone come from the profile. |
| `hostname` | profile's first server | With a profile: one of its servers. Without one: required. |
| `port` | `563` | Ignored with a profile. |
| `tls` | `true` | `true` or `false`. |
| `username` | empty | Text. |
| `password` | empty | Text. |
| `max_connections` | `10` | 1–65535. |
| `pipeline_depth` | `4` | 1–16. Requests in flight per connection. |
| `priority` | `0` | Providers with the same number form one pool. Higher numbers are asked only after lower ones miss. |
| `backbone` | none | Without a profile: a backbone id from [`providers/backbones.toml`](https://github.com/infinidysk/infinidysk/blob/main/providers/backbones.toml). Without one, the provider is its own group. |
| `quota` | none | `{"gb": 500, "period": "monthly", "reset_day": 1}` or `{"gb": 500, "period": "block"}`. Decimal GB. |
| `enabled` | `true` | `true` or `false`. |

### Arr instances (`arr_instances`, `arr`)

`INFINIDYSK__ARR_INSTANCES` is a JSON list. Each instance takes these fields:

| Field | Default | Values |
|-------|---------|--------|
| `id` | new at every start | A UUID. Set a fixed one. |
| `name` | required | Text, not empty. |
| `profile` | required | `sonarr`, `radarr`, `lidarr`, `readarr`, `whisparr` or `sportarr`. |
| `url` | required | `http://` or `https://` address. |
| `api_key` | required | Text. |
| `enabled` | `true` | `true` or `false`. |

| Setting | Default | Values |
|---------|---------|--------|
| `arr.queue_management` | `true` | Clears downloads whose import is stuck for a known reason from the Arr queues. |

### Imports (`imports`)

| Setting | Default | Values |
|---------|---------|--------|
| `imports.strategy` | `symlinks` | `symlinks` or `strm`. See [Choose an import strategy](/v2/install/import-strategy/). |
| `imports.strm_dir` | `/data/completed-downloads` | Absolute path. Where STRM files are written for the Arrs to import. |
| `imports.strm_key` | generated | Text. Signs STRM playback links. |
| `imports.library_dirs` | `[]` | JSON list of `{"path": "/data/media", "arr_path": "/media"}`. Leave `arr_path` out when the Arrs see the same path. See [Library folders](/v2/operate/library-folders/). |

### Queue (`queue`)

| Setting | Default | Values |
|---------|---------|--------|
| `queue.concurrency` | `2` | 1–10. Imports at once. |
| `queue.extra_blocklist` | `[]` | JSON list of file name globs (`*`, `?`) dropped from imports, on top of the built-in list. |
| `queue.nzb_retention_days` | `30` | 0–3650. Days an unused NZB is kept. `0` deletes it at once. |

### Health (`health`)

See [Health checks and repair](/v2/how-it-works/health/#settings) for what each does.

| Setting | Default | Values |
|---------|---------|--------|
| `health.enabled` | `true` | `true` or `false`. |
| `health.check_percent` | `5` | 5–100. Share of segments each check probes. |
| `health.auto_repair` | `true` | `true` or `false`. |
| `health.degraded_tolerance` | `true` | `true` or `false`. |
| `health.unowned_action` | `delete` | `delete` or `action_needed`. |
| `health.media_probe` | `true` | `true` or `false`. |

### Maintenance (`maintenance`)

See [Maintenance](/v2/operate/maintenance/).

| Setting | Default | Values |
|---------|---------|--------|
| `maintenance.window.start` | `03:00` | `HH:MM` in `TZ`. |
| `maintenance.window.end` | `06:00` | `HH:MM` in `TZ`. An end at or before the start ends the next day. |
| `maintenance.scheduled` | `["remove-dead-links"]` | JSON list of `remove-dead-links` and `remove-unlinked`. Database compaction always runs. |

### Metrics (`metrics`)

| Setting | Default | Values |
|---------|---------|--------|
| `metrics.prometheus` | `false` | `true` serves `/metrics` behind the admin API key. |

### Experiments

| Setting | Default | Values |
|---------|---------|--------|
| `experiments` | `[]` | JSON list of experiment names. Unknown names are dropped. |

Current experiments, which may be removed or become defaults in any release:

| Name | What it does |
|------|--------------|
| `win-floor` | Files posted in articles of 2.1 MB or more may keep two articles per connection in flight. |
| `weight-large` | Articles of 2.1 MB or more count as a full connection's pipeline. |

## Compose example

Secrets use `${VAR:?message}`, so Compose refuses to start when one is missing. Put the values in an uncommitted `.env` file.

```yaml
services:
  infinidysk:
    image: ghcr.io/infinidysk/infinidysk-next:edge
    container_name: infinidysk
    restart: unless-stopped
    environment:
      # Startup variables
      PUID: 1000
      PGID: 1000
      TZ: Etc/UTC

      # Settings
      INFINIDYSK__SAB__API_KEY: ${SAB_API_KEY:?set SAB_API_KEY}
      INFINIDYSK__SAB__CATEGORIES: '["tv","movies"]'
      INFINIDYSK__MOUNT__DIR: /mnt/infinidysk
      INFINIDYSK__NETWORK__PUBLIC_URL: https://infinidysk.example.com
      INFINIDYSK__PERFORMANCE__PRESET: balanced
      INFINIDYSK__IMPORTS__LIBRARY_DIRS: '[{"path":"/mnt/media"}]'
      INFINIDYSK__PROVIDERS: >-
        [{"id":"0190f6c4-0000-7000-8000-000000000001",
        "profile":"newshosting",
        "username":"${USENET_USER:?set USENET_USER}",
        "password":"${USENET_PASS:?set USENET_PASS}",
        "max_connections":50,"priority":0}]
      INFINIDYSK__ARR_INSTANCES: >-
        [{"id":"0190f6c4-0000-7000-8000-000000000002",
        "name":"Sonarr","profile":"sonarr","url":"http://sonarr:8989",
        "api_key":"${SONARR_API_KEY:?set SONARR_API_KEY}"}]
    ports:
      - "3000:3000"
    volumes:
      - ./config:/config
      - /mnt:/mnt:rshared
      - /sys/devices/virtual/bdi:/sys/devices/virtual/bdi:rw
    devices:
      - /dev/fuse:/dev/fuse
    cap_add:
      - SYS_ADMIN
    security_opt:
      - apparmor:unconfined
```

## Upgrading from 1.x

1.x `NZBDAV_CONFIG__…` variables and its older fallbacks (`WEBDAV_USER`, `MOUNT_DIR`, …) are read once, by the [upgrade](/v2/upgrade/) on the first start. The values they hold are imported into the database like any other 1.x setting. After that, 2.x ignores them. To keep a setting managed by Compose, rename it to its `INFINIDYSK__…` name.
