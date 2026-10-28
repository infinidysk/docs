---
title: Import strategies
description: How completed jobs are handed to the Arrs in 2.x, as symlinks or STRM files, and how the library converts between them.
---

When a job completes, the Arr imports it in one of two forms. Pick one under Settings; the setting applies to the whole install.

| Strategy | What the Arr imports | Media server reads |
|----------|----------------------|--------------------|
| Symlinks (default) | Symlinks from `<mount>/completed-symlinks/<category>/<job>` | The mount, through the symlink |
| STRM | `.strm` files written to the STRM folder, each holding a signed playback URL | An HTTP URL; it does not need the mount |

Categories owned by a music or book Arr always hand off as symlinks.

## What a job must pass

A job completes only when its media can play from start to end. Before that, infinidysk:

1. reads the NZB, PAR2 names and archive headers (stored RAR4, RAR5 and 7z members, multipart files);
2. drops PAR2, NFO and SFV files, executables, scripts and samples;
3. renames obfuscated media from PAR2 names or the job name;
4. checks a sample of the articles on your providers, and the last article of every media file;
5. checks that each video file starts the way its extension says it should.

A confirmed missing article in a media file, a fake payload, or no media the owning Arr can import fails the job, so the Arr can blocklist the release and grab another. Timeouts and provider errors never fail a job; it waits and tries again.

Compressed archives cannot be streamed. Only stored (uncompressed) archive members play.

## Library folders

Set the folders that hold your Arrs' libraries under Settings, with the path the Arrs see when it differs. infinidysk only reads its own pointers in them: symlinks into `<mount>/.ids/` and its own `.strm` files. Nothing else is read or changed.

Library folders are needed for:

- switching strategy, changing the STRM key or public URL, and moving the mount;
- the maintenance jobs that remove unlinked files and dead links (see [Maintenance](/v2/guides/maintenance/)).

## Switching strategy

Picking the other strategy starts a preview. It walks the library folders without writing and lists what will change, the files each Arr will rescan, name conflicts and any problems with a folder. Confirm it to start the conversion.

- Symlinks to videos become `.strm` files, and the other way around.
- Subtitle symlinks become real subtitle files in STRM mode.
- Each Sonarr and Radarr rescans the converted series or movies, and infinidysk restores their quality, language and monitored state afterwards.
- A conversion resumes after a restart or crash. Cancel stops after the current file and leaves a mixed library, which still plays.

Settings saved without a preview (through the API or environment variables) apply to new jobs only, and every page shows "Library not in the current form" until a preview applies them.
