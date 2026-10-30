---
title: "Mount WebDAV with rclone"
---
Symlink imports need the infinidysk WebDAV tree on the host filesystem. Use rclone (sidecar or host mount).

The guided [Setup Guide](/v1/getting-started/setup-guide/) shows these sidecar
flags, configures RC notifications, tests the connection, and disables infinidysk
Segment Cache for Symlink/Plex libraries.

## Prepare the mount point

```bash
sudo mkdir -p /mnt/remote/nzbdav
sudo chown -R $(id -u):$(id -g) /mnt/remote/nzbdav
```

## Rclone config

Obscure the WebDAV password:

```bash
docker run --rm -it rclone/rclone obscure "<your-webdav-password>"
```

`rclone.conf`:

```ini
[nzbdav]
type = webdav
url = http://nzbdav:8080/
vendor = other
user = your-webdav-user
pass = your-obscured-password
```

:::caution
The rclone sidecar is a backend service and shares the Compose network with
infinidysk. Point it directly at the backend on port `8080`. Sending WebDAV
traffic through the frontend on port `3000` adds proxy overhead and reduces
streaming performance. Use the frontend URL only when an rclone client cannot
reach the backend over the network. Do not publish backend port `8080`
to an untrusted network; browser and admin traffic should keep using port
`3000`.
:::

```bash
chmod 600 rclone.conf
```

:::note
Rclone's obscured password is not strong encryption — protect the file.
:::

### Frontend proxy warning <a class="since" href="https://github.com/infinidysk/infinidysk/releases/tag/v1.3.0">since 1.3.0</a>

If the frontend detects an rclone client on port `3000`, it emits an operator warning
at most once every 30 minutes and shows a non-dismissible warning in the admin UI.
Continued proxied traffic keeps the warning active. After rclone is moved to port `8080`,
the warning clears once the 30-minute observation window expires. An open admin tab
refreshes this status once per minute.

## Sidecar Compose service

```yaml
  nzbdav_rclone:
    image: rclone/rclone:latest
    container_name: nzbdav_rclone
    restart: unless-stopped
    environment:
      TZ: America/New_York
    volumes:
      - /mnt:/mnt:rshared
      - ./rclone.conf:/config/rclone/rclone.conf:ro
      - ./rclone-cache:/cache
    cap_add:
      - SYS_ADMIN
    security_opt:
      - apparmor:unconfined
    devices:
      - /dev/fuse:/dev/fuse:rwm
    depends_on:
      nzbdav:
        condition: service_healthy
        restart: true
    command: >
      mount nzbdav: /mnt/remote/nzbdav
        --cache-dir=/cache
        --uid=1000
        --gid=1000
        --allow-other
        --links
        --use-cookies
        --vfs-cache-mode=full
        --vfs-cache-max-size=50G
        --vfs-cache-max-age=1w
        --buffer-size=0
        --vfs-read-ahead=512M
        --dir-cache-time=20s
```

The VFS cache flags match the [Setup Guide](/v1/getting-started/setup-guide/). The Setup
Guide also enables RC notifications, which lets it use `--dir-cache-time=1w` with
`--poll-interval=0`; without RC, keep the short `--dir-cache-time` shown here.

```bash
docker compose up -d nzbdav_rclone
ls -la /mnt/remote/nzbdav
# Expect: .ids, completed-symlinks, content, nzbs
```

## Flag cheat sheet

| Flag | Why |
|------|-----|
| `--links` | Turn `*.rclonelink` into real symlinks (rclone ≥ 1.70.3) |
| `--use-cookies` | Avoid re-auth on every request |
| `--vfs-cache-mode=full` | Disk-backed read cache for smooth seeks |
| `--buffer-size=0` | Avoid double-caching with VFS |
| `--vfs-read-ahead=512M` | Buffer ahead for high-bitrate spikes |
| `--dir-cache-time=20s` | Fresh listings without RC; raise if using RC notifications |

## Optional RC notifications

Append to the mount command:

```yaml
        --rc
        --rc-addr=:5572
        --rc-user=rclone
        --rc-pass=your-rc-password
```

Then **Settings → Rclone Server**: enable notifications, host `http://nzbdav_rclone:5572`, matching credentials. Once RC works, raise `--dir-cache-time` (the Setup Guide uses `1w` with `--poll-interval=0`).

[Rclone settings](/v1/configuration/rclone/)
