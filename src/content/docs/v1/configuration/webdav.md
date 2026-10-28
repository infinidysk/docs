---
title: "WebDAV"
---
WebDAV settings contain client credentials and filesystem presentation. Tune
playback connections, buffering, caching, and retries under
[Streaming](/v1/configuration/streaming/).

:::tip[Headless ENV]
Map config keys below to `NZBDAV_CONFIG__...` with the
[naming algorithm](/v1/configuration/headless/#naming-algorithm)
(`webdav.pass` → `NZBDAV_CONFIG__WEBDAV__PASS`).
:::

## Access

| Control | Config key | Default | Effect |
|---------|------------|---------|--------|
| WebDAV User | `webdav.user` | `admin` / `WEBDAV_USER` | Username accepted by WebDAV clients |
| WebDAV Password | `webdav.pass` | env `WEBDAV_PASSWORD` | Password required by rclone and other clients |

Use these credentials in rclone, Plex integrations, direct WebDAV clients, and
other applications that mount or read infinidysk.

## Filesystem and Explorer {#filesystem-explorer}

| Control | Config key | Default | Effect |
|---------|------------|---------|--------|
| Enforce Read-Only | `webdav.enforce-readonly` | on | Make `/content` read-only |
| Sanitize paths for Windows | `webdav.windows-safe-paths` | on | Replace Windows-invalid characters on newly mounted content |
| Show hidden files | `webdav.show-hidden-files` | off | Show dot-prefixed names in Files |
| Preview par2 files | `webdav.preview-par2-files` | off | Render PAR2 file descriptors as text in Files |

[Mounting WebDAV](/v1/guides/mounting-webdav/) ·
[Streaming settings](/v1/configuration/streaming/) ·
[WebDAV filesystem](/v1/features/webdav-filesystem/)
