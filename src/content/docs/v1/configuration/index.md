---
title: "Configuration"
description: "Configure infinidysk (NzbDAV SuperFork): Usenet providers, indexers, streaming, WebDAV, queue processing, and Arr integration."
---

Day-to-day settings live in the admin UI (**Settings**) and persist in SQLite under `/config`. Use this section as a walkthrough of every Settings tab.

For **authoritative headless** configuration of those same Settings keys via `NZBDAV_CONFIG__...`, see **[Headless environment configuration](/v1/configuration/headless/)** <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.9.0">since 0.9.0</a>. Process wiring and legacy fallbacks remain on **[Environment variables](/v1/configuration/environment-variables/)**.

:::note[Docs track latest]
Settings marked <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.8.0">since 0.8.0</a> (or another version) were introduced in that release. Older images will not show those controls.
:::

## Settings hub

- **Providers & search** — [Usenet](/v1/configuration/usenet/) · [Indexers](/v1/configuration/indexers/) · [Search profiles](/v1/configuration/profiles/)
- **Queue & import** — [Queue](/v1/configuration/queue/) · [SABnzbd](/v1/configuration/sabnzbd/)
- **Playback & files** — [Streaming](/v1/configuration/streaming/) · [WebDAV](/v1/configuration/webdav/)
- **Automation** — [Watchdog](/v1/configuration/watchdog/) · [Preflight](/v1/configuration/preflight/) · [Watchtower](/v1/configuration/watchtower/) · [Warden](/v1/configuration/warden/)
- **Integrations** — [Arr Apps](/v1/configuration/arrs/) · [Rclone](/v1/configuration/rclone/)
- **System** — [Health & repairs](/v1/configuration/repairs/) · [Maintenance](/v1/configuration/maintenance/) · [Backup](/v1/configuration/backup/) · [Support](/v1/configuration/support/) · [Migration (experimental)](/v1/guides/altmount-migration/) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.10.0">since 0.10.0</a>
- **Headless / ops** — [OIDC / SSO](/v1/configuration/oidc/) · [Headless ENV config](/v1/configuration/headless/) · [Environment variables](/v1/configuration/environment-variables/)

:::tip[Config vs env]
Most tunables are UI/`ConfigItems` keys. Map any documented config key to `NZBDAV_CONFIG__...` with the [naming rule](/v1/configuration/headless/#naming-algorithm) for authoritative headless setup. Separate domains (frontend admin account, Warden `warden.db`, restore actions) are not part of that overlay — see [headless out of scope](/v1/configuration/headless/#what-is-out-of-scope-v09). Process variables (`CONFIG_PATH`, ports, auth cookies) and legacy Settings fallbacks stay on [environment variables](/v1/configuration/environment-variables/).
:::
