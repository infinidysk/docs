---
title: "Backup and restore"
---
Logical SQL dumps of databases, schedule/retention, upload/download/restore.

:::tip[Headless ENV]
Map schedule/retention keys to `NZBDAV_CONFIG__...` with the
[naming algorithm](/v1/configuration/headless/#naming-algorithm)
(`backup.schedule-time` → `NZBDAV_CONFIG__BACKUP__SCHEDULE_TIME`, minutes from midnight).
Create / upload / restore **actions** remain out of the ENV overlay.
:::

| Setting | What it does |
|---|---|
| Enable daily backup<br/>`backup.schedule-enabled` | Writes a backup to `/config/backups/` once a day. Default off. |
| Daily run time<br/>`backup.schedule-time` | Minutes from midnight; uses `TZ`. Default midnight (`0`). |
| Keep newest backups<br/>`backup.retention-count` | Prunes older non-preserved backups; `0` = no pruning. Default `5`. |

Each backup is a folder under `/config/backups/` with `db.sql` (SQLite main database),
`warden.sql` and `manifest.json`. **Download** saves it as a ZIP; upload accepts a ZIP or
`.sql` file.

Actions: **Create Backup**, upload, and per backup **Preserve**, **Download**, **Restore** and
**Delete**. Preserved backups are never pruned.

:::caution
In SQLite mode, backups contain `db.sqlite` and `warden.db` as `db.sql` and `warden.sql`. In PostgreSQL mode, in-app backups include only the local `warden.db` (`warden.sql`); back up the PostgreSQL main database separately with `pg_dump`. Neither mode includes `metrics.sqlite` (metrics history) or `blobs/`. Copy `metrics.sqlite` from the config volume yourself if you want to keep metrics history; a restore leaves the current metrics database unchanged, even when an older backup still contains `metrics.sql`. Missing blobs after restore are reported in the UI. Restore replaces settings, queue, history, and WebDAV tree metadata in SQLite mode; creates a pre-restore safety backup; server restarts into maintenance.
:::

## Migration database is disposable

Backups deliberately exclude `usenet-migration.db` (state for the experimental migration wizard under Settings → Migration). Deleting that file only loses migration bookkeeping, never mounted WebDAV content. If you restore a database backup mid-migration and the wizard shows many `evicted` releases, reset or forget migration data and re-scan; already-imported releases are re-detected and not resubmitted. See the [migration guide](/v1/guides/altmount-migration/).

## Related
Restoring after `SQLite Error 11` ("database disk image is malformed")? See [Database corruption](/v1/operations/database-corruption/).

[Backups and upgrades](/v1/guides/backups-upgrades/)
