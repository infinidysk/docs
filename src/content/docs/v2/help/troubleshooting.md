---
title: Troubleshooting
description: Fix common mount, upgrade and library problems in infinidysk 2.x.
---

Still stuck? Ask in `#infinidysk-development` on [Discord](https://discord.gg/DAya7W6QMa); [Reporting a bug](/v2/help/reporting/) lists what to include.

## The mount is empty or missing

- Check the log for a warning about `/dev/fuse`. Without it 2.x serves WebDAV only. Add the device, `SYS_ADMIN` and `apparmor:unconfined` as in the [compose file](/v2/install/docker/#compose-file). If you only use WebDAV, [turn the built-in mount off](/v2/operate/webdav/#without-fuse) instead.
- The mount shows on the host and in other containers only when the parent directory is bound with `:rshared` here and `:rslave` in the readers. See [Share the mount](/v2/install/media-servers/#share-the-mount).
- After a crash, readers see "Transport endpoint is not connected" until infinidysk starts again.

## 2.x started empty after the upgrade

2.x imports when it finds a 1.x database: `/config/db.sqlite`, or a PostgreSQL database named by `DATABASE_PROVIDER` and `DATABASE_CONNECTION_STRING` (or by `/config/db-contract.json`). Without either, usually because of a wrong config bind, it starts as a new install. Run [`import-report`](/v2/upgrade/#steps) against the same directory: it says `no C# database` in that case. Stop 2.x, fix the bind, and start again on a fresh copy of the 1.x config. For 1.x on PostgreSQL, see [Upgrade from 1.x on PostgreSQL](/v2/upgrade/postgresql/).

## The upgrade stops while copying 1.x PostgreSQL data

The upgrade screen shows the reason, and 2.x copies again on the next start. See [If the copy fails](/v2/upgrade/postgresql/#if-the-copy-fails).

## infinidysk will not start: database.toml is missing

The log says `This install moved to PostgreSQL, but /config/database.toml is missing`. infinidysk refuses to start as an empty install. Restore `database.toml` from your backup to stay on PostgreSQL, or [go back to SQLite](/v2/operate/postgresql/#go-back-to-sqlite).

## The switch to PostgreSQL failed

infinidysk started on SQLite again and Settings > System > Database shows the reason. Nothing is lost; it copies again and you can switch once the page shows **In sync**. See [When something goes wrong](/v2/operate/postgresql/#when-something-goes-wrong).

## Library symlinks do not resolve after the upgrade

The 2.x mount must sit at exactly the path rclone mounted. See [Move off rclone](/v2/upgrade/rclone/).

## Plex re-reads the whole library

Either the time zone changed (set `TZ` to the zone 1.x ran in), or the old rclone mount used `--no-modtime`. See [Move off rclone](/v2/upgrade/rclone/#steps), step 4.

## Finding who reads a file

See [Who is reading](/v2/operate/logs-traces/#who-is-reading).
