---
title: Restarts and crashes
description: What happens to the mount, open files and Plex when infinidysk 2.x stops, crashes or restarts.
---

## Startup

Nothing is rebuilt at startup. The library is servable as soon as the mount is up, whatever its size. If the previous process died without unmounting, startup clears the dead mount and logs `cleared a stale FUSE mount`.

## Stopping

| What happens | Graceful stop (`docker stop`) | Crash (`kill -9`, out of memory) |
|---|---|---|
| Unmount | Clean, about 1 ms. A file still open makes it fall back to a lazy detach. | None. The kernel keeps a dead mount until the next start clears it. |
| Reads while down | The mount point is an empty directory. | "Transport endpoint is not connected". |
| Gap with `restart: unless-stopped` | 0.2 to 2.5 s | About 0.3 s plus startup |

## Open files

Open files do not survive a restart. A player holding a file open gets an error on its next read and must open the file again.

In Plex, the transcoder treats the error as the end of the file. The client keeps playing what was already buffered, then returns to the library with no error. Plex saves a resume point as usual. Pressing play again works.

## Plex library scans

A restart does not start a Plex scan. A scan that runs **while infinidysk is down** cannot read the symlinks and moves those items to the trash.

- With "Empty trash automatically after every scan" **off**, the next scan restores them with their metadata and watch state.
- With it **on**, they are deleted and added again as new items, losing watch state, collections and playlists.

:::tip
Turn off "Empty trash automatically after every scan" in Plex, and avoid scheduled scans during planned downtime.
:::

## STRM libraries

With the [STRM strategy](/v2/install/import-strategy/), media servers read `.strm` files on their own disk, so a scan while infinidysk is down keeps every item. Playback started while it is down fails at once; pressing play again after it is back works.

## Restart from the UI

The mount directory, file dates, read-ahead memory and FUSE tuning are read only at startup. When you change one, Settings offers a restart. It is a graceful stop and start inside the same container, so it works with any Docker restart policy. Running imports continue from the queue afterwards.

## Logs

The log file keeps the lead-up to a crash, and the System page shows the previous run after a restart. See [Logs and traces](/v2/operate/logs-traces/).
