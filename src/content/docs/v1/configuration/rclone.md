---
title: "Rclone server"
---
Notify rclone RC when WebDAV files change (useful with high `dir-cache-time`).

:::tip[Headless ENV]
Map config keys below to `NZBDAV_CONFIG__...` with the
[naming algorithm](/v1/configuration/headless/#naming-algorithm)
(`rclone.host` → `NZBDAV_CONFIG__RCLONE__HOST`).
:::

| Setting | What it does |
|---|---|
| Enable Rclone RC Server Notifications<br/>`rclone.rc-enabled` | Sends `vfs/forget` on add/remove. Default off. |
| Rclone Server Host<br/>`rclone.host` | Service name and RC port, e.g. `http://nzbdav_rclone:5572`. Loopback works only when rclone shares infinidysk's network namespace. Default empty. |
| Rclone Server User<br/>`rclone.user` | Optional. Default empty. |
| Rclone Server Password<br/>`rclone.pass` | Optional. Default empty. |

**Test Conn** (next to the host field) validates RC reachability, credentials, and a successful
API response (`POST core/version`). It works with an already-saved (masked) password; you do
not need to re-enter it after reload. Failures show a reason (authentication, HTTP status, or
network error). Password may be left empty when the RC server has no auth.

Mount directory for symlink imports is configured on the [SABnzbd](/v1/configuration/sabnzbd/) tab (`rclone.mount-dir`).

[Mounting WebDAV](/v1/guides/mounting-webdav/)
