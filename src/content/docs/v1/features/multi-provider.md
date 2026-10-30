---
title: "Multi-provider routing"
---
Add multiple NNTP accounts under **Settings → Usenet**.

## Routing

- **Pool (default)**: connections are shared across enabled providers. Within the same provider type and recovery state, routing prefers remaining data cap (uncapped first), then unreserved connections as a fraction of the configured Provider Connection Limit, then estimated delivery score. A larger pool does not win just because it has more free connections. This is not round-robin and does not guarantee equal traffic; fully idle ties can keep favoring the same provider.
- **Cascade routing**: prefer providers in drag order and fail over down the list. A thinly-spared primary (at most 25% of its pool free) can yield to an idle same-tier peer. Fully saturated providers are skipped. Pool width does not outrank configured priority while both providers are healthy.

**Re-probe primary** (on by default) retries the primary once after a clean 430/451 before cascading, which helps when providers route across spool nodes. Turn it off to go straight to backups after the first miss.

Each provider has a type (pool, backup-only, or disabled), SSL, a connection limit, optional pipeline depth, and optional **data caps** that auto-pause near the limit.

How much bandwidth playback gets versus queue downloads is set by **Streaming Priority (vs Queue)** under **Settings → Streaming**.

## Circuit breakers and storage groups

Failing providers are skipped temporarily, for a cooldown that doubles on each consecutive trip up to a ceiling (60 seconds to 5 minutes by default). **Storage group** labels mark resellers that share the same upstream storage: after a clean article miss or an article rejected by yEnc validation on one, siblings in the group are skipped for that request. Connection errors never trigger this, and rejected articles are not remembered across requests.

After three consecutive trips <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.5.0">since 1.5.0</a>, the header alert explains that missing-article checks are paused and asks you to fix or disable the provider in Usenet settings.

Across requests, a bounded TTL **article-miss negative cache** <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.9.0">since 0.9.0</a> remembers definitive misses per provider or storage group so streaming retries are not spent re-probing known-missing articles. Its TTL and size are in the **Global** section of **Settings → Usenet**.

Only group providers that truly share storage and retention policy. All settings: [Usenet settings](/v1/configuration/usenet/).

## Related

[Multi-provider use case](/v1/use-cases/multi-provider-failover/) · [Streaming settings](/v1/configuration/streaming/)
