---
title: Health checks and repair
description: How 2.x finds missing articles, when it asks an Arr for a replacement, and the settings that control it.
---

Health checks look for files whose articles have gone missing from your providers, ideally before you press play. A file that cannot be fixed is replaced through its Arr.

## Principles

- Nothing is deleted or replaced on weak evidence. Timeouts, provider errors and authentication failures never count as missing data.
- Two confirmed misses at least 15 minutes apart are needed before anything destructive happens.
- Health work yields to playback and imports.
- A file open in a player is never hidden or replaced.

## What a check does

A check asks your providers whether a sample of the file's articles exist (5% by default, at least 5), then downloads three of them and verifies their checksums. For MP4 files it also reads the container layout.

New releases are checked often; a check is due again after about as long as the release has been posted, up to 90 days. A file that failed during playback goes to the front of the queue.

## States

| State | Meaning |
|-------|---------|
| Unchecked | Imported, not checked yet. |
| Healthy | The last check found nothing wrong. |
| Degraded | A few articles are missing, within limits a player can survive; gaps are filled during playback. |
| Suspect | One confirmed miss; a second check follows in 15 minutes. |
| Repairing | Damage confirmed; a replacement is being requested. |
| Hidden | The Arr accepted a replacement request; the file is hidden until the new one imports, or for up to 24 hours. |
| Action needed | infinidysk cannot or may not fix it; it is listed on the Health page. |
| Ignored | You chose to stop monitoring it. |

## Repair

When a file is confirmed broken and its Arr is known, 2.x blocklists the release in that Arr, waits up to two minutes for the Arr to queue a replacement, and otherwise deletes the Arr's file and starts a search. Each file gets three attempts, with a growing wait between them.

The rejected release is remembered for 14 days, so the Arr cannot import the same copy again. At most three searches per episode or movie run in 30 minutes.

A broken file no Arr imported (unowned) is deleted by default. Installs upgraded from 1.x mark it "action needed" instead.

PAR2 reconstruction is not in 2.x yet.

## Settings

Under Settings > Automation > Health monitoring:

| Setting | What it does |
|---------|--------------|
| **Routine checks** | Run routine checks. Playback failures are still recorded when off. On by default. |
| **Health sample size** | `health.check_percent`: articles checked by scheduled checks, re-checks and playback reports, 5–100%. 5% by default. |
| **Analyze media automatically** | Read each good media file once with ffprobe and show its codecs in the Explorer. Never changes health. On by default. |
| **Replace broken files automatically** | Ask the Arr for a replacement. Off marks the file "action needed" instead. On by default. |
| **Broken files not imported by an Arr** | Delete them (the default), or mark them "action needed". |
| **Keep files with small gaps** | Allow playback over small gaps. Off treats any confirmed miss as missing. On by default. |

The separate **Import sample size** control is under Settings > Automation > Imports; see [Settings](/v2/reference/settings/).

Set `INFINIDYSK__HEALTH__IMPORT_CHECK_PERCENT=100` to check every article during import while keeping `INFINIDYSK__HEALTH__CHECK_PERCENT=5` for later checks. Omitting the import setting uses its default of 5; `null` is not accepted. Saved changes apply to subsequent import attempts; an attempt already running keeps its starting value. Full availability checks do not download and verify the entire file.
