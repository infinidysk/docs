---
title: "Streaming only"
---
Use infinidysk without building a traditional Arr library.

## Patterns

- **Explore / Queue**: upload NZBs manually, play from Explore, or copy `/view` links.
- **Stremio + AIOStreams**: [Stremio guide](/v1/guides/stremio/).
- **Search profiles**: Addon or JSON adapters for on-demand clients ([Indexer search](/v1/features/indexer-search/)).
- **Watchtower**: keep a list ready without importing to a media server ([Watchtower](/v1/features/watchtower/)).

## Minimal settings

1. Usenet providers and a WebDAV password.
2. Indexers (if searching).
3. Watchdog on for playback failover ([Watchdog settings](/v1/configuration/watchdog/)).
4. Skip rclone unless you want a local FUSE mount for VLC or similar players.

## Repairs without Arr <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.5">since 1.2.5</a>

**Background Repairs** is on by default <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>: health checks and limited damage tolerance run without a Library Directory or Arr app. PAR2 gap repair is off by default and runs only when you enable it. To automatically remove broken unlinked items after playback failures,
set **Repair After Streaming Failures** above `0`; its default (`0`) keeps the item and marks it
**Action needed**. See [Repairs settings](/v1/configuration/repairs/).

Secure the UI and WebDAV the same way as any other deploy: TLS, strong passwords, no open port `3000` on the internet.

## Next

[Stremio via AIOStreams](/v1/guides/stremio/)
