---
title: Unattended deployment
description: Set up a new infinidysk 2.x install from a Compose file and secret files, check it offline, and restart it without losing accounts or IDs.
---

This page sets up a new 2.x install without the web UI. The Compose file and secret files create the admin account, the providers, the Arr instances and the delivery settings. A restart keeps the same settings, IDs and password.

:::note[Needs a newer build]
This needs the `edge` image built after [infinidysk#1970](https://github.com/infinidysk/infinidysk/pull/1970) merged, or the next beta. Older builds ignore the admin account variables and `_FILE` names.
:::

Read [Run with Docker](/v2/install/docker/) first for the volumes, `/dev/fuse` and the mount. This page adds only the deployment inputs. [Environment variables](/v2/reference/environment/) lists every setting.

## Files

```
infinidysk/
├── compose.yaml
├── config/                 # created on first start
└── secrets/
    ├── admin_password
    ├── admin_api_key
    ├── sab_api_key
    ├── webdav_password
    ├── providers.json
    └── arr_instances.json
```

Keep `secrets/` out of version control. Make the files readable only by you: `chmod 600 secrets/*`.

### Secret files

Each file holds one value. One line break at the end is removed, so `echo` and editors are fine.

```sh
mkdir -p secrets
openssl rand -base64 24 > secrets/admin_password
openssl rand -hex 32 > secrets/admin_api_key
openssl rand -hex 32 > secrets/sab_api_key
openssl rand -base64 24 > secrets/webdav_password
chmod 600 secrets/*
```

The admin password must have at least 8 characters.

### `secrets/providers.json`

The whole provider list, as JSON. It holds the provider passwords, so it is a secret file too.

```json
[
  {
    "name": "Main",
    "profile": "newshosting",
    "username": "your-username",
    "password": "your-password",
    "max_connections": 50,
    "priority": 0
  },
  {
    "name": "Fill",
    "hostname": "news.example.net",
    "port": 563,
    "username": "your-username",
    "password": "your-password",
    "max_connections": 20,
    "priority": 1
  }
]
```

- `Main` uses a catalog profile. Its hostname, port and backbone come from the [catalog](/v2/install/providers/).
- `Fill` is a custom provider. It needs `hostname`; `port` defaults to `563` with TLS.
- Providers with the same `priority` form one pool. `Fill` is asked only when `Main` misses.

### `secrets/arr_instances.json`

```json
[
  {
    "name": "Sonarr",
    "profile": "sonarr",
    "url": "http://sonarr:8989",
    "api_key": "your-sonarr-api-key"
  },
  {
    "name": "Radarr",
    "profile": "radarr",
    "url": "http://radarr:7878",
    "api_key": "your-radarr-api-key"
  }
]
```

### `compose.yaml`

```yaml
services:
  infinidysk:
    image: ghcr.io/infinidysk/infinidysk-next:edge
    container_name: infinidysk
    restart: unless-stopped
    environment:
      # Startup variables
      PUID: 1000
      PGID: 1000
      TZ: Etc/UTC

      # The admin account, created on the first start
      INFINIDYSK_ADMIN_USERNAME: admin
      INFINIDYSK_ADMIN_PASSWORD_FILE: /run/secrets/admin_password

      # Keys other tools must know in advance
      INFINIDYSK__AUTH__API_KEY_FILE: /run/secrets/admin_api_key
      INFINIDYSK__SAB__API_KEY_FILE: /run/secrets/sab_api_key

      # Providers and Arr instances (whole lists)
      INFINIDYSK__PROVIDERS_FILE: /run/secrets/providers.json
      INFINIDYSK__ARR_INSTANCES_FILE: /run/secrets/arr_instances.json

      # Delivery
      INFINIDYSK__MOUNT__DIR: /mnt/infinidysk
      INFINIDYSK__IMPORTS__STRATEGY: symlinks
      INFINIDYSK__IMPORTS__LIBRARY_DIRS: '[{"path":"/mnt/media"}]'
      INFINIDYSK__WEBDAV__USER: webdav
      INFINIDYSK__WEBDAV__PASSWORD_FILE: /run/secrets/webdav_password
      INFINIDYSK__SAB__CATEGORIES: '["tv","movies"]'
    secrets:
      - admin_password
      - admin_api_key
      - sab_api_key
      - webdav_password
      - providers.json
      - arr_instances.json
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

secrets:
  admin_password:
    file: ./secrets/admin_password
  admin_api_key:
    file: ./secrets/admin_api_key
  sab_api_key:
    file: ./secrets/sab_api_key
  webdav_password:
    file: ./secrets/webdav_password
  providers.json:
    file: ./secrets/providers.json
  arr_instances.json:
    file: ./secrets/arr_instances.json
```

The database is SQLite in `/config`. For PostgreSQL, put the URL in a secret file and set `INFINIDYSK_DATABASE_URL_FILE`; see [Move to PostgreSQL](/v2/operate/postgresql/#use-infinidysk_database_url-instead).

## Check before the first start

```sh
docker compose run --rm --no-deps infinidysk config validate
```

| Exit code | Output | Meaning |
|-----------|--------|---------|
| `0` | `fresh-install configuration valid` | Every variable is valid for a new install. |
| `1` | `invalid: <reason>` | The reason names the variable or setting. It never shows the value. |
| `2` | `usage: infinidysk config validate` | Wrong arguments. |

The check is offline. It creates no database, folder or log, and it connects to nothing. It builds each enabled provider's connection settings but does not log in, so a wrong password shows only after the start. It checks a new install, so it does not see settings saved in an existing database.

## First start

```sh
docker compose up -d
docker compose logs infinidysk | grep "created the admin account"
```

Check that setup is closed and the settings came from the files:

```sh
curl -s http://localhost:3000/api/v1/auth
# {"required":true,"setup_required":false,"account":true,...}

curl -s -H "X-Api-Key: $(cat secrets/admin_api_key)" \
  http://localhost:3000/api/v1/settings \
  | jq '{locked, providers: [.settings.providers[] | {name, id}], arr: [.settings.arr_instances[] | {name, id}]}'
```

The account exists before the UI and the API start, so `setup_required` is never `true` and nobody can claim the install from the setup page.

The Arrs use the key in `secrets/sab_api_key`. Add infinidysk to each Arr as a SABnzbd download client; see [Connect Arr instances](/v2/install/connect-arr/).

## Restart

```sh
docker compose restart infinidysk
```

Run the `curl … /api/v1/settings` command again. The provider and Arr IDs are the same. The admin password is the same: an existing account always wins over `INFINIDYSK_ADMIN_PASSWORD`, so the variable never resets it. Change the password in the UI.

## How the inputs work

### Precedence

```
INFINIDYSK__… variables (direct or _FILE)
  > settings saved in the UI or with the API
  > built-in defaults
```

A setting a variable sets shows as **Set by environment** in the UI and is locked there and in the API. It is never written to the database. Remove the variable and restart to get the saved value back.

### `_FILE` variables

Add `_FILE` to any `INFINIDYSK__…` name, to `INFINIDYSK_DATABASE_URL` and to the admin account variables. The value is then an absolute path, and infinidysk reads the setting from that file.

- Setting both `NAME` and `NAME_FILE` stops startup.
- A missing, unreadable or non-UTF-8 file stops startup. The error never shows the file's content.
- For a secret inside a list, such as a provider password, put the whole list in the file (`INFINIDYSK__PROVIDERS_FILE`).

### Lists and IDs

- `INFINIDYSK__PROVIDERS` and `INFINIDYSK__ARR_INSTANCES` replace the whole list. You cannot set one field of one entry.
- `id` is optional. Without one, the ID comes from the entry's `name`. An unnamed provider uses its `profile`, else its `hostname`. Reordering entries or changing credentials keeps the ID.
- Give entries distinct names within a list. Two entries with the same ID stop startup.
- A new name means a new ID, with new quota counters and new Arr webhook URLs. To rename an entry and keep its history, copy its current `id` from `GET /api/v1/settings` into the file first.
- Moving an entry from the UI into a file: copy its `id` too, and its real credentials, not the masked values the API returns.

### Validation

A wrong input stops startup with one line that names the variable or setting:

- an `INFINIDYSK__…` or `INFINIDYSK_ADMIN_…` name that is not a setting;
- a value of the wrong type, or a JSON property that does not exist or is miscased;
- a value out of range, such as `INFINIDYSK__QUEUE__CONCURRENCY=50`;
- a parent and a child set together, such as `INFINIDYSK__QUEUE` and `INFINIDYSK__QUEUE__CONCURRENCY`;
- only one of `INFINIDYSK_ADMIN_USERNAME` and `INFINIDYSK_ADMIN_PASSWORD`;
- an empty generated key, such as `INFINIDYSK__SAB__API_KEY=""`. A key a variable sets is never generated.

Values saved in the database before an upgrade keep loading. Out-of-range saved values log a warning and use the default.

### What needs a restart

A change to any variable or secret file needs `docker compose up -d --force-recreate infinidysk`. Compose does not notice a changed secret file, so plain `up -d` can keep the old container, and a restart alone does not read a changed Compose file.

Settings changed in the UI or the API apply at once, except these, which apply after a restart: the mount folder, the built-in FUSE mount on or off, read-ahead memory, FUSE tuning, experiments and the remote rclone mount. `GET /api/v1/settings` then returns `"restart_required": true`. Restart with `POST /api/v1/restart`.

## Change settings later with the API

For settings that are not in the Compose file, `PATCH /api/v1/settings` changes only what you send:

```sh
KEY=$(cat secrets/admin_api_key)
REV=$(curl -s -H "X-Api-Key: $KEY" http://localhost:3000/api/v1/settings | jq -r .revision)
curl -s -X PATCH -H "X-Api-Key: $KEY" -H "Content-Type: application/json" \
  -d "{\"revision\":\"$REV\",\"changes\":{\"health\":{\"check_percent\":10}}}" \
  http://localhost:3000/api/v1/settings | jq .settings.health
```

- Objects merge. Values and lists replace.
- `revision` must be the one you read. If anything changed since, the answer is `409`; read again and retry.
- A setting a variable sets answers `400` with its path.
- A list entry that keeps its `id` keeps a password or key it leaves out.
- `PUT /api/v1/settings` still replaces every setting.
