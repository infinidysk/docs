---
title: "Preflight"
---
Background warm-up of top search results before the user clicks.

:::tip[Headless ENV]
Map config keys below to `NZBDAV_CONFIG__...` with the
[naming algorithm](/v1/configuration/headless/#naming-algorithm)
(`preflight.mode` → `NZBDAV_CONFIG__PREFLIGHT__MODE`).
:::

| Setting | What it does |
|---|---|
| Mode<br/>`preflight.mode` | `off` (no background work), `light` (quick existence check on the top results), `standard` (light + cache the article descriptor) or `full` (standard + resolve archive layout for previously completed items). Default `off`. |
| Max candidates to try<br/>`preflight.max-attempts` | Walk top results until one passes (1–50). Default `20`. |
| Keep preflight state for (seconds)<br/>`preflight.ttl-seconds` | How long a result stays warm (10–1800). Default `120`. |
| Skip if indexer wait exceeds (seconds)<br/>`preflight.indexer-max-wait-seconds` | Avoid queueing behind indexer rate limits (0–120). Default `5`. |

Watchtower can also warm the same cache path for list titles; see [Watchtower](/v1/configuration/watchtower/).
