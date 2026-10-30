---
title: "Retention and cleanup"
---
## Database retention

- **History retention** prunes SAB history rows. It does not delete WebDAV mounts.
- **Health-check retention** prunes health result rows.
- `DATABASE_MAINTENANCE_INTERVAL_HOURS` sets how often the history and health-result retention sweeps run. Metrics retention runs hourly.

Settings and defaults: [Maintenance](/v1/configuration/maintenance/) and [Environment variables](/v1/configuration/environment-variables/#settings-fallbacks-when-ui-empty).

## Metrics database <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.1.0">since 1.1.0</a>

infinidysk stores streaming and provider metrics in a separate SQLite file (`metrics.sqlite` under `CONFIG_PATH`). Size grows with throughput because each article fetch is recorded as a raw row in `SegmentFetches` while the metrics write queue has capacity; rows dropped when it is full are counted.

| Tables | What they keep |
|--------|----------------|
| `SegmentFetches`, `FailoverMisses` | Raw fetch events. Default 24 hours (`metrics.fetch-retention-hours`). |
| `MetricEvents`, `ThroughputMinutes`, `ProviderMinutes` | Events and minute rollups. Default 7 days. |
| `ReadSessions` | Read sessions. Default 90 days. |
| `ProviderHourly`, `FailoverHourly` | Hourly rollups, folded into lifetime totals. Default 365 days. |

**Size expectations:** on high-throughput hosts, a few hundred MB per TB/day of sustained throughput is normal — proportional growth from raw fetch rows, not a leak. Shrinking `metrics.fetch-retention-hours` reduces raw-row depth; minute and hourly rollups still carry aggregate throughput and provider stats.

Setting `metrics.fetch-retention-hours` to `0` requests rollup-only retention; the hourly sweep enforces a one-hour floor on raw rows. Configure in **Settings → Maintenance**, or with the `METRICS_FETCH_RETENTION_HOURS` fallback variable when the setting is empty.

## NZB blobs

Blobs under `{CONFIG_PATH}/blobs/` remain while referenced by queue, history, or mounted `/content`. When the last reference drops, background cleanup removes them.

Scheduled history retention and the **Prune Completed History** task delete SAB history rows only (`deleteFiles: false`). They do not delete WebDAV mounts, but they do clear each mount's history link (`HistoryItemId`). **Remove Orphaned Files** then deletes those mounts only if they also have no library symlink or STRM.

## Missing streaming payloads <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>

A database restore without the matching `blobs/` directory can leave mounted files whose streaming metadata no longer exists. Health checks report these as **Action needed** and back off to weekly checks after three consecutive confirmations. This is local data loss, not evidence that the Usenet release is bad.

Use **Settings → Maintenance → Clean Missing Payloads** to resolve the broken references. Run the dry run first and review its audit. Its approval lasts 15 minutes and is rejected if the candidate or link snapshot changes. A candidate is included only when both its physical payload blob and its legacy database fallback are absent. The cleanup rechecks each candidate and each library symlink or STRM target immediately before deletion.

For a verified Sonarr or Radarr library file, cleanup removes the media-file record and requests a replacement search through the matching Arr instance. It does **not** mark the original download failed or blocklist the release. Replacement searches use the configured per-media search budget; searches over the limit are withheld. Items are left untouched when an Arr instance is unreachable, ownership is ambiguous, or a link changes after the dry run.

Back up `/config` and pause Arr imports before running cleanup. Restore the missing `blobs/` directory instead if a matching backup still exists. This task is manual only and has no automatic schedule.

## Unlinked files {#orphaned-files}

**Remove Orphaned Files** (Maintenance) deletes WebDAV files that are not linked from the library directory and are no longer tied to a SAB history row. Generated STRM sidecars owned by an unlinked item are deleted with it <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>. Supports dry run. An optional daily schedule is configured in [Maintenance](/v1/configuration/maintenance/); set container `TZ`. Direct WebDAV or rclone playback is not a library link, and neither are sidecars under the configured completed-downloads directory <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a> — those are infinidysk's own outputs, not library links, even when the completed-downloads directory sits inside the Library Directory.

**Library Directory** must be the organized library root that contains your Arr-imported symlinks or STRMs (the parent of your Radarr/Sonarr root folders). It must be visible inside the infinidysk container. Do not point it at the rclone mount (`rclone.mount-dir`) or at `/completed-symlinks` — that folder is infinidysk's virtual view of current History rows, so scanning it cannot protect files after history is cleared. Remove Orphaned Files aborts (dry run included) when Library Directory is the mount or a path inside it.

If more than 90% of eligible WebDAV files appear unlinked, a normal run is blocked until you run and review a fresh dry run. That approval lasts 15 minutes, is bound to the unlinked candidates, library links, configured paths, and recorded generated-sidecar state, and is consumed after one cleanup attempt.

History entries disappearing after an Arr import are client-initiated cleanup, not infinidysk deleting the mount: the Arr's **Remove Completed** setting, infinidysk **Automatic Queue Management** rules that call the Arr with `removeFromClient=true`, or a WebDAV DELETE of a release folder under `/completed-symlinks`. Mounted files stay streamable; only the History row is removed.

## NZB file backups

Optional copies of incoming NZBs (SABnzbd settings) prune by `api.nzb-backup-retention-days`.

[Deletion audit](/v1/operations/deletion-audit/) · [Maintenance](/v1/configuration/maintenance/)
