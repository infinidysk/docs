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

If the container cannot get `/dev/fuse`, 2.x logs a warning and serves WebDAV only. Mount it with rclone pointed at `http://infinidysk:3000/`. Unless you turn on [rclone notifications](#tell-rclone-about-changes), keep `--dir-cache-time` short.

If you do not use the built-in mount, turn off **Built-in FUSE mount** under Settings > Platform > Mount, or set `INFINIDYSK__MOUNT__FUSE: "false"`, and restart. 2.x then skips the mount and its warnings, and leaves anything mounted at the mount directory alone, such as an rclone mount. Keep **Directory** set to where that mount is, as the Arrs see it, so symlinks still point at it.

### Tell rclone about changes

2.x can tell the rclone mount which folders changed, so new downloads and removed files show before rclone's directory cache expires. Before it tells an Arr that a download finished, it asks rclone to forget the listings that changed, so the Arr finds the files at once.

This is off by default. It works for one rclone mount of the WebDAV **root** (`http://infinidysk:3000/`), not of a subfolder.

1. Start the mount with `--rc` and `--links`, so the RC server runs and completed downloads show as symlinks. Protect the RC server with `--rc-user` and `--rc-pass`, and serve it over HTTPS or keep it on loopback or a private tunnel. Never expose an unauthenticated RC server.
2. The RC server must be reachable **from infinidysk**. rclone does not connect to infinidysk.
3. If rclone serves more than one mount, run `rclone rc vfs/list` to find the name of this one, such as `infinidysk:`.
4. Under Settings > Platform > WebDAV > Remote rclone mount, turn on **Notify rclone of directory changes**. Enter the **RC URL**, the **VFS name** if you found one, and the RC username and password. Restart.

On start, 2.x asks rclone to forget every top folder once, to cover changes made while it was down. If the RC server cannot be reached, 2.x logs one warning, does not hold up imports or the Arrs, and catches up with the next change. Keep `--dir-cache-time` finite (one hour is fine) so a missed notification still expires.
