---
title: "First run"
description: "Create the admin account, then use the setup guide or the manual Settings steps."
---
Open `http://your-server:3000` once the container is healthy.

## Create the admin account

Set the username and password for the web UI. Behind HTTPS, harden session cookies with `SECURE_COOKIES=true`.

The admin account is not part of the [`NZBDAV_CONFIG__...`](/v1/configuration/headless/) variables; those only pre-seed Settings. If you lose the password, see [Locked out of the web UI](/v1/guides/troubleshooting/#locked-out-of-the-web-ui).

## Run the setup guide

On a new install, infinidysk opens the [setup guide](/v1/getting-started/setup-guide/) <span class="since">since 1.3.0</span> after the first sign-in. It covers import strategy, cache, rclone or STRM paths, Arr apps, backups and the library directory. You can skip it and open it later from the main navigation.

## Or configure by hand

Skip steps for settings you already supply through headless variables.

1. **Settings → Usenet**: add a provider with its host, port (usually `563` with SSL), credentials and a **Provider Connection Limit** at or below your account allowance. Use **Test**. See [Usenet settings](/v1/configuration/usenet/).
2. **Settings → WebDAV**: set the WebDAV user and password. rclone and most players need them. See [WebDAV settings](/v1/configuration/webdav/).
3. **Settings → SABnzbd**: pick the import strategy and copy the **API Key** for your Arr apps.
   - **Symlinks** (Plex): set **Rclone Mount Directory**, for example `/mnt/remote/nzbdav`, and run the [rclone sidecar](/v1/guides/mounting-webdav/).
   - **STRM** (Emby, Jellyfin): set **Completed Downloads Dir** and a **Base URL** the media server can reach.
4. **Settings → Streaming**: the defaults are a safe start. Tune them only if playback stalls. See [Streaming settings](/v1/configuration/streaming/).

## Smoke test

1. Upload a small `.nzb` on the **Queue** page.
2. Wait until it reaches history and shows under Explore → `content`.
3. Open a video file to confirm it streams.

Overview **Active Reads** lists every WebDAV byte fetch. Sustained traffic with nobody watching usually means rclone cache churn or media-server analysis.

## Next

- [Connect Arr instances](/v1/getting-started/connect-arr/)
- [Import strategies](/v1/guides/import-strategies/)
- [Settings overview](/v1/configuration/)
