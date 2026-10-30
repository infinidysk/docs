---
title: Connect Arr instances
description: Add infinidysk 2.x as a SABnzbd download client in Sonarr, Radarr and other Arrs, and add the Arrs to infinidysk.
---

infinidysk speaks the SABnzbd API, so every Arr adds it as a SABnzbd download client.

## Add the download client

In each Arr, add a **SABnzbd** download client:

| Field | Value |
|-------|-------|
| Host | `infinidysk` (the container name) |
| Port | `3000` |
| API key | The API key under Settings > Automation > Download client > Connection |
| Category | One of the categories under Settings > Automation > Download client > Categories, for example `tv` or `movies` |

The Arr imports from the mount, so it must see the mount at the same path infinidysk does. See [Share the mount](/v2/install/media-servers/#share-the-mount).

## Add the Arr to infinidysk

Add each Arr under Settings > Automation > Arr instances with its URL and API key. Each instance has a type (Sonarr, Radarr, Lidarr, Readarr, Whisparr or Sportarr); there is one list for all of them.

infinidysk then finds out which categories each Arr owns by reading its download clients. You do not map categories by hand. The instance shows what was found.

With an Arr connected, 2.x:

- tells the Arr to check its queue as soon as a job completes or fails;
- registers a webhook in the Arr, so it knows which library file came from which download;
- clears stuck queue entries the Arr cannot import (already imported, not an upgrade, sample, needs extraction) and, where it helps, blocklists the release and searches again;
- asks the Arr for a replacement when [health checks](/v2/how-it-works/health/) find a broken file.

Queue clearing is on by default. To handle stuck entries yourself, turn off **Clear stuck imports** under Settings > Automation > Imports > Arr queue.

If your Arrs reach infinidysk through a reverse proxy, set the public URL; see [Reverse proxy](/v2/operate/reverse-proxy/).
