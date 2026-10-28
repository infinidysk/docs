---
title: Upgrade from 1.x
description: Import a 1.x config into infinidysk 2.x, with a dry run first and a rollback path.
---

The upgrade reads your 1.x config and imports it into a new database: providers, Arr instances, categories, the SAB API key, WebDAV and admin logins, the mount directory, the library and its item ids, history and the queue.

Your 1.x files are opened read-only and never changed. Still, work on a copy.

:::note
The importer needs a 1.x config from v1.3.0 or later (`db.sqlite`).
:::

## Steps

1. Stop 1.x so the copy is consistent, then copy its config directory:

   ```sh
   docker compose stop <1.x service>
   cp -a ./config ./config-2.0
   ```

2. Optional dry run. This prints what will be carried over, what will not, and why, without importing anything:

   ```sh
   docker run --rm -v ./config-2.0:/config ghcr.io/infinidysk/infinidysk-next:v2.0.0-alpha.8 import-report
   ```

3. Set `TZ` on 2.x to the same zone 1.x ran in. 1.x stored local times, so a different zone shifts every file date, and media servers may then re-read your whole library.
4. Start 2.x with `./config-2.0:/config` (see the [compose file](/v2/getting-started/docker/#compose-file)). The import runs on first start; the UI shows progress and the full report. Sign in with your 1.x admin login.
5. If the container name or port changed, update the SABnzbd download client in each Arr. 1.x served on port 8080; 2.x uses 3000. The API key stays the same.

Most 1.x installs used an rclone sidecar. Read [Move off rclone](/v2/getting-started/rclone/) before you start 2.x, or your library symlinks may stop resolving.

## Do not run both

Do not run 1.x and 2.x at the same time. Both would use your provider connections.

## Roll back

Stop 2.x and start 1.x on the original `./config`. Anything imported or added while on 2.x is not carried back.

## What does not carry over

Settings for features 2.x does not have yet are listed in the import report. See [Not in 2.x yet](/v2/#not-in-2x-yet). The rclone settings (RC notifications, cache flags) are dropped; the built-in mount does not need them.
