---
title: "Multi-provider failover"
---
## Goals

- Survive provider outages and article misses.
- Respect block accounts and connection limits.
- Prefer providers in priority order (the configured drag order) when cascade routing is on.

## Setup

1. Add each provider under **Settings → Usenet** with an accurate Provider Connection Limit.
2. Turn on **Cascade routing** if you want priority order (thinly-spared primaries can still yield to idle peers); leave it off to share one pool.
3. Mark pure backups as **Backup Only**. The Overview **Providers** card labels them **Backup**.
4. Set **storage groups** only for true same-upstream resellers.
5. Optional: data caps and usage offsets when migrating mid-block.
6. Run Auto-tune or benchmarks; consider [NNTP pipelining](/v1/features/nntp-pipelining/).

How routing, circuit breakers, and storage groups behave: [Multi-provider](/v1/features/multi-provider/).
All provider settings: [Usenet settings](/v1/configuration/usenet/).

## Streaming priority

Under **Settings → Streaming**, **Streaming Priority (vs Queue)** sets how much of the connection budget playback gets versus queue downloads, so playback wins under load. See [Streaming settings](/v1/configuration/streaming/).

## Next

[Multi-provider feature](/v1/features/multi-provider/)
