---
title: Run with Docker
description: Start a new infinidysk 2.x install with Docker Compose.
---

This sets up a new 2.x install. Coming from 1.x? Follow [Upgrade from 1.x](/v2/getting-started/upgrade/) instead, so your library and history carry over.

## Compose file

```yaml
services:
  infinidysk:
    image: ghcr.io/infinidysk/infinidysk-next:edge
    container_name: infinidysk
    restart: unless-stopped
    # pid: host # optional: show which process reads each file, see below
    environment:
      PUID: 1000
      PGID: 1000
      TZ: Etc/UTC # your time zone, e.g. Europe/Oslo; the maintenance window follows it
      # INFINIDYSK__MOUNT__EPOCH_TIMES: "true" # only if your old rclone mount used --no-modtime, see below
    ports:
      - "3000:3000"
    volumes:
      - ./config:/config
      - /mnt:/mnt:rshared
      - /sys/devices/virtual/bdi:/sys/devices/virtual/bdi:rw
    devices:
      - /dev/fuse:/dev/fuse
    cap_add:
      - SYS_ADMIN
    security_opt:
      - apparmor:unconfined
```

`edge` follows the latest 2.x build. There is no `latest` tag while 2.x is in alpha.

## First start

1. Run `docker compose up -d`.
2. Open `http://<host>:3000` and create the admin account.
3. Add your providers under Settings. See [Providers](/v2/configuration/providers/).

:::caution
Create the admin account before you expose port 3000 to an untrusted network. Until an admin exists, anyone who reaches the page can create one.
:::

## Where things are

- **Port 3000** serves the UI, the SABnzbd API and WebDAV.
- **The library** is mounted at `/mnt/infinidysk` by default. Change it under Settings, or with `INFINIDYSK__MOUNT__DIR`.
- **The database** is `/config/infinidysk.sqlite`. Set `INFINIDYSK_DATABASE_URL` to a `postgres://…` URL to use PostgreSQL instead.
- **Logs** go to `/config/logs/infinidysk.log` and the Logs page.

Containers that read the mount (Sonarr, Radarr, Plex and so on) need the same host path, for example `/mnt:/mnt:rslave`.

## FUSE in Docker

- `/dev/fuse`, `SYS_ADMIN` and `apparmor:unconfined` let the container mount. Without `/dev/fuse`, 2.x logs a warning and serves WebDAV only.
- `:rshared` on the parent directory makes the mount visible on the host and in other containers.
- The `/sys/devices/virtual/bdi` volume lets the Settings > Performance preset set the kernel's readahead. Docker mounts `/sys` read-only, so without it readahead stays at the kernel's 128 KB.

## Coming from rclone with `--no-modtime`

By default, media files on the mount report their import time as their date. An rclone mount with `--no-modtime` reported 1970 instead, and media servers re-read every file whose date changed. To keep the old dates and skip a full library rescan, set:

```yaml
    environment:
      INFINIDYSK__MOUNT__EPOCH_TIMES: "true"
```

Set it before your media server's first scan after the move. You can also turn on **Report 1970 file dates** under Settings; it takes effect after a restart.

## See which process reads a file

The mount shows the process name, pid and user of each reader. The kernel reports readers as seen from the infinidysk container, so a reader on the host or in another container (Plex, for example) shows as `pid unavailable` with only its user. Sharing the mount with `:rshared` does not change this.

To see those process names, add `pid: host` to the service:

```yaml
services:
  infinidysk:
    pid: host
```

:::caution
`pid: host` lets the container see every process on the host. Only add it if you accept that.
:::

## Restarts

On shutdown the mount is removed. After a crash, the next start clears the dead mount. See [Restarts and crashes](/v2/guides/restarts/).

## Next

[Connect Radarr and Sonarr](/v2/getting-started/connect-arr/).
