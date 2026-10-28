---
title: "Indexer search"
---
Configure Newznab indexers under **Settings → Indexers**, then search from the UI or expose them through **Search profiles**. infinidysk can also pull-sync Prowlarr-managed Usenet indexers from one Prowlarr instance <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.1.0">since 1.1.0</a>.

## Profiles and adapters

Each profile selects indexers and optional adapters:

| Adapter | Use |
|---------|-----|
| Newznab | `http://nzbdav:3000/adapters/newznab/{token}` for Prowlarr/Arr |
| Addon | Manifest at `/adapters/addon/{token}/manifest.json` |
| JSON | `GET /api/search/{token}/lookup?...` |

Treat profile tokens as secrets. Play links in results have a configurable lifetime (**Watchdog → Search link lifetime**) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.8.0">since 0.8.0</a>.

## Ranking <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>

Search Profile adapters apply two independent controls:

- **Strict matching** (per indexer) rejects an explicit wrong movie year when canonical metadata is
  known. Lack of year evidence stays permissive. This is not a quality sort, and it does not apply
  show-premiere years to TV/episode results.
- **Result ordering** (per profile, default Off) can sort by resolution, or by resolution then
  source, before the usual grabs/size/posted-date tie-breakers.

Settings → Indexers manual search does not use Search Profiles and keeps its existing order.

## Filters

Manual regex excludes plus synced remote lists (e.g. TRaSH-style JSON). Synced patterns refresh on a schedule; last-good cache survives temporary URL failures.

[Indexers](/configuration/indexers/) · [Profiles](/configuration/profiles/)
