---
title: Ports, paths and mount layout
description: The port, container paths and mount directories of infinidysk 2.x.
---

## Port

Port 3000 serves everything: the UI, the SABnzbd API, WebDAV, `.strm` playback links (`/view/…`) and, when turned on, Prometheus metrics (`/metrics`). Change the address with `INFINIDYSK_LISTEN`.

## Container paths

| Path | What it is |
|------|------------|
| `/config/infinidysk.sqlite` | The database, unless `INFINIDYSK_DATABASE_URL` points elsewhere. |
| `/config/logs/` | Log files. See [Logs and traces](/v2/operate/logs-traces/). |
| `/mnt/infinidysk` | The mount, by default. Set under Settings > Platform > Mount. |

## Mount layout

The mount and WebDAV show the same tree:

| Directory | What it holds |
|-----------|---------------|
| `content/` | Imported files, by category and job. Read-only. |
| `completed-symlinks/` | Links to completed downloads, mirroring `content/`. Arrs import from here with the symlink strategy. |
| `.ids/` | Every file by its id. Library symlinks point here. |
| `nzbs/` | Queued NZBs, by category. |
| `README` | A short description of the tree. |

To share the mount with other containers, see [Share the mount](/v2/install/media-servers/#share-the-mount).
