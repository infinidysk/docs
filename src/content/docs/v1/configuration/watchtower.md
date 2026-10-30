---
title: "Watchtower settings"
---
Pre-resolve list titles to healthy releases. Feature overview: [Watchtower](/v1/features/watchtower/).

:::tip[Headless ENV]
Map config keys below to `NZBDAV_CONFIG__...` with the
[naming algorithm](/v1/configuration/headless/#naming-algorithm)
(`watchtower.enabled` → `NZBDAV_CONFIG__WATCHTOWER__ENABLED`).
:::

| Setting | What it does |
|---|---|
| Enable Watchtower<br/>`watchtower.enabled` | Master switch. Default off. |
| Search profile<br/>`watchtower.profile-token` | Which profile's indexers. Default first configured profile. |
| Release selection<br/>`watchtower.ranking` | `watchdog` (match the watchdog's pick) / `largest` (largest healthy release). Default `watchdog`. |
| Series scope<br/>`watchtower.series-scope` | `latest-season` / `first-season` / `all-aired` / `recent` / `off`. Default `latest-season`. |
| Recent episode count<br/>`watchtower.series-recent-count` | When scope is `recent` (1–100). Default `3`. |
| Prefer season bundles for finished seasons<br/>`watchtower.season-bundles` | Finished seasons as one release. Default on. |
| Fall back to episodes when no season bundle is found<br/>`watchtower.season-bundle-fallback` | Resolve single episodes instead. Default off. |
| Fallback scope<br/>`watchtower.season-bundle-fallback-scope` | `latest-season` / `recent` / `all`. Default `latest-season`. |
| Recent season count<br/>`watchtower.season-bundle-fallback-recent-count` | When fallback scope is `recent` (1–100). Default `2`. |
| Max fallback episodes per season<br/>`watchtower.season-bundle-fallback-max-episodes` | 1–1000. Default `50`. |
| Max items per series<br/>`watchtower.series-max-episodes` | 0–1000; `0` = unlimited. Default `50`. |
| When over the cap, keep<br/>`watchtower.series-cap-keep` | `newest` / `oldest`. Default `newest`. |
| Junk floor (GB)<br/>`watchtower.size-floor-bytes` | Drop tiny releases. Default 524,288,000 bytes (about 524 MB). |
| Bandwidth ceiling (GB)<br/>`watchtower.size-ceiling-bytes` | Empty or `0` = no ceiling. Default none. |
| Minimum grabs<br/>`watchtower.min-grabs` | Skip releases with fewer indexer grabs than this. Default `0`. |
| Active warm-set cap<br/>`watchtower.active-set-cap` | Standing ready items (1–100000). Default `100`. |
| Auto throughput (match indexer limits)<br/>`watchtower.auto-throughput` | Ignores the daily budget. Default off. |
| Daily resolve budget<br/>`watchtower.daily-resolve-budget` | Soft new resolves per day. Default `60`. |
| Shortlist depth<br/>`watchtower.shortlist-depth` | Winner + backups (1–5). Default `2`. |
| Grab cap per resolve<br/>`watchtower.grab-cap-per-resolve` | Max NZB fetches per pass (1–10). Default `3`. |
| Verify sample count<br/>`watchtower.verify-sample-count` | STAT segments (1–20). Default `3`. |
| Verify timeout (seconds)<br/>`watchtower.verify-timeout-seconds` | Per segment (2–120). Default `10`. |
| Re-check interval (seconds)<br/>`watchtower.keepfresh-base-seconds` | Usenet-only re-verify (300–604800). Default `21600` (6 h). |
| Max re-check interval (seconds)<br/>`watchtower.keepfresh-max-seconds` | Backoff cap (600–2592000). Default `604800` (7 d). |
| Dead-item retry interval (seconds)<br/>`watchtower.unavailable-retry-seconds` | Re-search cadence (600–604800). Default `21600` (6 h). |
| List sync interval (seconds)<br/>`watchtower.sync-interval-seconds` | Remote list refresh (60–86400). Default `3600` (1 h). |
| Max list-source response (bytes) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.8">since 1.2.8</a><br/>`watchtower.list-source-max-response-bytes` | Rejects oversized Stremio/list bodies before parsing; counts bytes as the HTTP client delivers them (no automatic decompression). Max `16777216` (about 16.8 MB). Default `8388608` (about 8.4 MB). |
| Verbose activity logging<br/>`watchtower.verbose-logging` | Chatty Logs output. Default off. |

`watchtower.resolve-concurrency` (default `3`) exists in the backend but is not exposed in this Settings tab.
