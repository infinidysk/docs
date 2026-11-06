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
- **The database** is `/config/infinidysk.sqlite`. To use PostgreSQL instead, see [Move to PostgreSQL](/v2/operate/postgresql/).
- **Logs** go to `/config/logs/infinidysk.log` and the System page.

The full list is in [Ports, paths and mount layout](/v2/reference/paths/).

## FUSE in Docker

- `/dev/fuse`, `SYS_ADMIN` and `apparmor:unconfined` let the container mount. Without `/dev/fuse`, 2.x logs a warning and serves [WebDAV](/v2/operate/webdav/) only. WebDAV-only setups can [turn the mount off](/v2/operate/webdav/#without-fuse) and drop these.
- `:rshared` on the parent directory makes the mount visible on the host and in other containers. They bind it with `:rslave`; see [Connect your media server](/v2/install/media-servers/).
- The `/sys/devices/virtual/bdi` volume lets infinidysk raise the kernel's readahead for the mount. It is optional; see [Readahead volume](#readahead-volume).

### Readahead volume

The mount works without this volume. It only makes sequential reads faster.

- The kernel limits how far ahead it reads on a FUSE mount with a per-mount setting, `read_ahead_kb`. The default is 128 KB, and infinidysk cannot ask for more at mount time.
- The only way to change it is to write to `/sys/class/bdi/<device>/read_ahead_kb`, which points into `/sys/devices/virtual/bdi`.
- Docker mounts `/sys` read-only, so that write fails. Binding `/sys/devices/virtual/bdi` with `:rw` makes only that directory writable; the rest of `/sys` stays read-only.

With 128 KB, a player reading a file from start to end sends many small reads to infinidysk. A larger window means fewer, larger reads, and more of the file is on its way before the player asks for it. That gives smoother playback, mostly on high-bitrate files.

The value comes from the preset under Settings > Platform > Performance, or from `performance.fuse_max_readahead_kb` (see [Environment variables](/v2/reference/environment/)).

Without the volume, infinidysk keeps the kernel's 128 KB and logs one warning at start: `FUSE readahead stays at the kernel default`.

## Health check

The image has a built-in health check, so the compose file needs no `healthcheck:` block. `docker ps` shows the container as `starting`, `healthy` or `unhealthy`.

Healthy means all of these hold:

- The server answers on its port.
- The database answers.
- The import worker runs.
- The mount is mounted and answers. Without `/dev/fuse`, or with the built-in mount turned off, the mount is not checked.

A normal start turns healthy within seconds. The first start after an [upgrade from 1.x](/v2/upgrade/run/) stays `starting` until the import is done. If the import takes longer than the 10-minute start period, the container shows `unhealthy` until it ends.

The check runs inside the container, so it cannot see whether `:rshared` carries the mount to the host. Check that once from your media server; see [Connect your media server](/v2/install/media-servers/#share-the-mount).

### Wait for the mount

Containers that read the mount can wait until infinidysk is healthy:

```yaml
services:
  plex:
    depends_on:
      infinidysk:
        condition: service_healthy
```

`docker compose up` then starts the media server after the mount is up. If infinidysk turns unhealthy first, for example during a long 1.x import, Compose does not start the media server. Run `docker compose up -d` again once infinidysk is healthy.

### Change the timing

The built-in check runs every 30 seconds and marks the container unhealthy after 3 failures in a row. Override it in the compose file:

```yaml
services:
  infinidysk:
    healthcheck:
      interval: 15s
      retries: 5
```

### What it asks

The check runs `infinidysk healthcheck`, which asks `GET /healthz` on the address in `INFINIDYSK_LISTEN` and exits 0 when healthy, 1 otherwise. It needs no `curl` and never reads the mount itself, so a stuck mount cannot hang it.

`/healthz` answers without sign-in and shows no settings or secrets. It answers 200 when healthy and 503 while starting or unhealthy:

```json
{"status":"healthy","checks":{"database":"pass","mount":"pass","queue":"pass"}}
```

Each check is `pass`, `fail`, `pending` (not ready yet) or `off` (does not apply, for example `mount` without `/dev/fuse` or with the built-in mount turned off). During the first start after an upgrade, the body has one `import` check instead. The reason a check fails is in the [log](/v2/operate/logs-traces/), not in the answer.
