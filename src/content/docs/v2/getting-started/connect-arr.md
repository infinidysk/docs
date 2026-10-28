---
title: Connect Radarr and Sonarr
description: Add infinidysk 2.x as a SABnzbd download client in your Arr instances.
---

infinidysk speaks the SABnzbd API, so every Arr adds it as a SABnzbd download client.

## Add the download client

In each Arr, add a **SABnzbd** download client:

| Field | Value |
|-------|-------|
| Host | `infinidysk` (the container name) |
| Port | `3000` |
| API key | The SAB API key from Settings |
| Category | One of the categories under Settings, for example `tv` or `movies` |

The Arr must see the mount at the same path infinidysk reports, `/mnt/infinidysk` by default. Bind the parent directory into the Arr container, for example `/mnt:/mnt:rslave`.

## Add the Arr to infinidysk

Add each Arr under Settings as an Arr instance with its URL and API key. Each instance has a type (Sonarr, Radarr, Lidarr, Readarr, Whisparr or Sportarr); there is one list for all of them.

infinidysk then finds out which categories each Arr owns by reading its download clients. You do not map categories by hand. The instance card shows what was found.

With an Arr connected, 2.x:

- tells the Arr to check its queue as soon as a job completes or fails;
- registers a webhook in the Arr, so it knows which library file came from which download;
- clears stuck queue entries the Arr cannot import (already imported, not an upgrade, sample, needs extraction) and, where it helps, blocklists the release and searches again;
- asks the Arr for a replacement when [health checks](/v2/guides/health/) find a broken file.

Queue clearing is on by default. Turn it off under Settings if you want to handle stuck entries yourself.

## Behind a reverse proxy

Set the public URL under Settings > Network when Arrs reach infinidysk through a proxy. Webhooks and STRM files use it.
