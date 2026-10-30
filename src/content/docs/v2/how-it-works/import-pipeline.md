---
title: Import pipeline
description: What infinidysk 2.x checks before a job completes, and why a job fails.
---

A job completes only when its media can play from start to end. Before that, infinidysk:

1. reads the NZB, PAR2 names and archive headers (stored RAR4, RAR5 and 7z members, multipart files);
2. drops PAR2, NFO and SFV files, executables, scripts and samples;
3. renames obfuscated media from PAR2 names or the job name;
4. checks a sample of the articles on your providers, and the last article of every media file;
5. checks that each video file starts the way its extension says it should.

A confirmed missing article in a media file, a fake payload, or no media the owning Arr can import fails the job, so the Arr can blocklist the release and grab another. Timeouts and provider errors never fail a job; it waits and tries again.

Compressed archives cannot be streamed. Only stored (uncompressed) archive members play.

The sample size is the **Sample size** health setting; see [Health checks and repair](/v2/how-it-works/health/#settings). How a completed job reaches the Arr depends on the [import strategy](/v2/install/import-strategy/).
