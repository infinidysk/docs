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

| Setting | What it does |
|---|---|
| WebDAV User<br/>`webdav.user` | Username accepted by WebDAV clients. Default `admin` / `WEBDAV_USER`. |
| WebDAV Password<br/>`webdav.pass` | Password required by rclone and other clients. Default env `WEBDAV_PASSWORD`. |

Use these credentials in rclone, Plex integrations, direct WebDAV clients, and
other applications that mount or read infinidysk.

## Filesystem & Explorer {#filesystem-explorer}

| Setting | What it does |
|---|---|
| Enforce Read-Only<br/>`webdav.enforce-readonly` | Make `/content` read-only and block clearing completed history by deleting release folders under `/completed-symlinks`. Symlink deletes needed for Arr imports are always allowed. Default on. |
| Sanitize paths for Windows<br/>`webdav.windows-safe-paths` | Replace Windows-invalid characters on newly mounted content. Default on. |
| Show hidden files on Dav Explorer<br/>`webdav.show-hidden-files` | Show dot-prefixed names in Dav Explorer. Default off. |
| Preview par2 files on Dav Explorer<br/>`webdav.preview-par2-files` | Render PAR2 file descriptors as text in Dav Explorer. Default off. |

[Mounting WebDAV](/v1/guides/mounting-webdav/) ·
[Streaming settings](/v1/configuration/streaming/) ·
[WebDAV filesystem](/v1/features/webdav-filesystem/)
