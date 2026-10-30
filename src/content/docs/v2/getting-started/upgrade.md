---
title: Upgrade from 1.x
description: Import a 1.x config into infinidysk 2.x, with a dry run first and a rollback path.
---

The upgrade reads your 1.x config and imports it into a new database: providers, Arr instances, categories, the SAB API key, WebDAV and admin logins, the mount directory, the library and its item ids, history and the queue.

Your 1.x files are opened read-only and never changed. Still, work on a copy.

:::caution[Who should not upgrade yet]
- **DUMB users.** 2.x does not ship binaries packaged for DUMB yet. Stay on 1.x for now.
- **1.x on PostgreSQL.** The importer only reads a SQLite 1.x database (`db.sqlite`). Without one, 2.x starts as a new, empty install instead of importing, and `import-report` says `no C# database`.
- **1.x older than v1.3.0.** Update 1.x and start it once first.
:::

## Steps

1. Stop 1.x so the copy is consistent, then copy its config directory:

   ```sh
   docker compose stop <1.x service>
   cp -a ./config ./config-2.0
   ```

2. Optional dry run. This prints what will be carried over, what will not, and why, without importing anything:

   ```sh
   docker run --rm -v ./config-2.0:/config ghcr.io/infinidysk/infinidysk-next:edge import-report
   ```

3. Set `TZ` on 2.x to the same zone 1.x ran in. 1.x stored local times, so a different zone shifts every file date, and media servers may then re-read your whole library.
4. If 1.x used an rclone sidecar, follow [Move off rclone](/v2/getting-started/rclone/) first: the mount path and file dates must be right before 2.x starts, or library symlinks stop resolving and media servers re-read every file. Then start 2.x with `./config-2.0:/config` (see the [compose file](/v2/getting-started/docker/#compose-file)). The import runs on first start; the UI shows progress and the full report. Sign in with your 1.x admin login.
5. If the container name or port changed, update the SABnzbd download client in each Arr. 1.x served on port 8080; 2.x uses 3000. The API key stays the same.

## Do not run both

Do not run 1.x and 2.x at the same time. Both would use your provider connections.

## Roll back

Stop 2.x and start 1.x on the original `./config`. Anything imported or added while on 2.x is not carried back.

## What does not carry over

Settings for features 2.x does not have yet are listed in the import report. See [Not in 2.x yet](/v2/#not-in-2x-yet). The rclone settings (RC notifications, cache flags) are dropped; the built-in mount does not need them.
