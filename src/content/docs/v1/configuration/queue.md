---
title: "Queue"
---
Queue settings control how many NZBs can wait and process at once, plus the
provider connections available to active imports.

:::tip[Headless ENV]
Map config keys below to `NZBDAV_CONFIG__...` with the
[naming algorithm](/v1/configuration/headless/#naming-algorithm)
(`queue.worker-count` → `NZBDAV_CONFIG__QUEUE__WORKER_COUNT`).
:::

## Processing capacity

| Setting | What it does |
|---|---|
| Concurrent Queue Downloads <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.9.0">since 0.9.0</a><br/>`queue.worker-count` | Process 1–10 NZBs concurrently; the oldest active item is preferred. Default `1`. |
| Queue Download Connections<br/>`usenet.max-queue-connections` | Provider connections shared by queue workers and background health checks. Default blank = all. |

Adding workers does not add provider capacity. Additional workers use spare
connections from the same queue budget, so raising concurrency primarily lets
independent jobs make progress while the oldest item retains preferred access.

The headless-only `usenet.max-queue-connections-preset` supports
`low`/`medium`/`high`/`max` (25/50/75/100% of pooled provider connections).
An explicit `usenet.max-queue-connections` value takes precedence.

Playback has a separate connection budget and priority policy under
[Streaming](/v1/configuration/streaming/).

## Queue admission

| Setting | What it does |
|---|---|
| Maximum queued jobs <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.10.0">since 0.10.0</a><br/>`queue.max-items` | Reject new SAB submissions at this queue depth. Default `0` (unlimited). |
| Resume threshold <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.10.0">since 0.10.0</a><br/>`queue.resume-threshold` | Resume admission at or below this depth. Default `0`. |

At the maximum, infinidysk returns the standard SAB-compatible
`{"status": false, "error": "..."}` response without storing the NZB. Sonarr
and Radarr treat this as a temporarily unavailable download client and keep
automatic-search releases pending for a later retry.

The resume threshold adds hysteresis after the maximum is reached. Set it to
`0` to resume as soon as the queue drops below the maximum. Duplicate
submissions that replace an existing queue item remain allowed because they do
not increase queue depth.

## Download schedule <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>

| Setting | What it does |
|---|---|
| Download schedule<br/>`queue.processing-schedule` | JSON weekly windows that admit **new** queue downloads. Default empty (always on). |

Empty or disabled JSON is today's unrestricted behavior. Enabled schedules need at least one window. Weekdays are `0` (Sunday) through `6` (Saturday). Minutes are half-open `[start, end)` in the host's local timezone (container `TZ`). `end` before `start` is overnight. Active imports finish if a window closes; WebDAV playback is never gated. The scheduler never writes `queue.paused` — SAB `mode=pause|resume` remains the manual override. When only the schedule is closed, SAB `queue.paused` is `true` and `pause_int` is whole seconds until the next open window. Manual pause reports `pause_int` as `0`.

## Reordering <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.0">since 1.2.0</a>

Use the Queue page's up, down, or top controls to change waiting-job order.
Controls work across page boundaries and preserve the selected job while the
list refreshes. Queue priority remains the primary ordering rule: placing a job
beside a different priority adopts that priority. Moving a paused job into a
non-paused priority resumes it.

Active downloads remain pinned and are never interrupted by reordering. A job
can be promoted to the first waiting position, but cannot displace an active
worker.

## Stuck-item watchdog <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.1.0">since 1.1.0</a>

Each active queue worker runs a progress watchdog. A worker is treated as stuck
only when it makes no visible progress **and** fetches no segments for
`QUEUE_ITEM_STUCK_MINUTES` (default **5**) — long silent phases that keep
fetching (large PAR2 walks, archive header scans) are not penalized.

When an item stalls, infinidysk pauses it (`PauseUntil` ≈ 15–20 minutes with
jitter) and cancels the worker so the queue can move on; the item retries after
the pause expires. After a download stalls **3** times in total the item is
failed into history with a clear error, so Sonarr/Radarr can blocklist the
release and grab another one instead of waiting forever. The stall count is
cumulative for that enqueue (not reset by a later successful fetch), so a
release that wedges after a brief burst of progress still fails over.

Tune the stall budget with `QUEUE_ITEM_STUCK_MINUTES` when long phases legitimately
hold progress (large archives, full article-existence health checks).

[SABnzbd settings](/v1/configuration/sabnzbd/) · [Streaming settings](/v1/configuration/streaming/)
