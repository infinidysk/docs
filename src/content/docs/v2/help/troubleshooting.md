---
title: Troubleshooting
description: Fix common mount, upgrade and library problems in infinidysk 2.x.
---

Still stuck? See [Reporting a bug](/v2/help/reporting/).

## The mount is empty or missing

- Check the log for a warning about `/dev/fuse`. Without it 2.x serves WebDAV only. Add the device, `SYS_ADMIN` and `apparmor:unconfined` as in the [compose file](/v2/install/docker/#compose-file).
- The mount shows on the host and in other containers only when the parent directory is bound with `:rshared` here and `:rslave` in the readers. See [Share the mount](/v2/install/media-servers/#share-the-mount).
- After a crash, readers see "Transport endpoint is not connected" until infinidysk starts again.

## 2.x started empty after the upgrade

2.x imports only when it finds a SQLite 1.x database at `/config/db.sqlite`. Without one (a wrong config bind, or 1.x on PostgreSQL, which the importer does not read yet) it starts as a new install. Run [`import-report`](/v2/upgrade/#steps) against the same directory: it says `no C# database` in that case. Stop 2.x, fix the bind, and start again on a fresh copy of the 1.x config.

## Library symlinks do not resolve after the upgrade

The 2.x mount must sit at exactly the path rclone mounted. See [Move off rclone](/v2/upgrade/rclone/).

## Plex re-reads the whole library

Either the time zone changed (set `TZ` to the zone 1.x ran in), or the old rclone mount used `--no-modtime`. See [Move off rclone](/v2/upgrade/rclone/#steps), step 4.

## Finding who reads a file

See [Who is reading](/v2/operate/logs-traces/#who-is-reading).
