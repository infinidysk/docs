---
title: Run with Docker
description: Start a new infinidysk 2.x install with Docker Compose.
---

This sets up a new 2.x install. Coming from 1.x? Follow [Upgrade from 1.x](/v2/getting-started/upgrade/) instead, so your library and history carry over.

## Compose file

```yaml
services:
  infinidysk:
    image: ghcr.io/infinidysk/infinidysk-next:v2.0.0-alpha.8
    container_name: infinidysk
    restart: unless-stopped
    environment:
      PUID: 1000
      PGID: 1000
      TZ: Etc/UTC # your time zone, e.g. Europe/Oslo; the maintenance window follows it
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

Pin an alpha tag. There is no `latest` tag; `edge` follows every change and may be broken.

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

On shutdown the mount is removed. After a crash, the next start clears the dead mount. See [Restarts and crashes](/v2/guides/restarts/).

## Next

[Connect Radarr and Sonarr](/v2/getting-started/connect-arr/).
