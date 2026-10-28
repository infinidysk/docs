---
title: "Configuration"
description: "Configure InfiniDysk (NzbDAV SuperFork): Usenet providers, indexers, streaming, WebDAV, queue processing, and Arr integration."
---

Day-to-day settings live in the admin UI (**Settings**) and persist in SQLite under `/config`. Use this section as a walkthrough of every Settings tab.

For **authoritative headless** configuration of those same Settings keys via `NZBDAV_CONFIG__...`, see **[Headless environment configuration](/configuration/headless/)** <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.9.0">since 0.9.0</a>. Process wiring and legacy fallbacks remain on **[Environment variables](/configuration/environment-variables/)**.

:::note[Docs track latest]
Settings marked <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.8.0">since 0.8.0</a> (or another version) were introduced in that release. Older images will not show those controls.
:::

## Settings hub

- **Providers & search** — [Usenet](/configuration/usenet/) · [Indexers](/configuration/indexers/) · [Search profiles](/configuration/profiles/)
- **Queue & import** — [Queue](/configuration/queue/) · [SABnzbd](/configuration/sabnzbd/)
- **Playback & files** — [Streaming](/configuration/streaming/) · [WebDAV](/configuration/webdav/)
- **Automation** — [Watchdog](/configuration/watchdog/) · [Preflight](/configuration/preflight/) · [Watchtower](/configuration/watchtower/) · [Warden](/configuration/warden/)
- **Integrations** — [Arr Apps](/configuration/arrs/) · [Rclone](/configuration/rclone/)
- **System** — [Health & repairs](/configuration/repairs/) · [Maintenance](/configuration/maintenance/) · [Backup](/configuration/backup/) · [Support](/configuration/support/) · [Migration (experimental)](/guides/altmount-migration/) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.10.0">since 0.10.0</a>
- **Headless / ops** — [OIDC / SSO](/configuration/oidc/) · [Headless ENV config](/configuration/headless/) · [Environment variables](/configuration/environment-variables/)

:::tip[Config vs env]
Most tunables are UI/`ConfigItems` keys. Map any documented config key to `NZBDAV_CONFIG__...` with the [naming rule](/configuration/headless/#naming-algorithm) for authoritative headless setup. Separate domains (frontend admin account, Warden `warden.db`, restore actions) are not part of that overlay — see [headless out of scope](/configuration/headless/#what-is-out-of-scope-v09). Process variables (`CONFIG_PATH`, ports, auth cookies) and legacy Settings *fallbacks* stay on [environment variables](/configuration/environment-variables/).
:::
