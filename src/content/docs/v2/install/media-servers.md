---
title: Connect your media server
description: Share the infinidysk 2.x mount with Plex, Jellyfin and the Arrs, and set up Plex so restarts do not cost watch state.
---

## Share the mount

infinidysk mounts the library inside its own container. With `/mnt:/mnt:rshared` in its [compose file](/v2/install/docker/#compose-file), the mount also shows on the host. Every container that reads it (Sonarr, Radarr, Plex, Jellyfin) binds the same parent directory with `:rslave`:

```yaml
services:
  plex:
    volumes:
      - /mnt:/mnt:rslave
```

Use the same path in every container. Library symlinks point to absolute paths under the mount (`/mnt/infinidysk/.ids/…` by default), so a container that sees the mount somewhere else cannot follow them.

Check from the media server container:

```sh
docker compose exec plex ls /mnt/infinidysk   # expect .ids, completed-symlinks, content, nzbs
```

## Plex

A Plex scan that runs while infinidysk is down cannot read the symlinks and moves those items to the trash. With **Empty trash automatically after every scan** on, Plex deletes them and adds them again as new items, losing watch state, collections and playlists.

- Turn off **Empty trash automatically after every scan**. The next scan then restores the items with their metadata.
- Avoid scheduled scans during planned downtime.

See [Restarts and crashes](/v2/how-it-works/restarts/#plex-library-scans).

## STRM libraries

With the [STRM import strategy](/v2/install/import-strategy/), the media server plays each file over HTTP from the URL in its `.strm` file and does not need the mount. It needs to reach the public URL instead; see [Reverse proxy](/v2/operate/reverse-proxy/#public-url).
