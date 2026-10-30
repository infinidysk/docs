---
title: "Migrate from nzbdav-dev/nzbdav"
description: "Move an existing nzbdav-dev/nzbdav v0.6.4 install to infinidysk 1.x by swapping the image and keeping /config, then on to 2.x."
---
infinidysk is a fork of `nzbdav-dev/nzbdav` and upgrades a v0.6.4 install in place. Migrations keep your `/config` volume (SQLite settings, queue/history metadata, blobs) and swap the container image.

:::note[Already on ghcr.io/nzbdav/nzbdav?]
That image is already infinidysk 1.x under its former name, NzbDAV, so you do not need this page. [Switch the image](/v1/community/renaming-to-infinidysk/#how-do-i-switch) and keep everything else.
:::

:::caution[Back up first]
Always snapshot the host directory mapped to `/config` before changing images. Schema migrations apply automatically on startup and some are irreversible — see [Backups and upgrades](/v1/guides/backups-upgrades/).
:::

## From nzbdav-dev/nzbdav v0.6.4

infinidysk supports a direct upgrade from `nzbdav-dev/nzbdav` **v0.6.4**.

1. Stop the old container.
2. Back up `./config` (or whatever you mount at `/config`).
3. Point Compose (or `docker run`) at `ghcr.io/infinidysk/infinidysk:latest` (or a pinned release tag). Keep the same `/config` volume, `PUID`/`PGID`, and media path mounts.
4. Start the new container and wait for database maintenance / health to pass.
5. Confirm **Settings** (Usenet, WebDAV, SABnzbd API key), then spot-check queue/history and a WebDAV playback.

:::caution[Migrating behind a reverse proxy]
If you access infinidysk through a trusted reverse proxy, enable **Trust reverse-proxy headers** <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.4.0">since 1.4.0</a> under **Settings → General → Reverse proxy**, then click **Save**. The change applies without restarting.

If you cannot sign in to change the setting, set `TRUST_PROXY=1` in the infinidysk container environment. In Compose, add `TRUST_PROXY: "1"` to the service's `environment` mapping, then recreate the container and retry signing in. This environment override enables proxy-header trust and locks the Settings toggle while configured; it does not save an enabled value to Settings.

Enable this only behind a trusted proxy that sends correct `X-Forwarded-Host` and `X-Forwarded-Proto` headers. See [Reverse proxy](/v1/getting-started/docker/#reverse-proxy) for configuration details and the **Base URL** alternative.
:::

Arr download-client settings usually stay the same (host, port `3000`, API key) if networking is unchanged.

Installs older than `0.6.0` may hit larger schema migrations — take a full `/config` backup and prefer stepping through a known-good intermediate if you are far behind.

If an upgrade fails, restore the `/config` backup, start the previous image, and [file an issue](https://github.com/infinidysk/infinidysk/issues) with versions and migration log excerpts (redact secrets).

## Moving on to 2.x

2.x upgrades from infinidysk 1.x only, not from `nzbdav-dev/nzbdav` directly. Migrate to the latest 1.x first and start it once, then follow [Upgrade to 2.x](/v2/upgrade/).

## What usually carries over

- SQLite config / queue / history / mounted WebDAV tree metadata
- NZB blobs under `{CONFIG_PATH}/blobs/` (keep this directory with the DB)
- Categories, API key, and WebDAV user (re-enter password if prompted)

## What to re-verify

- Image tags and healthchecks in Compose
- Reverse proxy / `TRUST_PROXY` / `SECURE_COOKIES` / Base URL
- Rclone sidecar URL and WebDAV password
- New infinidysk-only features you want (Watchtower, Warden, pipelining) — enable deliberately after a stable migrate

## Related

- [Migrate from AltMount](/v1/guides/altmount-migration/) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.10.0">since 0.10.0</a>
- [Backups and upgrades](/v1/guides/backups-upgrades/)
- [First run](/v1/getting-started/first-run/)
