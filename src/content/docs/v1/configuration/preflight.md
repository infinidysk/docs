---
title: "Preflight"
---
Background warm-up of top search results before the user clicks.

:::tip[Headless ENV]
Map config keys below to `NZBDAV_CONFIG__...` with the
[naming algorithm](/v1/configuration/headless/#naming-algorithm)
(`preflight.mode` → `NZBDAV_CONFIG__PREFLIGHT__MODE`).
:::

| Control | Config key | Default | Effect |
|---------|------------|---------|--------|
| Mode | `preflight.mode` | `off` | off / light / standard / full |
| Max candidates to try | `preflight.max-attempts` | `20` | Walk top results until one passes |
| Keep preflight state for (seconds) | `preflight.ttl-seconds` | `120` | Warm TTL |
| Skip if indexer wait exceeds (seconds) | `preflight.indexer-max-wait-seconds` | `5` | Avoid queueing behind rate limits |

Watchtower can also warm the same cache path for list titles — [Watchtower](/v1/configuration/watchtower/).
