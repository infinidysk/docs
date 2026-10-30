---
title: "Streaming and seeking"
---
Players issue HTTP range requests; infinidysk fetches the corresponding Usenet articles and serves bytes on demand.

## Performance levers

| Area | Settings |
|------|----------|
| Connection budget | **Settings → Streaming → Max Download Connections**, per-stream presets, **Streaming Priority (vs Queue)** |
| Latency | Segment timeout/retries, article buffer size, idle connection timeout |
| Throughput | [NNTP pipelining](/v1/features/nntp-pipelining/) (queue and streaming toggles), provider connection limits |
| Local smoothing | Optional Segment Cache; rclone VFS cache for symlink mounts |

Tune one setting at a time: raise connections until speed plateaus without pegging the CPU.
See [Streaming settings](/v1/configuration/streaming/).

## Playback automation

[Watchdog](/v1/features/warden-watchdog-preflight/) retries alternate releases when playback fails. [Preflight](/v1/features/warden-watchdog-preflight/) can warm candidates ahead of a click. [Watchtower](/v1/features/watchtower/) resolves list titles before you need them.

## Conflicting yEnc metadata <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.4.2">since 1.4.2</a>

A confirmed numbered omission is different from an unproved metadata conflict.
When sparse NZB numbering and the articles' yEnc geometry corroborate an omitted
interior part, import preserves its missing slot so later bytes keep their offsets.
Sparse labels alone are not enough: a complete post numbered `1,3` remains a
two-article file when its headers describe two contiguous parts. See
[Degraded damage tolerance](/v1/configuration/repairs/#degraded-damage-tolerance-since-120)
for gap filling, repair limits, and the reimport requirement for existing mounts.
This layout check is not a PAR2 identity proof and does not excuse conflicting
article metadata.

Some articles declare positive part counts or file sizes that conflict with the NZB and PAR2 metadata. When import finds a matching file prefix and complete, checksum-verified PAR2 file and slice metadata, it can use PAR2-verified reads for that file. A matching prefix selects the candidate file; it does not establish the integrity of later bytes.

Reads within the first 16,384 bytes verify that complete prefix against the checksum in the PAR2 file description. This keeps archive-header discovery bounded. Reads beyond that prefix buffer and verify an entire PAR2 slice using both MD5 and CRC32 before returning any bytes. This includes seeks, cached content, and physical archive volumes. Failed verification is retried against eligible providers; if verification still fails, the read fails without returning the unverified bytes. Article CRC validation and ordinary provider fallback remain enabled. Checksum-failing combinations of alternate article IDs are not exhaustively searched.

Uncached short reads can therefore download several megabytes, depending on the release's PAR2 slice size. Supported slices are at most 33,554,432 bytes (about 33.5 MB). PAR2 discovery is bounded to about 33.5 MB, 64 articles, about 2.1 MB per decoded article, and 30 seconds per import. Missing, incomplete, conflicting, or unsupported PAR2 proof does not authorize relaxing the yEnc count check.

Retry failed imports, or reimport already-mounted releases, to record the new proof. Existing mounts are not rewritten automatically. Files whose first inspected header does not expose a positive metadata conflict retain the ordinary read path; later conflicting headers may still be rejected. This recovery path does not change the separate PAR2 repair-discovery workflow or verify an entire file during import. A completed import is not a full-file integrity check.

When an NZB contains decoded PAR2 candidates, import logs one `PAR2 metadata discovery finished` summary listing descriptors found, verified proofs, unverified descriptors, a bounded sample of PAR2 slice sizes, and bounded download work. When a file's first article header conflicts with the NZB but no usable proof exists, import logs a `Conflicting yEnc metadata ... cannot use PAR2-verified recovery` warning with reasons such as no PAR2 descriptors, no match within the first 16,384 bytes, a descriptor length outside the size window, an unsupported slice size, or missing slice checksums. Article mismatch warnings also report `GeometryImpliedTotalParts`, the part count implied when the article's size, offset, and part number establish regular multipart geometry, and whether the requested ID was a primary or fallback message ID.
