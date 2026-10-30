---
title: WebDAV
description: Browse and mount the infinidysk 2.x library over WebDAV, and run without FUSE.
---

WebDAV serves the same tree as the mount, at the root of port 3000: `http://infinidysk:3000/`. See [the mount layout](/v2/reference/paths/#mount-layout).

## Login

WebDAV uses basic authentication with the **Username** and **Password** under Settings > Platform > WebDAV > Connection. The username is `admin` by default and the password is empty. Set a password before anything outside your network can reach port 3000.

Media is read-only. You can add an NZB to the queue by uploading it to `/nzbs/<category>/`, and remove a queued NZB by deleting it there. Completed downloads show as `.rclonelink` files, so rclone can present them as symlinks.

## Playback links

Playback links in `.strm` files use `/view/…` with a signed token or the **Download key** under Settings > Platform > WebDAV > Download links, so players do not need the WebDAV login.

## Without FUSE

If the container cannot get `/dev/fuse`, 2.x logs a warning and serves WebDAV only. Mount it with rclone pointed at `http://infinidysk:3000/`. 2.x does not send rclone refresh notifications, so keep `--dir-cache-time` short.
