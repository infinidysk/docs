---
title: Move off rclone
description: Replace the rclone sidecar with the built-in FUSE mount and keep library symlinks working.
---

2.x mounts the library itself over FUSE, so the rclone sidecar is no longer needed.

:::caution
Your library symlinks only keep working if the 2.x mount sits at exactly the path rclone mounted.
:::

## Steps

1. Check your 1.x mount directory (Settings > Rclone Server, for example `/mnt/remote/infinidysk`). The upgrade carries it over as the 2.x mount directory; confirm it in the import report. Your symlinks point into it (`<mount dir>/.ids/...`).
2. Stop and remove the rclone service from your compose file, and make sure nothing is left mounted there:

   ```sh
   docker compose rm -sf <rclone service>
   mount | grep /mnt/remote/infinidysk    # should print nothing
   sudo umount -l /mnt/remote/infinidysk  # only if it still does
   ```

3. Give the infinidysk container what the rclone container had: `/dev/fuse`, `SYS_ADMIN`, `apparmor:unconfined`, and the parent directory with `:rshared` (as in the [compose file](/v2/getting-started/docker/#compose-file)). The mount directory must be visible at the same path inside the container: if rclone used `/mnt:/mnt:rshared`, use the same bind here.
4. Start 2.x and check from the host and from an Arr container:

   ```sh
   ls /mnt/remote/infinidysk   # expect .ids, completed-symlinks, content, nzbs
   ```

   Then open one existing library symlink and confirm it plays.

## File dates

If your rclone mount used `--no-modtime`, every file on it showed a 1970 date and your media server stored that. 2.x shows real dates by default, which makes Plex and similar servers re-read every file on their next scan.

Before that scan, turn on Settings > Mount > Report 1970 file dates and restart.

## Moving the mount later

Set your library folders under Settings first, then change the mount directory under Settings > Mount. After the restart, 2.x rewrites the symlinks in those folders. The library folders must be bound into the infinidysk container at the same paths your Arrs use.

## Without FUSE

If the container cannot get `/dev/fuse`, 2.x logs a warning and runs WebDAV only. You can keep rclone in that case, pointed at `http://infinidysk:3000/`. 2.x does not send rclone refresh notifications, so keep `--dir-cache-time` short.
