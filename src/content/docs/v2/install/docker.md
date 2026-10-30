---
title: Run with Docker
description: Start a new infinidysk 2.x install with Docker Compose.
---

This sets up a new 2.x install. Coming from 1.x? Follow [Upgrade from 1.x](/v2/upgrade/) instead, so your library and history carry over.

## Compose file

```yaml
services:
  infinidysk:
    image: ghcr.io/infinidysk/infinidysk-next:edge
    container_name: infinidysk
    restart: unless-stopped
    # pid: host # optional: name the processes that read the mount, see Logs and traces
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

`edge` follows the latest 2.x build. There is no `latest` tag until 2.0 ships.

## First start

1. Run `docker compose up -d`.
2. Open `http://<host>:3000` and create the admin account.
3. Add your providers. See [Providers](/v2/install/providers/).

:::caution
Create the admin account before you expose port 3000 to an untrusted network. Until an admin exists, anyone who reaches the page can create one.
:::

## Where things are

- **Port 3000** serves the UI, the SABnzbd API and WebDAV.
- **The library** is mounted at `/mnt/infinidysk` by default. Change it under Settings > Platform > Mount, or with `INFINIDYSK__MOUNT__DIR`.
- **The database** is `/config/infinidysk.sqlite`. Set `INFINIDYSK_DATABASE_URL` to a `postgres://…` URL to use PostgreSQL instead.
- **Logs** go to `/config/logs/infinidysk.log` and the System page.

The full list is in [Ports, paths and mount layout](/v2/reference/paths/).

## FUSE in Docker

- `/dev/fuse`, `SYS_ADMIN` and `apparmor:unconfined` let the container mount. Without `/dev/fuse`, 2.x logs a warning and serves [WebDAV](/v2/operate/webdav/) only.
- `:rshared` on the parent directory makes the mount visible on the host and in other containers. They bind it with `:rslave`; see [Connect your media server](/v2/install/media-servers/).
- The `/sys/devices/virtual/bdi` volume lets the preset under Settings > Platform > Performance set the kernel's readahead. Docker mounts `/sys` read-only, so without it readahead stays at the kernel's 128 KB.
