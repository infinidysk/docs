---
title: "Settings overview"
description: "How infinidysk 1.x settings are organized, and how they map to headless environment variables."
---

Settings live in the admin UI under **Settings** and persist in SQLite under `/config`. The pages in this section follow the Settings tabs, grouped the same way as the UI:

- **System**: General (Base URL, see [Base URL and paths](/v1/configuration/url-base/)) · [Health & Repairs](/v1/configuration/repairs/) · [Maintenance](/v1/configuration/maintenance/) · [Backup & Restore](/v1/configuration/backup/) · [Support](/v1/configuration/support/) · Migration, see [Migrate from AltMount](/v1/guides/altmount-migration/)
- **Providers & Search**: [Usenet](/v1/configuration/usenet/) · [Indexers](/v1/configuration/indexers/) · [Search Profiles](/v1/configuration/profiles/)
- **Queue & Import**: [Queue](/v1/configuration/queue/) · [SABnzbd](/v1/configuration/sabnzbd/)
- **Playback & Files**: [Streaming](/v1/configuration/streaming/) · [WebDAV](/v1/configuration/webdav/)
- **Automation**: [Watchdog](/v1/configuration/watchdog/) · [Preflight](/v1/configuration/preflight/) · [Watchtower](/v1/configuration/watchtower/) · [Warden](/v1/configuration/warden/)
- **Integrations**: [Arr Apps](/v1/configuration/arrs/) · [Rclone Server](/v1/configuration/rclone/)

## Settings as environment variables

Settings keys can also be set with an `NZBDAV_CONFIG__...` variable <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.9.0">since 0.9.0</a>. A value set this way wins and shows as read-only in the UI. See [Headless configuration](/v1/configuration/headless/) for the [naming rule](/v1/configuration/headless/#naming-algorithm) and [what it does not cover](/v1/configuration/headless/#what-is-out-of-scope-v09) (the admin account, Warden sources, restores).

Process settings such as `CONFIG_PATH`, ports and cookie options are separate: see [Environment variables](/v1/configuration/environment-variables/). For single sign-on, see [OIDC](/v1/configuration/oidc/).
