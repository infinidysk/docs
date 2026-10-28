---
title: "Infinite library with Arr"
---
Opinionated production path for maximum “always available” library feel with minimal local storage.

## Checklist

1. [Docker deploy](/v1/getting-started/docker/) with `/config` and shared `/mnt` (or equivalent).
2. [First run](/v1/getting-started/first-run/) — providers, WebDAV, API key.
3. Pick [import strategy](/v1/guides/import-strategies/):
   - Plex → symlinks + [rclone mount](/v1/guides/mounting-webdav/)
   - Emby/Jellyfin → STRM + Base URL
4. [Connect Radarr/Sonarr](/v1/getting-started/connect-arr/) as SAB client + register instances in infinidysk.
5. Enable [Repairs](/v1/configuration/repairs/) with **Library Directory**.
6. Optional: [Watchtower](/v1/features/watchtower/), indexer [profiles](/v1/configuration/profiles/), [backups](/v1/guides/backups-upgrades/).

```mermaid
sequenceDiagram
  participant Arr as Sonarr_Radarr
  participant NZB as infinidysk
  participant Mount as WebDAV_rclone
  participant Plex as Media_server
  Arr->>NZB: addfile NZB
  NZB->>NZB: mount on WebDAV
  NZB->>Arr: completed path
  Arr->>Mount: import symlink_or_STRM
  Plex->>Mount: read ranges
  Mount->>NZB: HTTP range
  NZB->>NZB: Usenet articles
```

## Operations

- Retention and unlinked-file cleanup — [Operations](/v1/operations/retention-cleanup/)
- Deletion surprises — [Deletion audit](/v1/operations/deletion-audit/)
- Speed tuning — Max Download Connections on [WebDAV](/v1/configuration/webdav/)
