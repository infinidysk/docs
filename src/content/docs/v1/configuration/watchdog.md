---
title: "Watchdog"
---
Playback failover, stall failover, and size-variant retention when a release cannot be served.

## Playback timeline <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.4.3">since 1.4.3</a>

The **Watchdog** page groups attempts by playback click, not by title. Separate requests
for the same title remain separate. Completed groups start collapsed; expand a group
to inspect candidate outcomes, durations, sizes, indexers, providers, and full failure
reasons. In-flight groups start expanded. Missing indexer information is explicitly
shown as unavailable.

:::tip[Headless ENV]
Map config keys below to `NZBDAV_CONFIG__...` with the
[naming algorithm](/v1/configuration/headless/#naming-algorithm)
(`play.watchdog-enabled` → `NZBDAV_CONFIG__PLAY__WATCHDOG_ENABLED`).
:::

## Failover

| Setting | What it does |
|---|---|
| Enable failover watchdog<br/>`play.watchdog-enabled` | Off = single release (legacy). Default on. |
| Total budget (seconds)<br/>`play.total-budget-seconds` | Hard ceiling 3–180. Default `30`. |
| Hedge delay (seconds)<br/>`play.hedge-delay-seconds` | Start backups if primary is slow (1–30). Default `3`. |
| Parallel candidates per batch<br/>`play.max-candidates` | 1–10. Default `3`. |
| Total candidates per request<br/>`play.max-attempts` | 1–200. Default `10`. |
| Verify mode<br/>`play.verify-mode` | `stat` / `body` / `none`. Default `none`. |
| Negative-cache TTL (minutes)<br/>`play.candidate-negative-cache-minutes` | Skip recently failed candidates (1–1440). Default `5`. |
| Search link lifetime (hours) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.8.0">since 0.8.0</a><br/>`play.resolution-cache-ttl-hours` | Play links in search results (1–720). Falls back to the legacy `RESOLUTION_CACHE_TTL_HOURS` env var. Default `168`. |
| Prefer releases with subtitles on failover<br/>`play.prefer-subtitles` | Reorder only. Default on. |

## Stall failover

| Setting | What it does |
|---|---|
| Enable stall failover<br/>`grab.stall-failover-enabled` | Requires watchdog on. Default on. |
| Stall window (seconds)<br/>`grab.stall-failover-window-seconds` | No progress → set aside (2–60). Default `2`. |
| Per-candidate ceiling (seconds)<br/>`grab.stall-failover-ceiling-seconds` | Max time before moving on (5–120). Default `5`. |

## Variants

| Setting | What it does |
|---|---|
| Mode<br/>`variants.mode` | `off` / `smart` / `collect-all`. Default `off`. |
| Size tolerance (%)<br/>`variants.tolerance-pct` | Smart only (0–100). Default `25`. |
| Max copies per group<br/>`variants.max-per-group` | 0–50; `0` = unlimited. Default `3`. |
| Selection strategy<br/>`variants.replay-strategy` | `closest-to-click` / `largest` / `smallest`. Default `closest-to-click`. |
| Fallback to closest existing on fetch failure<br/>`variants.fallback-on-failure` | Serve the closest existing copy. Default on. |
| Eviction strategy<br/>`variants.eviction-strategy` | `lru` / `largest-first` / `smallest-first` / `never`. Default `lru`. |
| Active-use grace (seconds)<br/>`variants.eviction-active-grace-seconds` | Skip eviction if recently used (0–300). Default `60`. |
| No UI (headless only) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.0">since 1.2.0</a><br/>`variants.segment-donors-enabled` | Borrow equivalent MessageIds from same-group copies. Default on. |
| No UI (headless only) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.0">since 1.2.0</a><br/>`variants.segment-donors-max-siblings` | Newest completed copies considered (0–10). Default `3`. |
| No UI (headless only) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.0">since 1.2.0</a><br/>`variants.segment-donors-max-per-segment` | Cap including intra-NZB fallbacks (1–32). Default `6`. |

Segment donors require a content-grouped sibling (profile-play, variants, or retry flows). Plain Sonarr/Radarr SAB adds never set a group key, so they do not donate or receive donors. Donation only happens between same-segmentation postings whose subject filenames match; obfuscated posts (unparseable names) do not match. An existing damaged item gains donors when a new same-group copy completes.

[Warden, Watchdog, Preflight](/v1/features/warden-watchdog-preflight/)
