---
title: Move off rclone
description: Replace the 1.x rclone sidecar with the built-in FUSE mount and keep library symlinks and file dates.
---

2.x mounts the library itself over FUSE, so the rclone sidecar is no longer needed. Do these steps before 2.x starts for the first time. If 1.x had no rclone sidecar, skip this page.

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

3. Give the infinidysk container what the rclone container had: `/dev/fuse`, `SYS_ADMIN`, `apparmor:unconfined`, and the parent directory with `:rshared` (as in the [compose file](/v2/install/docker/#compose-file)). The mount directory must be visible at the same path inside the container: if rclone used `/mnt:/mnt:rshared`, use the same bind here.
4. Check your rclone command for `--no-modtime`. If it was there, set this on infinidysk:

   ```yaml
       environment:
         INFINIDYSK__MOUNT__EPOCH_TIMES: "true"
   ```

   With `--no-modtime`, every file on the rclone mount showed a 1970 date and your media server stored that. 2.x shows real dates by default, so without this Plex and similar servers re-read every file on their next scan. **Disable file timestamps** under Settings > Platform > Mount does the same, but takes effect only after a restart and must be on before any library scan. Without `--no-modtime`, leave it off.

Then [run the upgrade](/v2/upgrade/run/).

## Check after the first start

From the host and from an Arr container:

```sh
ls /mnt/remote/infinidysk   # expect .ids, completed-symlinks, content, nzbs
```

Then open one existing library symlink and confirm it plays.

## Moving the mount later

Set your [library folders](/v2/operate/library-folders/) first, then change **Directory** under Settings > Platform > Mount. After the restart, 2.x rewrites the symlinks in those folders.

## Without FUSE

If the container cannot get `/dev/fuse`, 2.x logs a warning and runs WebDAV only. You can keep rclone in that case; see [WebDAV](/v2/operate/webdav/#without-fuse).
