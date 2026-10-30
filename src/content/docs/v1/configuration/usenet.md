---
title: "Usenet"
---
Configure NNTP providers, connection budgets, cascade or pooled routing, and queue-side NNTP pipelining.

:::tip[Headless ENV]
Each config key below maps to `NZBDAV_CONFIG__...` via the
[naming algorithm](/v1/configuration/headless/#naming-algorithm) (for example
`usenet.providers` → `NZBDAV_CONFIG__USENET__PROVIDERS`).
:::

## Providers

Add one or more accounts. Each provider supports:

| Setting | What it does |
|---|---|
| Nickname | Shown in the UI instead of the hostname. Optional. |
| Storage group | A definitive article miss (NNTP 430) on one provider skips the other providers with the same label for that request. A body whose yEnc header belongs to a different file is treated the same way, for that request only. Labels are free text you choose; give one only to providers known to share storage. Optional. |
| Host / Port | NNTP endpoint. Port is often `563`. |
| Username / Password | Credentials. Prefer SSL. |
| Provider Connection Limit | Provider-wide ceiling for all pooled connections, including transfers, metadata, and warm sockets. Do not exceed the account allowance. |
| Transfer Connections | Hard cap for concurrent `BODY` / `ARTICLE` work. Blank = legacy shared pool. |
| Metadata Capacity | Read-only base-to-burst range calculated from the two limits. Shows "Legacy shared pool" while Transfer Connections is blank. |
| Pipeline depth | Per-provider override when pipelining is on. Blank uses the global Queue depth (default `8`). |
| Type | Disabled / Pool Connections / Backup Only. A disabled provider is never contacted and keeps no connections. A Backup Only provider is dialed only when it must fill a missed article and keeps no warm connections. Default Pool Connections. |
| Use SSL | TLS for NNTP. Default on. |
| Skip TLS verification | Accept an invalid provider certificate. Shown when Use SSL is on. Default off. |
| Data Cap | Block-account limit; auto-pauses near 95%. Default uncapped. |
| Already Used | Seed usage when migrating mid-block. Default empty. |
| Auto-tune transfer connections | Speed test that recommends Transfer Connections and pipelining. Never changes Provider Connection Limit. |

Persisted as `usenet.providers` JSON. Without SSL, credentials cross the network
in cleartext; turn it off only on trusted networks.

## Data-cap accounting <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.5.0">since 1.5.0</a>

Data-cap usage counts the raw NNTP `BODY` payload received from the provider,
including yEnc headers, trailers, and bodies drained after an early close or
cancellation. NNTP command/status traffic and the terminating dot line are
excluded. The counter is independent of Overview statistics and analytics
retention, and a reset takes effect at the configured instant. On the first
startup after upgrading, infinidysk preserves the legacy displayed value; all
traffic received after that uses exact accounting.

Back up `/config` before upgrading; the metrics migration applies automatically
at startup.

## Connection budgets <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>

**Provider Connection Limit** is the absolute number of connections infinidysk may use for the
provider account. Set it no higher than the provider allows, or lower when the account is shared
with another client.

**Transfer Connections** limits article-body traffic independently. Once it is set, infinidysk
uses the rest of the provider budget for lightweight metadata commands such as `STAT`, `HEAD`,
and `DATE`. The editor previews **Metadata Capacity** from the configured values; after saving,
provider cards use the current effective provider limit when live runtime data is available. The
runtime range is calculated as follows:

    P = effective Provider Connection Limit
    T = min(configured Transfer Connections, P)

    base metadata = P - T
    maximum metadata = min(P, max(1, base metadata + floor(T / 2)))
    metadata burst = maximum metadata - base metadata
    metadata capacity = base metadata through maximum metadata

For example:

| Provider limit | Transfer connections | Metadata capacity |
|---------------:|---------------------:|------------------:|
| 50 | 20 | 30–40 |
| 50 | 50 | 0–25 |
| 40 | 16 | 24–32 |
| 1 | 1 | 0–1 |

Transfers never exceed their hard cap, and all work combined never exceeds the effective provider
limit. Metadata may borrow only the displayed burst allowance while transfer capacity is idle. If
transfers begin waiting, currently running metadata commands finish normally; their released slots
normally return to transfers first. Under a sustained transfer backlog, one metadata waiter is
admitted after at most eight consecutive transfer grants so health and control work cannot starve.

:::note[Existing providers stay in legacy mode]
A blank `MaxTransferConnections` value preserves the original shared-pool admission scheduling.
Merely opening or saving an existing provider does not enable split budgeting. Enter **Transfer
Connections** or apply an Auto-tune recommendation to opt in. Auto-tune's provider ceiling and
the busy-pool keep-alive safeguards below apply in both scheduling modes.
:::

Auto-tune finds the transfer-throughput knee and applies its recommendation only to **Transfer
Connections**. It progressively adds connection levels, including above 50 when configured, and
stops after throughput reaches a stable knee, the provider refuses more connections, or the data
budget is exhausted. It never rewrites or probes above **Provider Connection Limit**. Releases before
1.3.0 could sweep above the saved connection count; raise Provider Connection Limit first if you
want Auto-tune to test a higher count. When the result says speed was still climbing at the ceiling,
the provider may benefit from a higher limit if the account permits it. If the provider later
refuses its configured ceiling, infinidysk lowers the effective runtime limit without changing
either saved value; provider cards and metrics then show capacities based on that learned limit.
When the refusal does not state a number (for example `502 Too many connections`), infinidysk
holds the provider at the connections it already has open, keeps them serving, retries new opens
after a short fixed delay, and widens the limit by one connection every 5 seconds until the
provider refuses again or the configured limit is reached.

