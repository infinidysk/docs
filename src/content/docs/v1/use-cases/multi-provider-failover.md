---
title: "Multi-provider failover"
---
## Goals

- Survive provider outages and article misses.
- Respect block accounts and connection limits.
- Prefer faster or higher-priority accounts when cascade is on.

## Setup

1. Add each provider under **Settings → Usenet** with accurate max connections.
2. Enable **cascade routing** if you want priority order (thinly-spared primaries can still yield to idle peers); leave off to share a pool.
3. Mark pure backups as **Backup Only**. The Overview **Providers** card labels them **Backup**.
4. Set **storage groups** only for true same-upstream resellers.
5. Optional data caps + usage offsets when migrating mid-block.
6. Run Auto-tune / benchmarks; consider [NNTP pipelining](/v1/features/nntp-pipelining/).

## Streaming priority

Under WebDAV, **Streaming Priority** allocates bandwidth share vs queue downloads so interactive playback wins under load.

[Usenet settings](/v1/configuration/usenet/) · [Multi-provider feature](/v1/features/multi-provider/)
