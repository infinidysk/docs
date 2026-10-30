---
title: Before you upgrade
description: Check that you can upgrade from 1.x to infinidysk 2.x, copy your config and run a dry run.
---

The upgrade reads your 1.x config and imports it into a new database: providers, Arr instances, categories, the SAB API key, WebDAV and admin logins, the mount directory, the library and its item ids, history and the queue.

Your 1.x files are opened read-only and never changed. Still, work on a copy.

:::caution[Who should not upgrade yet]
- **DUMB users.** 2.x does not ship binaries packaged for DUMB yet. Stay on 1.x for now.
- **1.x on PostgreSQL.** The importer only reads a SQLite 1.x database (`db.sqlite`). Without one, 2.x starts as a new, empty install instead of importing, and `import-report` says `no C# database`.
- **1.x older than v1.3.0.** Update 1.x and start it once first.
- **You need a 1.x feature 2.x does not have yet.** See [What's new in 2.x](/v2/whats-new/#differences).
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

3. Note the time zone 1.x ran in. 2.x needs the same `TZ`: 1.x stored local times, so a different zone shifts every file date, and media servers may then re-read your whole library.

Next, if 1.x used an rclone sidecar, [move off rclone](/v2/upgrade/rclone/). Otherwise go straight to [Run the upgrade](/v2/upgrade/run/).
