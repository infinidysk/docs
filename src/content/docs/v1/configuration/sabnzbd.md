---
title: "SABnzbd"
---
SABnzbd-compatible download client API used by Radarr/Sonarr. See also [API compatibility](/v1/features/sab-api/).

:::tip[Headless ENV]
Map any config key in the table to `NZBDAV_CONFIG__...` with the
[naming algorithm](/v1/configuration/headless/#naming-algorithm)
(`api.categories` → `NZBDAV_CONFIG__API__CATEGORIES`).
:::

| Setting | What it does |
|---|---|
| API Key<br/>`api.key` | Arr download client auth. Default from `FRONTEND_BACKEND_API_KEY` if unset. |
| Categories<br/>`api.categories` | Letters, numbers, and dashes. Default env or `audio,software,tv,movies`. |
| Manual Upload Category<br/>`api.manual-category` | Category for NZBs uploaded from the Queue page; also the default of the category picker beside the Upload NZB button <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.0">since 1.2.0</a>. Default `uncategorized`. |
| Trusted local hosts <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.8.0">since 0.8.0</a><br/>`api.addurl-trusted-hosts` | Hostnames, IPs, or CIDR ranges `addurl` may fetch from even though they resolve to private or loopback addresses. Default env `TRUSTED_INTERNAL_HOSTS`. |
| Import Strategy<br/>`api.import-strategy` | Symlinks (Plex) or STRM Files (Emby/Jellyfin). Default `symlinks`. |
| Rclone Mount Directory<br/>`rclone.mount-dir` | Shown for Symlinks. Path where rclone mounts the WebDAV root. Default env `MOUNT_DIR` or `/mnt/nzbdav`. |
| Completed Downloads Dir<br/>`api.completed-downloads-dir` | Shown for STRM Files. Directory visible to Arr apps where STRM files are written. No default; suggested `/data/completed-downloads`. |
| Ignored Files<br/>`api.download-file-blocklist` | Wildcard patterns (`*` and `?`) for files that are not mounted. Default `*.nfo, *.par2, *.sfv, *unpack.mkv, *.unpack.mp4`. |
| Filter sample videos from downloads <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.10.0">since 0.10.0</a><br/>`api.sample-filter-enabled` | Discard videos in sample release subfolders such as `Sample/` <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>, even when no main video exists. Filename-only whole-word `sample`/`samples` matches are discarded only when under 20% of the largest video in the NZB. Category and release folder names are ignored. Default on. |
| Rename a single video to the release name <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a><br/>`api.rename-single-video-to-release` | When a job mounts exactly one video, rename it to `{release-folder}{extension}`. Season packs and collisions keep the original name. New imports only. Default on. |
| Behavior for Duplicate NZBs<br/>`api.duplicate-nzb-behavior` | `increment` downloads again with a suffix; `mark-failed` fails the download. Default `increment`. |
| Fail downloads for NZBs without video or audio content<br/>`api.ensure-importable-video` | Fail NZBs with no media after filtering; failures identify [RAR-inside-7z limitations](/v1/features/archives/) when applicable. Turning this off permits raw archive mounts, not nested-archive playback. Default on. |
| Fail downloads when non-media files have missing articles<br/>inverse of `api.skip-non-video-on-missing-articles` | Video and audio files always fail on missing articles; other files are skipped unless this is on. Default off. |
| Perform article health check during downloads <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.5">since 1.2.5</a><br/>`api.ensure-article-existence-categories` | Categories that get STAT checks plus a final direct-media BODY readiness read; may be slow. Default empty (off). |
| Article health check mode<br/>`api.article-existence-check-mode` | Full or per-file sampled verification. Default `full`. |
| Always send full History to Radarr/Sonarr<br/>`api.ignore-history-limit` | Ignore the client's History limit. Default on. |
| Save backup copies of incoming NZBs<br/>`api.nzb-backup-enabled` | Write a copy of each incoming NZB to disk. Default off. |
| Backup directory<br/>`api.nzb-backup-location` | Where backups go, in category subdirectories. Default empty. |
| Keep NZB backups for (days)<br/>`api.nzb-backup-retention-days` | `0` keeps them forever. Default `30`. |

STRM files also need the public **Base URL**, which is under **Settings → General → Public
access**, not this tab; see [URL base](/v1/configuration/url-base/).

Queue capacity and admission limits are configured separately under
[Queue](/v1/configuration/queue/). The default user agent for retrieving NZBs, including
matched `addurl` requests, is configured under [Indexers](/v1/configuration/indexers/).

## STRM sidecar cleanup <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>

Generated STRM files are deleted together with their content (history
delete-with-files, health repair, and the **Remove Orphaned Files** maintenance
task). Sidecars under the configured completed-downloads directory never count
as library links for unlinked-file cleanup, even when that directory sits inside
the Library Directory.

## Sampled article checks <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.10.0">since 0.10.0</a>

Categories selected under `api.ensure-article-existence-categories` use a full
article check by default, preserving existing behavior. Set
`api.article-existence-check-mode` to `sampled` to check the first and last
segments plus an evenly spaced selection of middle segments in each important
file. Sampling is applied per file so every file's tail is covered; this catches
common truncated or partially removed releases without a full STAT sweep.

Small files (currently up to roughly 8,000 segments) are still checked in full.
The sampled mode uses the same standard-depth selection as background health
checks. It is a screen rather than a guarantee: urgent repair remains the
backstop if an article disappears later or STAT succeeds while BODY fails.

For selected categories, infinidysk also reads the head and tail of direct media
outputs before reporting a successful SAB completion <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.5">since 1.2.5</a>. This rejects unreadable
container headers and short reads before Sonarr or Radarr begin import. It does
not replace streaming corruption detection or PAR2 repair: damage limited to
the middle of a release can only be detected when that part is read.

## API-key rotation <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.5">since 1.2.5</a>

After rotating `api.key`, update the API key in every configured Sonarr/Radarr
download-client entry and use its test action before resuming a bulk search.
Rejected SAB API requests are logged without exposing the key, with failures
for the same mode and category throttled.

[Import strategies](/v1/guides/import-strategies/) · [Queue settings](/v1/configuration/queue/)
