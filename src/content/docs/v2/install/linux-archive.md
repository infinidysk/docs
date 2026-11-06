---
title: Run from a Linux archive
description: Run infinidysk 2.x on Linux without Docker, from the archive attached to each release.
---

Each 2.x release has a Linux archive next to the container image. It holds the same binary as the image. Use it on a host without Docker, for example a Debian or Ubuntu LXC container on Proxmox.

This sets up a new 2.x install. Coming from 1.x? Read [Upgrade from 1.x](/v2/upgrade/) first.

:::caution
The built-in FUSE mount has not been tested outside Docker yet. [WebDAV](/v2/operate/webdav/) works without it.
:::

## Requirements

- Linux on x64 or arm64.
- glibc 2.39 or newer: Ubuntu 24.04 or newer, Debian 13 or newer. Debian 12 does not work.
- `fuse3` (it provides `fusermount3`) for the mount. In an LXC container the host must pass `/dev/fuse` in (on Proxmox: the container's FUSE feature). Without `/dev/fuse`, infinidysk logs a warning and serves WebDAV only; you can also [turn the mount off](/v2/operate/webdav/#without-fuse).
- `ffmpeg` (it provides `ffprobe`) for media analysis. If `ffprobe` is not on `PATH`, set `INFINIDYSK_FFPROBE`.
- CA certificates.

On Debian and Ubuntu: `apt install ca-certificates ffmpeg fuse3`.

## Download and check

1. Download `infinidysk-<tag>-linux-x64.tar.gz` or `infinidysk-<tag>-linux-arm64.tar.gz` from the [newest 2.x release](https://github.com/infinidysk/infinidysk/releases?q=tag%3Av2).
2. Compare its SHA-256 with the `sha256:` digest GitHub shows next to the file:

   ```bash
   sha256sum infinidysk-<tag>-linux-<arch>.tar.gz
   ```

3. Extract it:

   ```bash
   tar -xzf infinidysk-<tag>-linux-<arch>.tar.gz
   ```

   The folder `infinidysk-<tag>-linux-<arch>/` holds `infinidysk`, `LICENSE`, `version.txt` and `commit.txt` (the full commit the binary was built from).

## Run

Keep the program and its data apart. `INFINIDYSK_CONFIG_DIR` is the data folder; it must be an absolute path:

```bash
INFINIDYSK_CONFIG_DIR=/var/lib/infinidysk ./infinidysk-<tag>-linux-<arch>/infinidysk
```

infinidysk creates the folder if it is missing. Then continue with [First start](/v2/install/docker/#first-start). The port, the mount folder and all other variables work as in Docker; see [Environment variables](/v2/reference/environment/).

When infinidysk runs as a user other than root, `fusermount3` allows the mount for other users (your media server) only with `user_allow_other` in `/etc/fuse.conf`.

## Update

1. Stop infinidysk.
2. Back up the folder in `INFINIDYSK_CONFIG_DIR`.
3. Extract the new archive into a new folder.
4. Start the new `infinidysk` with the same `INFINIDYSK_CONFIG_DIR`.
