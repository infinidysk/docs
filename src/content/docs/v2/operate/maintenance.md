---
title: Maintenance
description: The daily maintenance window in 2.x and the jobs that remove unlinked files, remove dead links and compact the database.
---

Maintenance jobs are housekeeping tasks. Each one can run by hand, as a dry run, or once in every daily maintenance window. They live under Settings > System > Maintenance.

## The window

The window runs from 03:00 to 06:00 by default, in the container's time zone. Set `TZ` on the container (for example `TZ=Europe/Oslo`); without it the server uses UTC.

Every scheduled job runs once per window, one after another. A restart inside the window runs only what is left. A job still running when the window ends is stopped and runs again in the next one.

**Run now** and **Dry run** ignore the window. A dry run lists what the job would do and changes nothing. One job runs at a time.

## Remove unlinked files

Deletes downloads nothing in your library uses. A file is **unlinked** when no symlink or STRM file in a library folder points to it and its job is no longer in the download history. Files you only played through the mount or WebDAV count as unlinked.

The job refuses to delete anything when:

- no library folder is set, or one is missing, unreadable or empty;
- fewer than 5 pointers are found;
- a library conversion is running or unfinished;
- an Arr does not answer, or one of its root folders is outside every library folder.

When more than 90% of the files checked would go, it deletes nothing and waits for you to review the list. Files open in a player are skipped.

## Remove dead links

Removes symlinks and STRM files in your library that point to downloads that no longer exist, for example ones a health check deleted. Sonarr and Radarr drop the file and search again for monitored media. Scheduled by default.

When more than 5% of the links would go, it removes nothing and waits for review.

## Compact database

Gives unused space in the SQLite files back to the disk. Always scheduled; skipped on PostgreSQL. In the window it runs only when at least 25% and 100 MB can be reclaimed, and never while imports run.
