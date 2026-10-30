---
title: "Health and repairs settings"
---
Background health monitoring, PAR2 reconstruction, and replacement of unhealthy library items.

:::tip[Headless ENV]
Map config keys below to `NZBDAV_CONFIG__...` with the
[naming algorithm](/v1/configuration/headless/#naming-algorithm)
(`repair.enable` → `NZBDAV_CONFIG__REPAIR__ENABLE`). A Library Directory and configured
[Arr instances](/v1/configuration/arrs/) are optional; they are only needed to replace linked library items.
:::

| Setting | What it does |
|---|---|
| Enable Background Repairs <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.5">since 1.2.5</a><br/>`repair.enable` | Enables health checks, PAR2, and damage tolerance; Library Directory + Arr are only needed for linked-item replacement. An explicit `false` still disables them. Existing installs that already saved `false` stay off. Default on <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>. |
| Maximum Health Check Connections <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.9.0">since 0.9.0</a><br/>`repair.healthcheck-concurrency` | Aggregate NNTP verification-connection limit shared by background checks and queue article validation (1–200, capped by pooled provider capacity). Default `50`. |
| Concurrent Health Checks <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a><br/>`repair.healthcheck-workers` | Library files checked at once (1–8). All checks share **Maximum Health Check Connections**; this setting never multiplies it. Default `1`. |
| Health Check Depth<br/>`repair.healthcheck-depth` | `quick` <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.4.0">since 1.4.0</a> / standard / enhanced / deep / complete. `quick` STATs only ~two dozen head/tail/stride segments per file regardless of size (bypassing the 8000-segment floor and the size/age curve) — a fast first pass that reliably tells an intact posting from one lost to takedown or retention. Small files may be fully sampled, but `quick` checks never run damage classification; pair them with a periodic deeper pass. Default `standard`. |
| Check older releases less thoroughly <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.8.0">since 0.8.0</a><br/>`repair.healthcheck-aging` | Aging taper. Default off. |
| Repair After Streaming Failures<br/>`repair.auto-remove-after-failures` | Consecutive streaming failures before urgent repair; `0` = qualify for urgent repair immediately (removal and replacement still wait for the repair schedule and **Defer Removal After Reads**). Failures below the threshold are counted in memory and reset when infinidysk restarts. Once the threshold is reached and the urgent repair is scheduled, that qualification is stored with the file and survives restarts; raising the threshold afterwards defers the repair again until the new threshold is met. Default `0`. |
| Defer Removal After Reads (minutes) <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.6.3">since 1.6.3</a><br/>`repair.read-hold-minutes` | Minutes (`0`–`1440`) a file stays available after its last observed read before automatic removal or replacement. `0` turns the hold off. See [Recent-read hold](#recent-read-hold). Default `15`. |
| Auto-remove unlinked files only<br/>`repair.auto-remove-unlinked-only` | At the threshold, linked items are removed and blocklisted through Arr instead of force-deleted. Default on. |
| Enable degraded damage tolerance <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.0">since 1.2.0</a><br/>`repair.degraded-tolerance-enabled` | Keep slightly damaged videos playable instead of replacing the release. When off, every missing or corrupt article found during playback counts toward repair. Default on. |
| Track corrupt articles during playback <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.0">since 1.2.0</a><br/>`repair.corruption-tracking-enabled` | Record streaming-confirmed corrupt articles, include them in health classification, and skip the retry storm on later reads. Only controls persistence; corruption still counts toward repair when tolerance is off. Default on. |
| Max consecutive missing segments<br/>`repair.degraded-max-consecutive-missing` | Longest tolerable run of adjacent holes (1–2). Default `2`. |
| Max total missing segments<br/>`repair.degraded-max-total-missing` | Total tolerable holes per file (1–1000). Default `5`. |
| Max missing data (% of file)<br/>`repair.degraded-max-missing-byte-percent` | Tolerable hole share of file bytes (0.01–50). Default `1.0`. |
| Health-check schedule <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a><br/>`repair.healthcheck-schedule` | JSON weekly windows for **new** routine health checks. Default empty (always on). |
| Repair quiet hours <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a><br/>`repair.action-schedule` | JSON weekly windows for starting repairs. Default empty (always on). |
| Library Directory<br/>`media.library-dir` | Organized library root in the container — parent of your Arr root folders. Never the rclone mount or `/completed-symlinks`. Default empty. |

## PAR2 gap repair <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.0">since 1.2.0</a>

PAR2 can reconstruct missing or corrupt Usenet articles using parity in the retained NZB.
It does not require a Library Directory or an Arr instance; that prerequisite was removed
in 1.2.5. PAR2 gap repair is off by default: turn on both **Enable Background Repairs** and
**Enable PAR2 background repair**.

| Setting | What it does |
|---|---|
| Enable PAR2 background repair<br/>`repair.par2-enabled` | Reconstruct missing segments from parity in the background. **Enable Background Repairs** is the master switch. Default off. |
| Prefer PAR2 over Arr replacement<br/>`repair.par2-preferred-over-arr` | Try parity first; without an Arr replacement path, PAR2 is still attempted. Default on. |
| Max missing slices<br/>`repair.par2-max-missing-slices` | 1–64; applies to the combined unavailable slices in the recovery set, including damage found during source checks. Default `8`. |
| Max release size (GB)<br/>`repair.par2-max-release-gb` | 1–200; total recoverable source-volume size, checked before content reads. Default `16`. |
| Max memory (MB)<br/>`repair.par2-max-memory-mb` | 64–2048; conservative repair-owned working-memory budget, not total process memory. Default `256`. |
| Patch store cap (GB)<br/>`repair.par2-max-patch-gb` | 1–100; cataloged patch-body capacity; restart to apply a changed capacity. Default `4`. |
| Fetch concurrency<br/>`repair.par2-fetch-concurrency` | 1–8; upper bound for repair fetches, not a promise to parallelize every phase. Default `2`. |
| Failure cooldown (hours)<br/>`repair.par2-failure-cooldown-hours` | 1–168; failed or infeasible attempts are deferred, with at most three provider-repair attempts per job. Default `6`. |

Health checks and attributed streaming failures can request repair. Playback gap/corruption
reports enqueue background work; playback never waits for reconstruction. Until a patch is
available, reads retain their existing safe gap-fill or failure behavior. A gap fill does not
guarantee that an archive or media player can continue playback.

Repair checks PAR2 packet hashes and source-slice checksums, reconstructs unavailable slices,
and verifies every affected volume's whole-file MD5 before publishing any segment patches.
Only validated posted bytes are stored. Sources and parity are read through Usenet without
downloading or extracting a whole release to disk. One repair owner runs at a time across
health and playback requests; additional jobs wait without multiplying the memory budget.

The budget includes NZB/PAR2 metadata, source windows, reconstruction buffers, and staged
patches. Discovery, recovery scanning, source matching and identity probing also have fixed
internal work limits (for example, about 537 MB of scanning per phase). A recovery set must
contain 1–32,768 input slices. An unsupported layout, ambiguous identity, exhausted limit, or
insufficient parity produces a clear infeasible reason rather than guessed bytes.

## RAR and multipart repair <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.4.0">since 1.4.0</a>

Targeted repair supports current multipart items and legacy RAR items, including encrypted
posted volumes and unresolved lazy parts when their article geometry can be established.
PAR2 protects the **posted archive-volume bytes**, not the extracted movie or its decrypted
contents. Repair does not invoke archive extraction, decryption, or lazy member resolution.

Reported article IDs must belong uniquely to the mounted item's retained NZB. Filenames only
prioritize candidates: exact length plus a prefix hash or intact PAR2-verified slices establish
volume identity. Trusted persisted subsequences and consistent yEnc headers establish exact
article boundaries. NZB byte counts alone are not trusted; adjacent unavailable articles with
no exact boundaries can make repair infeasible.

One attempt uses **one recovery set** covering all reported volumes. It checks every recoverable
source for additional damage and reconstructs the union once. Reports spanning independent
sets are not combined. Multipart repair requires specific article IDs; full-file verify-all
and durable multipart degraded/corrupt indexes are not supported. Existing plain-NZB damage
tracking and verify-all behavior remain available.

See [PAR2 storage and diagnostics](/v1/operations/health-repairs/#par2-storage-and-diagnostics)
for restart persistence, storage cleanup, and progress reporting.

## Health-check and repair windows <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>

Same JSON shape as [download schedule](/v1/configuration/queue/#download-schedule-since-130): `{ "Enabled": true, "Windows": [{ "Days": [1,2,3,4,5], "StartMinute": 0, "EndMinute": 420 }] }`. Empty or disabled is unrestricted. Times use the host local timezone (container `TZ`).

Work already in progress finishes if a window closes. Closed health-check windows still admit urgent and already-deferred repairs. Closed repair windows defer confirmed damage until the next open repair window instead of reconstructing or replacing immediately. **Run all checks now** on the Health page opens checks (not repairs) until the due queue is empty, then the schedule resumes. Playback is never gated.

## Parallel health checks

`repair.healthcheck-workers` controls how many library files can make progress at once.
`repair.healthcheck-concurrency` remains the connection-pressure control, but is now shared by
every background worker and queue article-existence validation. For example, four workers with a
50-connection limit share those 50 admissions rather than receiving 50 each.

Existing numeric `repair.healthcheck-concurrency` values remain valid during upgrades, including
headless values outside the current effective range. infinidysk safely limits them at runtime to at
least one, at most 200, and no more than the total pooled provider capacity. Existing Compose files
therefore do not need to be changed before starting the new version.

New background checks continue to wait while queue items are active. If queue work starts while a
health check is already running, both paths share the aggregate admission limit and queue validation
receives released capacity before waiting background verification. Repair and urgent-repair behavior
inside each file check is otherwise unchanged.

Provider auto-tune pauses new health checks and waits for active checks to release their verification
connections before opening benchmark connections, so parallel workers cannot skew the measured limit.

## Re-check after provider changes <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.0">since 1.2.0</a>

Changing Usenet providers can affect which library files are available. After saving provider changes,
infinidysk offers to queue your library for a health re-check. This requires Background Repairs to be
enabled; urgent repairs already queued from streaming failures keep their priority.

:::note[Streaming failure repair requires Background Repairs]
**Repair After Streaming Failures** (`repair.auto-remove-after-failures`) only takes effect when
**Enable Background Repairs** (`repair.enable`) is on. A Library Directory and Arr are only
needed to replace linked library items. Without them, PAR2 can still reconstruct the file and
threshold-based removal can delete unlinked items.
:::

`repair.auto-remove-after-failures` applies only to streaming-triggered failures such as missing
articles, corrupt archives, and seeks that find missing or truncated article data. With a value
greater than `0`, infinidysk waits for that many consecutive failures before it starts an urgent
repair. At the threshold, linked library items are removed and their original downloads are marked
failed in Arr when **Auto-remove unlinked files only** is enabled. Arr blocklists those releases
and applies its configured failed-download redownload policy. Unlinked files are removed. Disable
that option to force-delete linked items at the threshold. With the default value `0`, failed
unlinked files are kept and surfaced as **Action needed**; set a value greater than `0` to
auto-remove them after repeated failures.

For linked files downloaded before Arr provenance tracking was available, infinidysk first tries
to recover the original download from exact Arr import history, then falls back to the retained SAB
`nzo_id`. Arr must still confirm grabbed history for that ID before infinidysk removes the media,
marks the download failed, or requests a replacement. If that history has expired, the file remains
untouched and is surfaced as **Action needed** instead of risking the wrong release.

Successful full-file playback and a successful background health check reset the in-memory failure
count. The count resets when infinidysk restarts, so it is intentionally not a durable replacement for
health checks.

### Recent-read hold <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.6.3">since 1.6.3</a> {#recent-read-hold}

**Defer Removal After Reads** (`repair.read-hold-minutes`, default `15`, range `0`–`1440`) keeps a
file available while it is being played. Before any automatic removal or replacement, infinidysk
checks when the file was last read through WebDAV or the in-app player. If that read is more recent
than the hold, the removal waits and the file is shown as **Action needed** until the hold expires.
Each new read renews the deadline. Every path that points at the same library file (for example
`/content` and `/.ids` aliases) shares one hold.

- PAR2 reconstruction still runs first; the hold only delays removal and replacement.
- Urgent repairs keep their urgent status while held and resume as urgent once the hold expires.
- The same hold protects removals found by routine background health checks.
- Set `0` to restore removal in the next repair slot, as in earlier releases.
- Set it with `NZBDAV_CONFIG__REPAIR__READ_HOLD_MINUTES` for headless installs.

Limits:

- The hold is based on the last read infinidysk saw, not on the player's state. A pause, or
  playback served entirely from a player or rclone cache, longer than the hold is not protected.
- Read history and pending hold deadlines are kept in memory, so a backend restart clears them.
  Urgent repair qualification is stored with the file and survives the restart.
- Changes apply on the next repair attempt without a restart. A repair already waiting keeps its
  current deadline; lowering or disabling the hold does not shorten it.
- The hold cannot retract an Arr removal that already started before a new read arrived.

## Degraded damage tolerance <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.0">since 1.2.0</a>

Degraded damage tolerance is on by default. With it off, playback still zero-fills short gaps
so a stream is not cut on the first missing article, but every confirmed missing or corrupt
article counts toward **Repair After Streaming Failures** (`repair.auto-remove-after-failures`)
and starts an urgent repair at the threshold <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.6.0">since 1.6.0</a>.
The same applies to files without a playback damage budget even while tolerance is on.

### Zero-tolerance replacement <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.6.0">since 1.6.0</a>

To replace a release as soon as one article is confirmed missing or corrupt:

1. Turn on **Enable Background Repairs**.
2. Turn off **Enable degraded damage tolerance**.
3. Leave **Repair After Streaming Failures** at `0`.
4. Configure a Library Directory and an enabled Arr instance for linked replacement.

PAR2 reconstruction runs first when **Enable PAR2 background repair** is on and preferred; disable the
preference to go straight to Arr. A background PAR2 repair that cannot rebuild the damage also
queues an urgent replacement. "Immediately" means the file qualifies for urgent repair at once;
removal and replacement still wait for the next urgent health-queue slot, the repair schedule, and
the [recent-read hold](#recent-read-hold) (15 minutes after the last read by default). Set
**Defer Removal After Reads** to `0` to replace in the next slot even during playback.

Limits:

- Corruption is detected only when article bodies are read: playback, PAR2 verification, or a
  health check re-reading articles already recorded as corrupt. Routine STAT health checks do
  not download bodies, so a corrupt file that is never read is not detected.
- Damage with a valid yEnc CRC (a bad encode posted intact) cannot be detected.
- Arr replacement still requires a library link, the original download in Arr history,
  an allowed repair window, and room under replacement-loop protection and search budgets.
  Otherwise the file is surfaced as **Action needed**.

When numbered NZB entries omit an interior part and the articles' yEnc metadata
corroborates that posted layout, import preserves a missing slot. Playback uses
the existing gap-fill behavior to keep later bytes at their correct offsets.
The real articles are still checked; the generated slot is handled locally and
assessed by the normal health/repair workflow under the configured schedules.
Small holes may remain playable, and matching PAR2 data may repair them.
Playback and repair are not guaranteed, especially for archive metadata or
damage beyond configured limits. Existing mounts need reimport to gain the
corrected layout; they are not rewritten during upgrade.

Health checks of plain video files no longer treat every missing Usenet segment as fatal.
When a Standard, Enhanced, or Deep check covers **every** segment of an eligible file (files up
to 8000 segments before aging, or any larger file whose sample still covers everything),
infinidysk sweeps up all confirmed misses and classifies the damage instead of aborting on the
first one. **Complete** checks always qualify. **Quick** checks never classify damage, even when
their small file sample covers every segment. With `repair.healthcheck-aging` enabled, releases
old enough to be sampled are not classified.

- **Healthy** — no confirmed holes. A segment whose primary article is gone but that is still
  fetchable through a fallback Message-Id counts as servable, not a hole.
- **Degraded** — holes within all three caps (longest consecutive run, total count, and share
  of the file's bytes) in a container that tolerant decoders can resync past. The file stays
  mounted, playback zero-fills the gaps, and **no Arr repair is triggered**. The confirmed
  holes are recorded on the item so the status survives restarts; later playback fills them
  without sending a provider BODY request. A local PAR2 patch or segment-cache entry still wins
  over a gap fill, and the next full health sweep detects a provider-side recovery.
- **Failed** — over any cap, any hole in an unsafe layout, or an unrecognized container.
  These take the normal repair path (PAR2 reconstruction first when enabled, then Arr
  remove-and-replace when a linked library item has an enabled Arr instance). Without an Arr
  replacement path, the file remains mounted as **Action needed**.

Eligible containers: `.mkv`, `.mk3d`, `.webm`, `.ts`, `.m2ts` (resync at cluster/packet
boundaries) and `.mp4`/`.m4v`/`.mov`, whose layout is probed once from a bounded read of the
file head: fast-start and fragmented MP4 can tolerate mid-stream holes, while **moov-at-end
MP4 is fatal on any segment loss** because the moov atom lives in the file tail — holes
overlapping the moov atom region at the start of a fast-start MP4 are also fatal. Offset-
sensitive formats (`.avi`, …) and non-payload files are never classified; they keep the
legacy abort-on-first-miss behavior. A missing first segment is always fatal.

Degraded verdicts compose with the rest of the repair pipeline:

- **PAR2 first.** When PAR2 gap repair (`repair.par2-enabled`, off by default) is enabled and preferred,
  reconstruction is attempted with the full hole list before any verdict; success records a
  healthy, PAR2-repaired result and clears any recorded holes.
- **Rechecks can escalate or recover.** Degraded files stay on the normal
  [age-doubling recheck schedule](/v1/operations/health-repairs/#when-files-are-rechecked).
  If damage grows past a cap, the next check fails the file and repair
  proceeds; if the missing articles reappear (provider-side restoration), the record clears
  itself and the file returns to healthy.
- **Playback enforces the same caps.** <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.6.0">since 1.6.0</a>
  While tolerance is on, playback of an eligible file pads over confirmed holes only while the
  recorded holes (including tracked corrupt articles) plus those found during the current
  stream stay within all three caps. A run of adjacent holes may reach the consecutive cap.
  The first hole that breaks a cap, or any hole in the first segment, stops the read and
  schedules an urgent repair through the normal streaming-failure path
  (`repair.auto-remove-after-failures`). Later reads keep failing until the playback
  observations expire five minutes after the last hole. Ineligible files, and files imported
  before segment byte ranges were recorded, keep the fixed limit of two padded segments in a
  row, and each confirmed hole counts toward repair.

Degraded files appear on the [Health page](/v1/operations/health-repairs/) with a warning
badge, a dedicated history filter, and an overview stat card.

## Realtime corruption detection <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.2.0">since 1.2.0</a>

A corrupt-but-present article (right size, STAT succeeds, yEnc CRC fails) used to play as
silent garbage. infinidysk now detects that on the playback path:

1. **Detect** — yEnc CRC failures surface as corrupt articles, including trailer-CRC
   corruption on exact-size segments in the unbuffered first-segment reader.
2. **Re-fetch / failover** — the reader retries across providers, then sibling donor
   Message-Ids, then gap-fills a known-length hole so later bytes stay aligned. There is
   **no synchronous PAR2** on the read path (reconstruction stays in the background).
3. **Record** — persistently corrupt segment IDs are stored on the file payload when
   `repair.corruption-tracking-enabled` is on (the default whenever Background Repairs is
   on). Later reads of those IDs probe once instead of repeating the retry storm.
4. **Classify** — full-coverage health sweeps union remaining recorded corruption with
   STAT holes, so a present-but-corrupt file is no longer reported Healthy. With degraded
   tolerance off, non-Quick checks re-read recorded corrupt articles; still-corrupt articles
   fail the file and clean ones clear the record.
5. **Escalate** — when playback actually breaks, or when tolerance is off and corruption is
   padded over, the same streaming-failure path used for missing articles runs: PAR2-first
   when enabled, then Arr remove-and-blocklist for linked library items with an enabled Arr
   instance.

Disable **Track corrupt articles during playback** if you need the previous retry-only
behavior. Corruption still counts toward repair whenever Background Repairs is on and no
damage budget applies.

[Health and repairs](/v1/operations/health-repairs/)

## Replacement-loop protection <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v0.9.4">since 0.9.4</a>

When Arr imports a download instantly (for example over an rclone mount), a broken release can
import before any health check runs. Marking an already-imported download failed does
not reliably blocklist it, so Arr could re-grab the identical release and loop. Two safeguards
break that cycle:

- **Fail re-grabs before import.** Releases rejected by repair are remembered: when repair removes
  a broken download and marks it failed, the release's article ids are recorded (as are articles
  found definitively missing while downloading or streaming). Successful **Remove, Blocklist** and
  **Remove, Blocklist, Search** [queue-rule actions](/v1/configuration/arrs/) record
  the same in-process evidence. A re-grabbed NZB containing any remembered article fails while
  still in the download queue, before import or Usenet article requests. The bounded memory resets
  on restart and entries can be evicted; a loop that survives a restart is stopped again after one
  extra cycle.
- **Per-file repair rate limit.** After repair has removed 3 downloads for the same library file
  (the same episode or movie file path — not the whole series or folder) within 6 hours, further
  repairs for that file are deferred for a day and surfaced as **Action needed** in the health
  screen instead of triggering another replacement.

[Health and repairs](/v1/operations/health-repairs/)
