---
title: "Streaming"
---
Streaming settings tune how WebDAV playback uses provider connections, memory,
caching, and retries. WebDAV credentials and filesystem behavior remain under
[WebDAV](/v1/configuration/webdav/); queue capacity is under [Queue](/v1/configuration/queue/).

:::tip[Headless ENV]
Map config keys below to `NZBDAV_CONFIG__...` with the
[naming algorithm](/v1/configuration/headless/#naming-algorithm)
(`usenet.streaming-priority` → `NZBDAV_CONFIG__USENET__STREAMING_PRIORITY`).
:::

## Connection allocation

| Setting | What it does |
|---|---|
| Max Download Connections<br/>`usenet.max-download-connections` | Streaming connection budget. `0` (the Auto toggle) uses all Pool provider connections. Default `0`. |
| Apply limit per stream<br/>`usenet.max-download-connections-per-stream` | Give each concurrent stream its own budget. Default off. |
| Per-stream performance<br/>`usenet.max-download-connections-per-stream-preset` | Low/Medium/High/Max = 25/50/75/100% of the budget per stream. Shown when Apply limit per stream is on. Default `high`. |
| Streaming Priority (vs Queue) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.9.0">since 0.9.0</a><br/>`usenet.streaming-priority` | Percentage favored for playback when streaming and queue imports overlap. Default `80`. |

Provider limits still cap total connections. Spare capacity is not held idle
for playback; the priority setting only affects admission when a provider pool
is saturated.

:::tip[Speed tuning]
Raise **Max Download Connections** until throughput plateaus without
pegging CPU. Baseline with a host speed test, then time a `/view` download
from inside the container against the backend.
:::

## Streaming performance

| Setting | What it does |
|---|---|
| Enable Segment Cache (fast storage)<br/>`usenet.segment-cache.enabled` | Cache decoded segments on disk; restart required. Default off (new installs). |
| Cache path<br/>`usenet.segment-cache.path` | Segment-cache directory. Default `/config/segment-cache`. |
| Maximum size (GB)<br/>`usenet.segment-cache.max-gb` | Segment-cache size limit. Default `10`. |
| Cache write-behind <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a><br/>`usenet.segment-cache.write-behind-mb` | Restart-required RAM budget for asynchronous cache writes, in units of 1,048,576 bytes. `0` keeps inline writes; nonzero values are 16–1024. Not in the UI; set with `NZBDAV_CONFIG__USENET__SEGMENT_CACHE__WRITE_BEHIND_MB`. Default `0`. |
| Streaming Segment Timeout<br/>`usenet.streaming-segment-timeout-seconds` | Per-segment deadline, 2–40 seconds. Default `8`. |
| Streaming Read Timeout <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.9.0">since 0.9.0</a><br/>`usenet.streaming-read-timeout-seconds` | Initial 5–120 second wait to open a GET/range. Default `30`. |
| Streaming Write Timeout<br/>`usenet.streaming-write-timeout-seconds` | Per-write deadline, 0–600 seconds (0 disables); also cancels a stream that transfers less than 65,536 bytes (about 66 KB) per timeout window while other streams wait on Article RAM. Default `60`. |
| Streaming Segment Retries<br/>`usenet.streaming-segment-retries` | Fresh-connection retries after timeout, 0–5. Default `3`. |
| Article Buffer Size<br/>`usenet.article-buffer-size` | Articles buffered ahead per stream. Default `40`. |
| In-flight article budget (MiB) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.9.0">since 0.9.0</a><br/>`usenet.in-flight-article-budget-mb` | Host-wide decoded-byte cap. Auto uses 25% of the detected managed-heap ceiling, clamped to 64–8192; explicit values use the same range. Default auto. |
| Global Usenet bandwidth limit (Mbit/s) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a><br/>`usenet.bandwidth-limit-mbps` | Process-wide cap on live provider BODY/ARTICLE payload ingress for queue and WebDAV. Empty or `0` is unlimited; the ceiling is 100,000 Mbit/s. 1 Mbit/s = 125,000 bytes/s. Provider speed tests, cache hits, and LAN delivery are never limited. Takes effect immediately. A cap cannot raise a latency-limited workload. Default unlimited. |
| Idle connection timeout (seconds)<br/>`usenet.idle-connection-timeout-seconds` | Close unused connections after 15–300 seconds; also sets the [connection warming](/v1/features/connection-warming/) sweep and keepalive cadence. Default `60`. |
| Read-start warm-up <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a><br/>`usenet.read-start-warmup.enabled` | Expand pooled-provider connections in parallel when a long buffered WebDAV read starts; captured when each stream opens. Skipped for a provider that is backing off after a failed connection open. Not in the UI; set with `NZBDAV_CONFIG__USENET__READ_START_WARMUP__ENABLED`. Default on. |
| NNTP response timeout (seconds) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a><br/>`usenet.nntp-read-timeout-seconds` | Stalled-read inactivity deadline for BODY, ARTICLE, STAT, authentication, and other NNTP responses, 5–120 seconds. This is not a total transfer deadline. Streaming segment/read budgets and the 15-second connect/auth ceiling can expire first. Takes effect on the next provider-pool rebuild or restart. Default `30`. |
| Fresh Connection Open Timeout <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.4.0">since 1.4.0</a><br/>`usenet.connection-open-timeout-seconds` | Advanced budget for fresh TCP/TLS/AUTHINFO connection creation, 1-15 seconds. Applies to subsequent attempts without rebuilding live pools. Default `5`. |
| Replacement reconnect spacing (milliseconds) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a><br/>`usenet.reconnect-delay-milliseconds` | Minimum spacing between replacement handshakes after a poisoned connection is closed, 0–5000 milliseconds. Zero disables ordinary replacement spacing; TCP/TLS/AUTHINFO factory failures still back off from a 500 ms floor, doubling up to 60 seconds. Takes effect on the next provider-pool rebuild or restart. Default `500`. |
| Batched article downloads<br/>`usenet.pipelined-body-requests` | Fetch WebDAV BODY requests in small batches. Default on. |
| Streaming batch width <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.0">since 1.2.0</a><br/>`usenet.streaming-body-batch-width` | Maximum articles per BODY batch (1–8). Default `4`. |
| Container-aware gap fill <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.10.0">since 0.10.0</a><br/>`usenet.container-aware-fill` | MPEG-TS null-packet fill for confirmed gaps. Default on. |

The NNTP stalled-read timeout, streaming segment timeout, streaming read budget, fresh
connection-open timeout, and idle connection timeout are separate deadlines. The fresh-open
clock starts when TCP/TLS/AUTHINFO connection creation begins, after local capacity admission,
handshake queueing, and replacement pacing. Those waits and BODY/ARTICLE transfer time are
outside this budget. Queue waits still honor caller cancellation and shutdown; the fresh
connection-open setting is not a total acquisition deadline. See [provider acquisition waits](#provider-acquisition-waits)
for the conditional failover budget and circuit-trip behavior. The fresh connection-open timeout
is read by subsequent attempts without rebuilding live pools; the other captured pool settings
require a provider-pool rebuild or restart before they change.

### Provider acquisition waits <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.4.3">since 1.4.3</a> {#provider-acquisition-waits}

When another eligible provider has capacity, BODY/ARTICLE acquisition has one
15-second wait budget across local admission, pool queueing, handshake queueing,
creation-capacity waits, and replacement pacing. The budget ends when an idle
socket is claimed or a fresh connection starts opening. Expiry tries the next
provider; it does not mark the waiting provider unhealthy. Without an eligible
alternative, foreground waits remain subject to caller cancellation and shutdown.

A circuit trip stops pending acquisitions, including queued warm-up work. It does
not cancel factories or transfers that have already started. If the trip was
caused by a fresh-connection open timeout, immediately available established
sockets can still serve requests. They do not clear the circuit: recovery needs
a successful fresh-connection probe after cooldown. Command-failure circuits do
not have this idle-socket exception. Warm-up does not open new sockets while the
circuit is open or half-open.

Warm-up opens are judged differently from foreground opens <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.5.0">since 1.5.0</a>.
While the provider has at least one established connection, a failed or timed-out warm-up
open (warm-floor refill or read-start warm-up) never trips the circuit: the pool backs off
its own handshakes (500 ms doubling to 60 seconds), warm-up retries on a later sweep, and a
throttled warning names the reason. On a provider with no established connections a warm-up
open timeout still trips the circuit, so an unreachable provider is skipped before the first
request. Warm-floor refills use a connection-open budget of at least 10 seconds; read-start
warm-up keeps the configured fresh connection-open budget because it shares handshake slots
with playback.

The fresh TCP/TLS/AUTHINFO budget defaults to 5 seconds
<a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.5.1">since 1.5.1</a>
(3 seconds in 1.4.3–1.5.0), with the same supported 1-15 second range. The new default applies
only when the setting is unset or unparsable; saved values (including an explicit 3) and
environment-managed values are unchanged. The value applies to subsequent opens without a pool
rebuild. Warm-floor refills use the larger of this value and 10 seconds. It does not change
transfer deadlines, and the acquisition and socket-open budgets are separate, not one total
timeout.

### Segment-cache storage

Segment Cache is **off by default on new installs**
<a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>.
Installs upgraded from an earlier release that never changed the setting keep the cache
**on**: the upgrade pins the previous effective value so behavior does not change
silently. Review it under **Settings → Streaming** and turn it off if you do not need it.

When enabled, the cache can improve repeated reads and seeks, but it also writes decoded
segments to the cache path. infinidysk does not automatically
classify that storage, so verify that `/config/segment-cache` (or your configured
path) is local SSD/NVMe or other storage that can safely absorb the extra writes.
Disable the cache for slow disks, network mounts, or flash storage with limited
write endurance; alternatively, point **Cache path** at suitable local storage.

When Segment Cache is **disabled** at startup, infinidysk purges any leftover cache
files from the cache path in the background so a previously enabled cache does not
keep occupying disk. Only files matching the cache layout are removed; unrelated
files placed in that directory are left alone.
<a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>

### Segment-cache write-behind

With the default value `0`, each decoded segment is written to storage before
the same bytes continue through the playback drain. On slower bind mounts,
overlay filesystems, or network storage, that can apply disk backpressure to
the Usenet socket.

Set `usenet.segment-cache.write-behind-mb` to 16–1024 to copy completed segment
bodies into bounded pooled memory and publish them from one FIFO background
writer. This budget is additional to the in-flight article budget. The writer
also caps queued plus active jobs at 256. When either limit is full, the new
cache write is skipped rather than delaying playback.

Write-behind makes cache publication asynchronous. An immediate second read can
miss and fetch the segment again until the writer publishes both body and header.
Disk failures remain best-effort and do not fail playback. The Support memory
snapshot reports the configured budget, reserved and peak physical buffer bytes,
queued/active jobs, and capacity skips.

The setting is advanced-only and has no Settings control. Configure
`NZBDAV_CONFIG__USENET__SEGMENT_CACHE__WRITE_BEHIND_MB`, then restart the
container. Set it back to `0` and restart to restore inline writes.

### Segment cache and rclone read-ahead

Symlink libraries stream through an rclone mount. When that mount runs with
`--vfs-read-ahead`, rclone already buffers ahead of playback, and Segment Cache only
adds disk writes without improving seeks. Keep one or the other: the
[Setup Guide](/v1/getting-started/setup-guide/) disables Segment Cache for Symlinks
and recommends the bounded rclone VFS cache instead.

infinidysk cannot always inspect the mount, so the Streaming tab shows a dismissable
warning whenever Segment Cache is on for a Symlinks library. Dismissal is remembered
per browser. When the [rclone RC connection test](/v1/configuration/rclone/) can read VFS statistics
and confirms read-ahead is enabled, the Rclone tab shows a definitive warning instead.
Re-run the Setup Guide from the main navigation to review this and other recommended
settings, even on an existing installation.

## Article buffer and adaptive prefetch

`usenet.article-buffer-size` bounds how many decoded articles a stream may keep
ahead of the consumer. The in-flight article budget separately caps decoded
bytes across all concurrent streams.

When **Batched article downloads** is on, WebDAV BODY requests start in
batches of up to the configured streaming batch width (default four articles
on one connection). If playback starves waiting for the next segment,
infinidysk narrows that batch width (`4 → 2 → 1`) so more connections can
work in parallel. The width recovers gradually when the consumer remains
ahead, but never above the configured maximum.

The segment task window and prefetch byte ceiling are computed once at stream
construction from the initial batch width and article buffer. Adaptive
narrowing does not shrink those ceilings — only future batch sizes. Leave the
width at the default unless you have measured a benefit; wide settings can
starve other concurrent streams via the shared in-flight article budget.

## Container-aware gap fill

After every provider and fallback Message-ID confirms an article is missing or
corrupt, infinidysk normally emits the same number of zero bytes to preserve
later file offsets. For direct MPEG-TS files (`.ts`, `.m2ts`, `.mts`),
container-aware gap fill emits packet-aligned null packets instead when exact
segment offsets are available.

This can help compatible players resynchronize sooner, but cannot restore
missing audio or video. Matroska, MP4/MOV, archive-backed files, and transient
transport failures retain their existing behavior.

## Shared streams for concurrent readers <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.0">since 1.2.0</a>

Players often issue a probe GET and a playback GET for the same file at the
same time. Shared streams join those overlapping requests onto one Usenet
fetch when their byte offsets are close enough, instead of opening a private
stream per request.

| Setting | What it does |
|---|---|
| Share one stream across concurrent readers<br/>`usenet.shared-streams.enabled` | Master switch; off restores a private stream per request without a restart. Default on. |
| Max shared streams<br/>`usenet.shared-streams.max-entries` | Global cap on live shared streams (1–32). Default `4`. |
| Max regions per file<br/>`usenet.shared-streams.max-entries-per-file` | Separate streams for far-apart offsets of the same file (1–8). Default `3`. |
| Ring size (MiB)<br/>`usenet.shared-streams.ring-mb` | Recently fetched bytes late joiners can read without refetching (4–256). Default `32`. |
| Grace period (seconds)<br/>`usenet.shared-streams.grace-seconds` | Keep a stream warm after the last reader disconnects (0–60). Default `10`. |
| Small-range skip (MiB)<br/>`usenet.shared-streams.small-range-max-mb` | Closed ranges at or below this size stay private unless they already overlap a live stream (1–256). Default `16`. |

HEAD requests never join a shared stream. Unsatisfiable ranges still return
416 before any stream is opened. A declined attach uses today's private-stream
path unchanged.

Ring bytes are rented from `ArrayPool` as needed and returned when readers
catch up or the entry is torn down. Support packs and Prometheus report:

- `sharedStreamRingConfiguredMaxBytes`: max entries × ring size (about 134 MB
  at the defaults). This is the theoretical ceiling under sustained maximal
  divergence on every slot at once.
- `sharedStreamRingLogicalBytes`: decoded bytes currently sitting in ring
  chunks (reader divergence plus about 4.2 MB of lead data in the steady state).
- `sharedStreamRingRetainedBytes` / `…Peak`: actual `ArrayPool` array
  capacity currently (and ever) rented by those chunks. Bucket sizes are
  typically larger than the requested chunk length.
- `sharedStreamPumpScratchRentedBytes`: the pump's separate scratch buffer,
  counted in its own category.

Returning an array to `ArrayPool` does **not** give those pages back to the
OS; process working set can stay elevated after the counters drop. Ring bytes
are **not** leased from the in-flight article budget. A dedicated retention
cap will be added only if field support packs show shared-ring rented
capacity contributing to memory-pressure events or occupying a large fraction
of the container limit.

Disable shared streams if you need a guaranteed private prefetch window per
client, or if a support pack shows ring retention competing with Article RAM
on a small host.

## Capturing a buffering support pack

1. Use `LOG_LEVEL=INFO` so routine debug activity does not evict streaming events.
2. Enable **Developer stream tracing** under **Settings → Support**.
3. Reproduce the stall by playing the file from Files so the read goes directly through `/view`.
4. Download the support pack immediately after reproducing the problem.

[Streaming and seeking](/v1/features/streaming-seeking/) ·
[NNTP pipelining](/v1/features/nntp-pipelining/) ·
[Logs and crash dumps](/v1/operations/logs-crash-dumps/)