## Invalid provider certificates <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.9.0">since 0.9.0</a>

Leave **Skip TLS verification** disabled unless a trusted provider has
a certificate it cannot correct. It keeps the NNTP connection encrypted but
accepts an untrusted, expired, or hostname-mismatched certificate. This permits
a man-in-the-middle attacker to impersonate the provider and read credentials.

## Routing and pipelining

| Setting | What it does |
|---|---|
| Cascade routing<br/>`usenet.cascade.enabled` | Prefer providers in drag order; off = shared pool. Thinly-spared primaries (≤25% free) yield to idler peers; a larger Provider Connection Limit alone does not outrank priority. Default off. |
| Re-probe primary<br/>`usenet.cascade.retry-primary-on-miss` | After a clean 430/451 on the first batch attempt, try the primary once more before cascading (multi-node spool). Off = skip straight to backups. Only available with cascade routing on. Default on. |
| Queue pipelining<br/>`usenet.queue-pipelining.enabled` | Batch first-segment BODY requests during queue imports and Auto-tune. Default off. |
| Queue depth<br/>`usenet.queue-pipelining.depth` | Requests in flight per connection (1–64). Default `8`. |

Legacy keys `usenet.pipelining.enabled` / `usenet.pipelining.depth` remain honored; env vars use `NZBDAV_CONFIG__USENET__QUEUE_PIPELINING__*` for the new names.

Run Auto-tune before enabling queue pipelining. WebDAV streaming batching is a **separate** toggle on [Streaming](/v1/configuration/streaming/).

## Global download cap <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>

**Global Usenet bandwidth limit (Mbit/s)** under **Settings → Streaming**
(`usenet.bandwidth-limit-mbps`) caps total live Usenet payload ingress from
every provider. Queue downloads and WebDAV streaming share the cap. Cache hits,
LAN delivery, and the provider speed benchmark are not limited. Empty or `0`
means unlimited; values above 100,000 Mbit/s are treated as 100,000. The value
reloads without restart. 1 MB/s = 8 Mbit/s. The cap cannot make a
latency-limited provider faster.

See [NNTP pipelining](/v1/features/nntp-pipelining/) and [Multi-provider](/v1/features/multi-provider/).

## Warm connections <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.0">since 1.2.0</a>

Each pooled provider keeps a small floor of pre-connected, authenticated NNTP sockets
ready so playback and queue work skip the connect/TLS/login handshake after idle
periods. Warm sockets count against the provider's connection limit but never hold
download permits. See [Connection warming](/v1/features/connection-warming/) for the
mechanics and the header indicator.

| Setting | What it does |
|---|---|
| Warm connections<br/>`usenet.warm-connections.enabled` | Keep pre-connected sockets ready per provider. Not in the UI; set with `NZBDAV_CONFIG__USENET__WARM_CONNECTIONS__ENABLED`. Default on. |
| Warm floor<br/>`usenet.warm-connections.floor` | Idle sockets kept ready per provider, capped at the Provider Connection Limit. Before 1.5.0 the default was one sixth of the connection limit, clamped to 1–8. Not in the UI; set with `NZBDAV_CONFIG__USENET__WARM_CONNECTIONS__FLOOR`. Default `2`. |

Changes take effect on the next provider save or restart; connection pools are not
rebuilt when these keys change alone.

## Article-miss negative cache <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.9.0">since 0.9.0</a>

After a provider (or [storage group](/v1/features/multi-provider/)) reports a definitive article miss
(NNTP 430 or provider 451), infinidysk remembers that miss so later streaming/batch reads skip
re-probing the same provider for the same article until the TTL expires. Transient failures
(timeouts, network, corrupt articles) are never cached.

| Setting | What it does |
|---|---|
| Miss TTL<br/>`usenet.article-miss-cache-ttl-seconds` | Seconds a miss stays cached (clamped 30–86400). Default `300`. |
| Miss max<br/>`usenet.article-miss-cache-max-entries` | Cap before the oldest entries are evicted (clamped 100–1000000). Default `10000`. |

The cache clears automatically when Usenet providers are reconfigured.

## Provider circuit-breaker cooldown <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>

When a provider's circuit trips, that provider is skipped for a cooldown and traffic goes to
the remaining providers. Each consecutive trip doubles the cooldown up to a ceiling. A
successful article body resets it to the initial value.

| Setting | What it does |
|---|---|
| Initial cooldown (seconds)<br/>`usenet.circuit-breaker.initial-cooldown-seconds` | Cooldown applied on the first trip (clamped 5 to 300). Not in the UI; set with `NZBDAV_CONFIG__USENET__CIRCUIT_BREAKER__INITIAL_COOLDOWN_SECONDS`. Default `60`. |
| Maximum cooldown (seconds)<br/>`usenet.circuit-breaker.max-cooldown-seconds` | Ceiling the doubling stops at (clamped 5 to 3600). Not in the UI; set with `NZBDAV_CONFIG__USENET__CIRCUIT_BREAKER__MAX_COOLDOWN_SECONDS`. Default `300`. |

Lower the initial cooldown when a single pool provider carries the traffic and the backups are
metered blocks. A brief wobble then spends fewer backup bytes before the primary is re-probed.
A maximum below the initial value is raised to it. The connection pools read both values when
they are built, so a change applies on the next restart or provider save.

Once the cooldown lapses, one request is admitted as a half-open probe. If that request is
abandoned before it returns an outcome, the probe slot stays claimed for up to 60 seconds
before another request can retake it. A cooldown shorter than that will not always re-probe as
quickly as the number suggests.
