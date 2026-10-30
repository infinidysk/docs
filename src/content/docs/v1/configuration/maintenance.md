---
title: "Maintenance"
---
Database housekeeping, scheduled unlinked-file cleanup, and one-off tools.

:::tip[Headless ENV]
Map config keys below to `NZBDAV_CONFIG__...` with the
[naming algorithm](/v1/configuration/headless/#naming-algorithm).
Schedule times are **minutes from midnight** in container `TZ`
(`180` = 03:00). One-off maintenance **tasks** remain out of the ENV overlay.
:::

## Settings

| Setting | What it does |
|---|---|
| Vacuum on startup<br/>`db.is-startup-vacuum-enabled` | Reclaim SQLite space; may slow start. Default off. |
| SAB history retention<br/>`database.history-retention-days` | Days of SAB history to keep. Does not delete WebDAV files; `0` = keep all. Default `90`. |
| Health-check retention<br/>`database.healthcheck-retention-days` | Days of health-check results to keep; `0` = keep all. Default `30`. |
| Raw fetch-event retention <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.1.0">since 1.1.0</a><br/>`metrics.fetch-retention-hours` | Hours (`0`–`8760`) of raw `SegmentFetches` / `FailoverMisses` rows; rollups kept; `0` = rollup-only (one-hour floor). Default `24`. |
| Enable daily cleanup<br/>`maintenance.remove-orphaned-schedule-enabled` | Runs **Remove Orphaned Files** once a day. Default off. |
| Daily run time<br/>`maintenance.remove-orphaned-schedule-time` | Minutes from midnight; uses container `TZ`. Default midnight (`0`). |

## Tasks (actions)

| Task | What it does |
|---|---|
| Clean Missing Payloads <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a> | Remove mounts whose payload blob **and** legacy metadata are both absent, and request Arr replacements. Caution: Permanent; dry run and `/config` backup required; never blocklists the release. |
| Remove Orphaned Files | Remove unlinked WebDAV files (not linked from the library). Caution: Permanent; dry run available. If more than 90% appear unlinked, review the audit and use its 15-minute approval. Library Directory must be the organized library, not the rclone mount. |
| Prune Completed History | Remove completed SAB history rows. Caution: History-only; mounts stay; unlinked mounts become eligible for **Remove Orphaned Files**. |
| Rename Windows-Invalid Paths | Sanitize existing names. Caution: Needs Windows-safe paths; backup + dry run. |
| Convert STRM Files to Symlinks | Strategy migration. Caution: Needs library dir + rclone mount. |
| Recreate STRM Files | Refresh sidecars. Caution: Needs STRM strategy + completed dir + base URL. |
| Migrate Large Database Blobs to Blobstore | Background optimization. Caution: Usually automatic. |
| Re-run Library Health Checks <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a> | Fresh health-check pass over every video, audio, and archive file, including items still in SAB history. Caution: Heavy Usenet STAT traffic on large libraries; runs in the background. |
| Reset Health-Check Statistics | Clear health-check history. Caution: Cannot undo. |
| Reset Overview Statistics <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.8.0">since 0.8.0</a> | Clear overview metrics. Caution: Cannot undo. |

[Retention](/v1/operations/retention-cleanup/) · [Deletion audit](/v1/operations/deletion-audit/)
