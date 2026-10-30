---
title: "Search profiles"
---
Named profiles select which indexers to query and which output adapters to expose. Stored as `profiles.instances`
(`NZBDAV_CONFIG__PROFILES__INSTANCES` — see [headless](/v1/configuration/headless/)).

| Setting | What it does |
|---|---|
| Name | Profile label. |
| Indexers | Leave all unchecked to use every enabled indexer. Default all. |
| Output adapters: JSON Search API | Vendor-neutral JSON adapter. Default on if unset. |
| Output adapters: Newznab | For Prowlarr, Sonarr, and Radarr. Default on if unset. |
| Output adapters: Addon | Manifest-based addon endpoint. Default on if unset. |
| Result ordering <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a> | Off (keep grabs/size/date order), Resolution, or Resolution + source. Default Off. |
| Query fallback: Movies | Off or Also search by title, when an ID lookup comes up short. Default Off; threshold `3`. |
| Query fallback: TV | Off, Title + episode (precise), or Title + episode, then whole show (broad). Default Off; threshold `3`. |

The Addon adapter is a Stremio manifest. Paste it into AIOStreams as the dedicated **infinidysk** preset when available, or as **Custom Addon** until that preset ships. See [Stremio](/v1/guides/stremio/).

Addon streams can include best-effort `inLibrary`, `availability`, audio language, and subtitle language metadata <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>. Those markers are optional and are omitted when unknown. Copied adapter URLs include any configured URL base.

## Result matching and ordering <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>

When an indexer has **Strict matching** enabled, Search Profiles reject movie releases whose explicit
year is clearly wrong once a canonical title and year are known. A missing year is not treated as a
mismatch. TV, season, and episode strict matching stay title- and `SxxExx`-based; a show premiere
year is never applied to episode results.

**Result ordering** is profile-scoped and defaults to **Off**, so existing profiles keep the previous
grabs (when Prefer Downloaded is on), then size, then posted-date order. Choose:

- **Resolution** to prefer 2160p, then 1080p, 720p, then SD, before those tie-breakers.
- **Resolution + source** to keep that resolution order and then prefer Remux, BluRay, WEB-DL,
  WEBRip, HDTV, DVD, unknown, and CAM/TS.

Resolution always ranks above source. Watchtower-verified candidates can still be boosted above this
ordinary indexer order. Settings → Indexers manual search does not use Search Profiles and is
unchanged.

Treat each generated **token** as a secret. Adapter URLs look like:

- Newznab: `http://nzbdav:3000/adapters/newznab/{token}`
- Addon: `http://nzbdav:3000/adapters/addon/{token}/manifest.json`
- JSON: `GET /api/search/{token}/lookup?...`

:::tip
Fallback queries spend per-indexer hit/rate limits.
:::

Play link lifetime is under [Watchdog](/v1/configuration/watchdog/) (`play.resolution-cache-ttl-hours`) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.8.0">since 0.8.0</a>.
